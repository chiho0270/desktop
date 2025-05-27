import asyncio
from fastapi import FastAPI, HTTPException
from backend.db.connect import create_connection, close_connection
from backend.db.routers import fetch_all_data, fetch_data_with_condition
from backend.scheduler.danawaparser import DanawaParser

ALLOWED_TABLES = {
    "cpu": {"CPU_ID", "model_name"},
    "mainboard": {"MAINBOARD_ID", "model_name"},
    "ram": {"RAM_ID", "model_name"},
    "ssd": {"SSD_ID", "model_name"},
    "vga": {"VGA_ID", "model_name"},
    "price": {"PRODUCT_ID", "price"}
}

app = FastAPI()

async def run_parser_periodically():
    while True:
        print("Running DanawaParser...")
        connection = create_connection()
        if not connection:
            print("Database connection failed")
        else:
            parser = DanawaParser()
            for product in parser.productID:
                await parser.parse_product(product["url"], product["id"], connection)
            close_connection(connection)
            print("Parser run completed.")
        await asyncio.sleep(86400)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(run_parser_periodically())

@app.get("/parts/{category}", response_model=list)
def get_parts(category: str):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    parts = fetch_all_data(connection, category)
    close_connection(connection)
    return parts

@app.get("/part/{category}/{column}/{value}", response_model=dict)
def get_part(category: str, column: str, value: str):
    connection = create_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    if category not in ALLOWED_TABLES or column not in ALLOWED_TABLES[category]:
        close_connection(connection)
        raise HTTPException(status_code=400, detail="Invalid table or column")
    part = fetch_data_with_condition(connection, category, column, value)
    close_connection(connection)
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    return part
