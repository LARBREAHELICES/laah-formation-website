
# app/api/schemas/user_schema.py
from pydantic import BaseModel
from decimal import Decimal
from typing import List, Optional
from datetime import date
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
    access_token: str | None = None
    role : List[str] | None = None
    