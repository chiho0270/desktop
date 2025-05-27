import asyncio
import hashlib
from fastapi import FastAPI, HTTPException, Depends, Body
from pydantic import BaseModel
from backend.db.connect import create_connection, close_connection
from backend.db.routers import fetch_all_data, fetch_data_with_condition
from backend.scheduler.danawaparser import DanawaParser
from fastapi.middleware.cors import CORSMiddleware

ALLOWED_TABLES = {
    "parts": {"product_id", "part_type", "manufacturer", "model_name", "price", "launch_price"},
    "cpu": {"product_id", "model_name", "manufacturer", "core_count", "thread_count", "base_clock", "bost_clock", "tdp", "integrated_graphics", "process_size", "socket_type"},
    "mainboard": {"product_id", "model_name", "manufacturer", "chipset", "cpu_socket", "memory_type", "mosfet", "color"},
    "ram": {"product_id", "model_name", "manufacturer", "clock", "memory_type", "memory_size", "color"},
    "ssd": {"product_id", "model_name", "manufacturer", "capacity", "sequential_read", "sequential_write"},
    "vga": {"product_id", "model_name", "manufacturer", "memory_size", "memory_type", "base_clock_speed", "boost_clock_speed", "cuda_cores", "tdp", "color"},
    "price_history": {"history_id", "product_id", "price", "recorded_at", "launch_price"},
    "user": {"user_id", "email", "password", "name", "created_at"},
    "post": {"post_id", "user_id", "title", "content", "photo_url", "created_at"},
    "wishlist": {"wishlist_id", "user_id", "product_id", "added_at"},
    "estimate": {"estimate_id", "user_id", "created_at", "total_price", "budget", "purpose", "preferred_brand"},
    "estimateitem": {"item_id", "estimate_id", "product_id"}
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### 다나와 파서
async def run_parser_periodically():
    while True:
        print("Running DanawaParser...")
        connection = create_connection()
        if not connection:
            print("Database connection failed")
        else:
            #parser = DanawaParser()
            #for product in parser.productID:
            #    await parser.parse_product(product["url"], product["id"], connection)
            close_connection(connection)
            print("Parser run completed.")
        await asyncio.sleep(86400)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(run_parser_periodically())

### 회원가입
class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

@app.post("/signup")
def signup(data: SignupRequest):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="연결 실패")
    existing = fetch_data_with_condition(connection, "users", "email", data.email)
    if existing:
        close_connection(connection)
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다")
    hashed_pw = hashlib.sha256(data.password.encode()).hexdigest()
    cursor = connection.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (email, password, name) VALUES (%s, %s, %s)",
            (data.email, hashed_pw, data.name)
        )
        connection.commit()
    except Exception as e:
        print("Signup error:", e)
        close_connection(connection)
        raise HTTPException(status_code=500, detail="등록 실패")
    close_connection(connection)
    return {"message": "Signup successful"}

### 로그인
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(data: LoginRequest):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="연결 실패")
    user = fetch_data_with_condition(connection, "users", "email", data.email)
    close_connection(connection)
    if not user:
        raise HTTPException(status_code=401, detail="로그인 정보가 일치하지 않습니다")
    hashed_pw = hashlib.sha256(data.password.encode()).hexdigest()
    if user["password"] != hashed_pw:
        raise HTTPException(status_code=401, detail="로그인 정보가 일치하지 않습니다")
    return {"message": "Login successful", "user": {"email": user["email"], "name": user["name"]}}

### 사용자 정보 조회
class UpdateNameRequest(BaseModel):
    email: str
    name: str

@app.patch("/user/update_name")
def update_name(data: UpdateNameRequest):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="연결 실패")
    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE users SET name=%s WHERE email=%s", (data.name, data.email))
        connection.commit()
        if cursor.rowcount == 0:
            close_connection(connection)
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    except Exception as e:
        print("Name update error:", e)
        close_connection(connection)
        raise HTTPException(status_code=500, detail="이름 변경 실패")
    close_connection(connection)
    return {"message": "이름이 성공적으로 변경되었습니다."}

### 비밀번호 변경
class UpdatePasswordRequest(BaseModel):
    email: str
    old_password: str
    new_password: str

@app.patch("/user/update_password")
def update_password(data: UpdatePasswordRequest):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="연결 실패")
    user = fetch_data_with_condition(connection, "users", "email", data.email)
    if not user:
        close_connection(connection)
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    hashed_old = hashlib.sha256(data.old_password.encode()).hexdigest()
    if user["password"] != hashed_old:
        close_connection(connection)
        raise HTTPException(status_code=400, detail="현재 비밀번호가 일치하지 않습니다.")
    hashed_new = hashlib.sha256(data.new_password.encode()).hexdigest()
    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE users SET password=%s WHERE email=%s", (hashed_new, data.email))
        connection.commit()
    except Exception as e:
        print("Password update error:", e)
        close_connection(connection)
        raise HTTPException(status_code=500, detail="비밀번호 변경 실패")
    close_connection(connection)
    return {"message": "비밀번호가 성공적으로 변경되었습니다."}