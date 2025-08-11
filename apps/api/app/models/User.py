from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from app.models.Message import Message 
from app.models.UserFormation import UserFormation 
from app.models.Role import Role
from app.models.UserRole import UserRole

class User(SQLModel, table=True):  # type: ignore[misc]
    id: str | None = Field(default=None, primary_key=True)
    email: str
    username: str
    fullname: str
    password: Optional[str] = None
    status : str
    created_at: datetime
    updated_at: datetime
    
    roles: List["Role"] = Relationship(
        back_populates="users",
        link_model=UserRole
    )

    messages: List["Message"] = Relationship(back_populates="user")
    
    formations : List["Formation"] = Relationship(
        back_populates="users",
        link_model=UserFormation 
        
    )

