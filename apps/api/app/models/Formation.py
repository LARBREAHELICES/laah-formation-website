from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class Formation:
    id: str | None = Field(default=None, primary_key=True)
    title: str
    description : str 
    status: str
    order_number: str
    order_date: datetime
    total_amount: Optional[float] = None
    classroom_student_counts: int = 0
    rate: Optional[str] = None
    
    created_at: datetime
    updated_at: datetime