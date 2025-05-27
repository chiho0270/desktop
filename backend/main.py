import asyncio
import hashlib
from fastapi import FastAPI, HTTPException, Depends, Body, UploadFile, File, Form, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from backend.db.connect import create_connection, close_connection
from backend.db.routers import fetch_all_data, fetch_data_with_condition
from backend.scheduler.danawaparser import DanawaParser
from datetime import datetime
import os
from typing import Optional, List

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

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

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

### 게시물 작성
@app.post("/post/create")
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    summary: str = Form(...),
    email: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="연결 실패")
    # 사용자 확인
    user = fetch_data_with_condition(connection, "users", "email", email)
    if not user:
        close_connection(connection)
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    # 이미지 저장
    photo_url = None
    if image:
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{image.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(image.file.read())
        photo_url = f"/uploads/{filename}"
    # DB 저장
    cursor = connection.cursor()
    try:
        cursor.execute(
            "INSERT INTO posts (user_id, title, content, photo_url, created_at) VALUES (%s, %s, %s, %s, NOW())",
            (user["user_id"], title, content, photo_url)
        )
        connection.commit()
    except Exception as e:
        print("Post create error:", e)
        close_connection(connection)
        raise HTTPException(status_code=500, detail="글 작성 실패")
    close_connection(connection)
    return {"message": "글이 성공적으로 작성되었습니다."}

# 게시물 상세 조회
@app.get("/post/{post_id}")
def get_post_detail(post_id: int):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="연결 실패")
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT p.post_id, p.title, p.content, p.photo_url, p.created_at, u.name as user_name, u.email
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            WHERE p.post_id = %s
            """,
            (post_id,)
        )
        post = cursor.fetchone()
        if not post:
            close_connection(connection)
            raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
    except Exception as e:
        print("Post detail error:", e)
        close_connection(connection)
        raise HTTPException(status_code=500, detail="게시물 조회 실패")
    close_connection(connection)
    return post

# 게시물 목록 조회 (최신순)
@app.get("/posts")
def get_posts():
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="연결 실패")
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT p.post_id, p.title, LEFT(p.content, 60) as summary, p.photo_url, p.created_at, u.name as user_name
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            ORDER BY p.created_at DESC
            """
        )
        posts = cursor.fetchall()
    except Exception as e:
        print("Posts list error:", e)
        close_connection(connection)
        raise HTTPException(status_code=500, detail="게시물 목록 조회 실패")
    close_connection(connection)
    return posts

### 검색
@app.get("/search/parts")
def search_parts(query: str = Query(..., description="검색어")):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="연결 실패")
    cursor = connection.cursor(dictionary=True)
    try:
        sql = (
            "SELECT product_id as id, part_type as type, model_name as name, manufacturer, price, launch_price "
            "FROM parts "
            "WHERE LOWER(model_name) LIKE %s OR LOWER(part_type) LIKE %s"
        )
        like_query = f"%{query.lower()}%"
        cursor.execute(sql, (like_query, like_query))
        results = cursor.fetchall()
    except Exception as e:
        print("Parts search error:", e)
        close_connection(connection)
        raise HTTPException(status_code=500, detail="검색 실패")
    close_connection(connection)
    return results

### 위시리스트
class AddWishlistRequest(BaseModel):
    email: str
    product_id: int

@app.post("/wishlist/add", status_code=status.HTTP_201_CREATED)
def add_to_wishlist(data: AddWishlistRequest):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="연결 실패")
    user = fetch_data_with_condition(connection, "users", "email", data.email)
    if not user:
        close_connection(connection)
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    cursor = connection.cursor()
    try:
        # 중복 체크
        cursor.execute("SELECT * FROM wishlist WHERE user_id=%s AND product_id=%s", (user["user_id"], data.product_id))
        if cursor.fetchone():
            close_connection(connection)
            raise HTTPException(status_code=400, detail="이미 위시리스트에 추가된 부품입니다.")
        cursor.execute(
            "INSERT INTO wishlist (user_id, product_id, added_at) VALUES (%s, %s, NOW())",
            (user["user_id"], data.product_id)
        )
        connection.commit()
    except Exception as e:
        print("Wishlist add error:", e)
        close_connection(connection)
        raise HTTPException(status_code=500, detail="위시리스트 추가 실패")
    close_connection(connection)
    return {"message": "위시리스트에 추가되었습니다."}

@app.get("/wishlist/{email}")
def get_wishlist(email: str):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="연결 실패")
    user = fetch_data_with_condition(connection, "users", "email", email)
    if not user:
        close_connection(connection)
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT w.wishlist_id, p.product_id, p.part_type, p.model_name, p.manufacturer, p.price, w.added_at
            FROM wishlist w
            JOIN parts p ON w.product_id = p.product_id
            WHERE w.user_id = %s
            ORDER BY w.added_at DESC
            """,
            (user["user_id"],)
        )
        items = cursor.fetchall()
    except Exception as e:
        print("Wishlist fetch error:", e)
        close_connection(connection)
        raise HTTPException(status_code=500, detail="위시리스트 조회 실패")
    close_connection(connection)
    return items
