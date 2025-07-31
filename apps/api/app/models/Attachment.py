from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class Attachment(SQLModel, table=True): # type: ignore[misc] :

    id: str  = Field(default=None, primary_key=True)
    formation_id: str = Field(foreign_key="formation.id")

    label: str                 # ex. "Référentiel RNCP", "Rapport Qualiopi 2023"
    file_url: str
    file_type: str = Field(default="application/pdf")

    formation: Optional["Formation"] = Relationship(back_populates="attachments")