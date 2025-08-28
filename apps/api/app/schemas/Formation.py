
# app/api/schemas/user_schema.py
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from datetime import datetime, date
from app.schemas.Tag import TagRead
from app.schemas.Session import SessionRead
from app.schemas.Module import ModuleRead
from app.schemas.User import UserRead
from app.schemas.Attachment import AttachmentRead

# Schéma principal
class FormationRead(BaseModel):
    id: Optional[str] = None
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
    
    
class FormationUpdate(FormationRead):
    pass
    
class FormationCreate(FormationRead):
    pass

class FormationShortRead(BaseModel):
    id: Optional[str] = None
    title: str