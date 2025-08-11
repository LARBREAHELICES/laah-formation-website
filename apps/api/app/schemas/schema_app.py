
# app/api/schemas/user_schema.py
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

class TagRead(BaseModel):
    id: str
    name: str

class SessionRead(BaseModel):
    id: str
    start_date: datetime
    end_date: datetime
    location: str
    max_seats: int
    price: Decimal

class ModuleRead(BaseModel):
    id: str
    title: str
    duration_hours: int
    description: str
    order_index: int

class UserRead(BaseModel):
    fullname: str
    status : str
    

class AttachmentRead(BaseModel):
    id: str
    label: str
    file_url: str
    file_type: str = "application/pdf"

# Schéma principal
class FormationRead(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    objectives: str
    prerequisites: str
    duration_hours: int
    pedagogy_methods: str
    evaluation_methods: str

    # Qualiopi
    qualiopi_certificate_number: str
    qualiopi_certificate_date: datetime
    prefecture_registration_number: str
    qualiopi_scope: str

    # Administratif
    status: str
    order_number: Optional[str] = None
    order_date: Optional[datetime] = None
    total_amount: Optional[Decimal] = None
    classroom_student_counts: int
    rate: Optional[str] = None

    # Relations
    tags: List[TagRead] = []
    sessions: List[SessionRead] = []
    modules: List[ModuleRead] = []
    trainers: List[UserRead] = []
    attachments: List[AttachmentRead] = []

    # Audit
    created_at: datetime
    updated_at: datetime
    
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
    access_token: str | None = None
    role : List[str] | None = None
    
class UserInDB(BaseModel):
    id : str
    username: str
    roles : List[str] | None = None
    
class UserRequest(BaseModel):
    username: str
    password: str