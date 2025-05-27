from fastapi import FastAPI, HTTPException
from backend.db.connect import create_connection, close_connection
from backend.db.routers import fetch_all_data, fetch_data_with_condition

ALLOWED_TABLES = {
    "cpu": {"CPU_ID", "model_name"},
    "mainboard": {"MAINBOARD_ID", "model_name"},
    "ram": {"RAM_ID", "model_name"},
    "ssd": {"SSD_ID", "model_name"},
    "vga": {"VGA_ID", "model_name"}
}

app = FastAPI()

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