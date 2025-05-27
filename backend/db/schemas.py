from pydantic import BaseModel
from typing import Optional, Literal
from decimal import Decimal
from datetime import datetime

class Part(BaseModel):
    product_id: Optional[int]
    part_type: Literal['cpu', 'mainboard', 'ram', 'ssd', 'vga']
    manufacturer: str
    model_name: str
    price: Decimal
    launch_price: Optional[Decimal] = None

class CPU(BaseModel):
    product_id: Optional[int]
    model_name: str
    manufacturer: str
    core_count: Optional[int] = None
    thread_count: Optional[int] = None
    base_clock: Optional[Decimal] = None
    bost_clock: Optional[Decimal] = None
    tdp: Optional[int] = None
    integrated_graphics: Optional[str] = None
    process_size: Optional[str] = None
    socket_type: Optional[str] = None

class Mainboard(BaseModel):
    product_id: Optional[int]
    model_name: Optional[str] = None
    manufacturer: Optional[str] = None
    chipset: Optional[str] = None
    cpu_socket: Optional[str] = None
    memory_type: Optional[str] = None
    mosfet: Optional[str] = None
    color: Optional[str] = None

class RAM(BaseModel):
    product_id: Optional[int]
    model_name: str
    manufacturer: str
    clock: Optional[int] = None
    memory_type: Optional[str] = None
    memory_size: Optional[int] = None
    color: Optional[str] = None

class SSD(BaseModel):
    product_id: Optional[int]
    model_name: Optional[str] = None
    manufacturer: Optional[str] = None
    capacity: Optional[str] = None
    sequential_read: Optional[int] = None
    sequential_write: Optional[int] = None

class VGA(BaseModel):
    product_id: Optional[int]
    model_name: Optional[str] = None
    manufacturer: Optional[str] = None
    memory_size: Optional[int] = None
    memory_type: Optional[str] = None
    base_clock_speed: Optional[int] = None
    boost_clock_speed: Optional[int] = None
    cuda_cores: Optional[int] = None
    tdp: Optional[int] = None
    color: Optional[str] = None

class PriceHistory(BaseModel):
    history_id: Optional[int]
    product_id: int
    price: Decimal
    recorded_at: Optional[datetime] = None
    launch_price: Optional[Decimal] = None

class User(BaseModel):
    user_id: Optional[int]
    email: str
    password: str
    name: str
    created_at: Optional[datetime] = None

class Post(BaseModel):
    post_id: Optional[int]
    user_id: int
    title: str
    content: Optional[str] = None
    photo_url: Optional[str] = None
    created_at: Optional[datetime] = None

class WishlistItem(BaseModel):
    wishlist_id: Optional[int]
    user_id: int
    product_id: int
    added_at: Optional[datetime] = None

class Estimate(BaseModel):
    estimate_id: Optional[int]
    user_id: int
    created_at: Optional[datetime] = None
    total_price: Decimal
    budget: Optional[Decimal] = None
    purpose: Optional[str] = None
    preferred_brand: Optional[str] = None

class EstimateItem(BaseModel):
    item_id: Optional[int]
    estimate_id: int
    product_id: int