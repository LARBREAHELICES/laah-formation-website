
# app/api/schemas/user_schema.py
from pydantic import BaseModel
from typing import  Optional

class ModuleRead(BaseModel):
    id: str
    title: Optional[str] = None
    duration_hours: Optional[int] = None
    description: Optional[str] = None
    order_index: Optional[int] = None

class ModuleBase(BaseModel):
    title: str
    duration_hours: int
    description: str
    order_index: Optional[int] = 0

class ModuleCreate(ModuleBase):
    id: Optional[str] = None  # utile si tu veux forcer un ID

class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    duration_hours: Optional[int] = None
    description: Optional[str] = None
    order_index: Optional[int] = None