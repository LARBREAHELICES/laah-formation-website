from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from app.models.Tag import Tag
from app.models.TagFormation import TagFormation
from app.models.Attachment import Attachment
from app.models.Module import Module
from app.models.Session import Session
from app.models.UserFormation import UserFormation

class Formation(SQLModel, table=True):  # type: ignore[misc] :
    id: str | None = Field(default=None, primary_key=True)
     # --- Descriptif général ----------------------------------------------
    title: str
    slug: str = Field(unique=True, index=True)           # pour l’URL SEO
    description: str
    objectives: str                                      # C2 – objectifs pédagogiques
    prerequisites: str                                   # C1 – public / prérequis
    duration_hours: int                                  # C4 – durée réelle
    pedagogy_methods: str                                # C3 – modalités pédagogiques
    evaluation_methods: str                              # C7 – évaluation & certification
   # --- Statut Qualiopi ---------------------------------------------------
    qualiopi_certificate_number: str
    qualiopi_certificate_date: datetime
    prefecture_registration_number: str                  # enregistrement préfectoral
    qualiopi_scope: str = Field(
        default="actions de formation"
    )  # texte exact du certificat
    
    # --- Financier & administratif ----------------------------------------
    status: str = Field(default="draft")                 # draft / published / archived
    order_number: str | None = None                      # numéro de convention / BC
    order_date: datetime | None = None
    total_amount: Optional[float] | None = Field(default=None, decimal_places=2)

    classroom_student_counts: int = Field(default=0, ge=0)
    rate: Optional[str] = None
    
    tags: List["Tag"] = Relationship(
        back_populates="formations",
        link_model=TagFormation,# Assuming UserPlanningLink is defined elsewhere
    )
    
    sessions: List[Session] = Relationship(back_populates="formation")
    modules: List[Module] = Relationship(back_populates="formation")
    users: List["User"] = Relationship(
        back_populates="formations",
        link_model=UserFormation 
        )
    attachments: List[Attachment] = Relationship(back_populates="formation")
    
    # --- Audit ------------------------------------------------------------
    created_at: datetime = Field(default_factory=datetime.now())
    updated_at: datetime = Field(default_factory=datetime.now())