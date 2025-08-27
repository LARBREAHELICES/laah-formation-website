
# app/api/schemas/user_schema.py
from pydantic import BaseModel
from typing import  Optional

class AttachmentRead(BaseModel):
    id: Optional[str] = None
    label: Optional[str] = None
    file_url: str
    file_type: Optional[str] = None
