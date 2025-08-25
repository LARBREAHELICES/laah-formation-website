
# app/api/schemas/user_schema.py
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from datetime import date, datetime


class TagRead(BaseModel):
    id: str
    name: str

class RoleRead(BaseModel):
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
    id: str
    fullname: str
    status : str
    email: str
    roles:List[RoleRead]=  []

    

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
    scopes : List[str] | None = None
    
class UserRequest(BaseModel):
    username: str
    password: str
    
class FormationUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    objectives: Optional[str] = None
    prerequisites: Optional[str] = None
    duration_hours: Optional[int] = None
    pedagogy_methods: Optional[str] = None
    evaluation_methods: Optional[str] = None
    qualiopi_certificate_number: Optional[str] = None
    qualiopi_certificate_date: Optional[date] = None
    prefecture_registration_number: Optional[str] = None
    qualiopi_scope: Optional[str] = None
    status: Optional[str] = None
    order_number: Optional[str] = None
    order_date: Optional[date] = None
    total_amount: Optional[Decimal] = None
    classroom_student_counts: Optional[int] = None
    rate: Optional[Decimal] = None
    tags: List[TagRead] = []
    sessions: List[SessionRead] = []
    modules: List[ModuleRead] = []
    trainers: List[UserRead] = []
    attachments: List[AttachmentRead] = []
    
class FormationCreate(FormationUpdate):
    title: str
    slug: str

class UserCreate(BaseModel):
    fullname: str
    email: str
    username: str
    password: str
    status: str
    

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    id: Optional[str] = None  # utile si on envoie déjà un ID

class TagUpdate(BaseModel):
    name: Optional[str] = None

class ModuleBase(BaseModel):
    title: str
    duration_hours: int
    description: str
    order_index: Optional[int] = 0

class ModuleCreate(ModuleBase):
    id: Optional[str] = None  # utile si tu veux forcer un ID

class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    duration_hours: Optional[int] = None
    description: Optional[str] = None
    order_index: Optional[int] = None


class UserUpdate(BaseModel):
    fullname: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    status: Optional[str] = None