from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from app.models.Message import Message 

class User(SQLModel, table=True):  # type: ignore[misc]
    id: str | None = Field(default=None, primary_key=True)
    email: str
    fullname: str
    status : str
    created_at: datetime
    updated_at: datetime

    messages: List["Message"] = Relationship(back_populates="user")
    