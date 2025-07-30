# app/models/link_user_invoice.py
from sqlmodel import SQLModel, Field

class UserFormation(SQLModel, table=True): # type: ignore[misc]
    __tablename__ = "user_formation_link"
    
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    formation_id: int = Field(foreign_key="formation.id", primary_key=True)
