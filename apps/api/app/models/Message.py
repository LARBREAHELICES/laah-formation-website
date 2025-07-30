
from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class Message(SQLModel, table=True):  # type: ignore[misc] 
    id: str | None = Field(default=None, primary_key=True)
    user_id: str | None = Field(default=None, foreign_key="user.id")
    subject: str
    content: str
    created_at: datetime
    updated_at: datetime
    
    user: Optional["User"] = Relationship(back_populates="messages")
    