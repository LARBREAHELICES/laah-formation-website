from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class RegistrationRequest(SQLModel, table=True): # type: ignore[misc] :
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str
    motivation: str
    status: str = Field(default="pending")  # pending | email_verified | approved | rejected
    created_at: datetime = Field(default_factory=datetime.now())
    updated_at: Optional[datetime] = None
