
# app/api/schemas/user_schema.py
from pydantic import BaseModel
from typing import Optional

class TagRead(BaseModel):
    id: str
    name: str

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    id: Optional[str] = None  # utile si on envoie déjà un ID

class TagUpdate(BaseModel):
    name: Optional[str] = None