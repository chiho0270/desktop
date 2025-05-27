from pydantic import BaseModel, Field

class CPU(BaseModel):
    CPU_ID: int
    model_name: str
    manufacturer: str
    core_count: int
    thread_count: int
    base_clock: int
    bost_clock: int
    tdp: int
    integrated_graphics: str
    process_size: str
    model_config = {"from_attributes": True}

class MAINBOARD(BaseModel):
    MB_ID: int
    model_name: str
    manufacturer: str
    chipset: str
    cpu_socket: str
    memory_type: str
    mosfet: str
    color: str
    model_config = {"from_attributes": True}

class RAM(BaseModel):
    RAM_ID: int
    model_name: str
    manufacturer: str
    clock: int
    memory_type: str
    memory_size: int
    color: str
    model_config = {"from_attributes": True}

class SSD(BaseModel):
    SSD_ID: int
    model_name: str
    manufacturer: str
    capacity: str
    squential_read: int
    squential_write: int
    model_config = {"from_attributes": True}

class VGA(BaseModel):
    VGA_ID: int
    model_name: str
    manufacturer: str
    memory_size: int
    memory_type: str
    base_clock_speed: int
    boost_clock_speed: int
    cuda_cores: int
    tdp: int
    color: str
    model_config = {"from_attributes": True}

class PRICE(BaseModel):
    PRODUCT_ID: int
    price: int
    model_config = {"from_attributes": True}

class USER(BaseModel):
    __tablename__ = "user"
    USER_ID: int
    username: str
    password: str
    email: str
    phone_number: str
    model_config = {"from_attributes": True}
