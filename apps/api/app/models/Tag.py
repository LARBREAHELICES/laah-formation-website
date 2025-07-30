from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class Tag:
    id: str | None = Field(default=None, primary_key=True)
    name : str