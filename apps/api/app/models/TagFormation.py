# app/models/link_user_invoice.py
from sqlmodel import SQLModel, Field

class TagFormation(SQLModel, table=True): # type: ignore[misc]
    __tablename__ = "tag_formation_link"
    
    tag_id: int = Field(foreign_key="user.id", primary_key=True)
    formation_id: int = Field(foreign_key="formation.id", primary_key=True)
