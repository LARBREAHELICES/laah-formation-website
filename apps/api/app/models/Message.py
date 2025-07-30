
from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

from app.models.User import User

class Message:
    id: str | None = Field(default=None, primary_key=True)
    subject: str
    content: str
    created_at: datetime
    updated_at: datetime
    
    user: Optional["User"] = Relationship(back_populates="message")
    