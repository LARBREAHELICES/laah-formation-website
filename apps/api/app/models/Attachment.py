from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class Attachment(SQLModel, table=True): # type: ignore[misc] :

    id: str  = Field(default=None, primary_key=True)
    formation_id: str = Field(foreign_key="formation.id")

    file_url: str
    label: Optional[str] = None                 
    file_type: Optional[str] = None   # Github

    formation: Optional["Formation"] = Relationship(back_populates="attachments")