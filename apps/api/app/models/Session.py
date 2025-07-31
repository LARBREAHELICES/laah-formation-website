from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class Session(SQLModel, table=True): # type: ignore[misc] :
    __tablename__ = "session"

    id: str | None = Field(default=None, primary_key=True)
    formation_id: str = Field(foreign_key="formation.id")

    start_date: datetime
    end_date: datetime
    location: str
    max_seats: int
    price: Optional[float] = Field(decimal_places=2)

    formation: Optional["Formation"]  = Relationship(back_populates="sessions")