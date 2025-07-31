from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from app.models.TagFormation import TagFormation

class Tag(SQLModel, table=True):  # type: ignore[misc] :
    id: str | None = Field(default=None, primary_key=True)
    name : str
    
    formations: List["Formation"] = Relationship(
        back_populates="tags",
        link_model=TagFormation,# Assuming UserPlanningLink is defined elsewhere
    )