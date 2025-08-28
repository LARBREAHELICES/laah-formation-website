from typing import Optional
from pydantic import BaseModel

class FormationShortRead(BaseModel):
    id: Optional[str] = None
    title: str