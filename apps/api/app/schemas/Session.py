
# app/api/schemas/user_schema.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class SessionRead(BaseModel):
    id: Optional[str] = None
    start_date: datetime
    end_date: datetime
    location: str
    max_seats: int
    price: Decimal
