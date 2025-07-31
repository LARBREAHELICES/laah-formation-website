
from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from app.models.Formation import Formation

class Module(SQLModel, table=True):  # type: ignore[misc] 
    id: str | None = Field(default=None, primary_key=True)
    formation_id: str = Field(foreign_key="formation.id")

    title: str
    duration_hours: int
    description: str
    order_index: int = 0

    formation: Formation = Relationship(back_populates="modules")
    