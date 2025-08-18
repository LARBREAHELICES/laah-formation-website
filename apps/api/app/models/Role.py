from sqlmodel import SQLModel, Field, Relationship

from typing import List

from app.models.UserRole import UserRole

class Role(SQLModel, table=True):  # type: ignore[misc]
    id: str | None = Field(default=None, primary_key=True)
    name: str
    scopes: str  # "items:read", "items:write", "admin"

    users: List["User"] = Relationship(
        back_populates="roles",
        link_model=UserRole
    )
