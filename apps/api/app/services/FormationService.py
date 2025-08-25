# app/services/formation_service.py
from typing import List, Optional
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from decimal import Decimal
from datetime import date, datetime
from app.models.Attachment import Attachment
from app.models.Module import Module
from app.models.Tag import Tag
from app.models.Session import Session as SessionModel
from app.models.User import User
from app.services.SlugService import SlugService
import uuid

from app.schemas.schema_app import (
    FormationRead,
    TagRead,
    SessionRead,
    ModuleRead,
    UserRead,
    AttachmentRead,
    FormationCreate,
    FormationUpdate
)
from app.models.Formation import Formation

class FormationService:
    def __init__(self, session: Session):
        self.session = session

    def all(self) -> List[FormationRead]:
        stmt = (
            select(Formation)
            .options(
                selectinload(Formation.tags),
                selectinload(Formation.sessions),
                selectinload(Formation.modules),
                selectinload(Formation.users),
                selectinload(Formation.attachments),
            )
        )
        formations = self.session.exec(stmt).all()
        
        return [ self._to_read_model(formation)  for formation in formations ]

        
    def get(self, formation_id: str) -> Optional[FormationRead]:
        stmt = (
            select(Formation)
            .where(Formation.id == formation_id)
            .options(
                selectinload(Formation.tags),
                selectinload(Formation.sessions),
                selectinload(Formation.modules),
                selectinload(Formation.users),
                selectinload(Formation.attachments),
            )
        )
        formation = self.session.exec(stmt).first()
        if not formation:
            return None
        
        return  self._to_read_model(formation)



    def create(self, data: FormationCreate) -> Optional[FormationRead]:

        # 1. Créer la formation
        formation = Formation(
            id=str(uuid.uuid4()),
            title=data.title,
            slug=SlugService().slugify(data.slug if data.slug else data.title),
            description=data.description,
            objectives=data.objectives,
            prerequisites=data.prerequisites,
            duration_hours=data.duration_hours,
            pedagogy_methods=data.pedagogy_methods,
            evaluation_methods=data.evaluation_methods,
            qualiopi_certificate_number=data.qualiopi_certificate_number,
            qualiopi_certificate_date=data.qualiopi_certificate_date,
            prefecture_registration_number=data.prefecture_registration_number,
            qualiopi_scope=data.qualiopi_scope,
            status=data.status or "draft",
            order_number=data.order_number,
            order_date=data.order_date,
            total_amount=data.total_amount,
            classroom_student_counts=data.classroom_student_counts,
            rate=data.rate
        )
        self.session.add(formation)
        
        # 2. Associer les tags
        if data.tags:
            for tag_data in data.tags:
                tag = self.session.get(Tag, tag_data.id)
                if tag:
                    formation.tags.append(tag)

        # 3. Ajouter les sessions
        if data.sessions:
            for s in data.sessions:
                session_obj = SessionModel(
                    id=str(uuid.uuid4()),
                    formation_id=formation.id,
                    start_date=s.start_date,
                    end_date=s.end_date,
                    location=s.location,
                    max_seats=s.max_seats,
                    price=s.price
                )
                self.session.add(session_obj)

        # 4. Ajouter les modules
        if data.modules:
            for module in data.modules:
                module = self.session.get(Module, module.id)
                if module:
                    formation.tags.append(module)

        # 5. Associer les users
        if data.trainers:
            for u in data.trainers:
                user = self.session.get(User, u.id) # { id: str }
                if user:
                    formation.users.append(user)

        # 6. Ajouter les attachments
        if data.attachments:
            for attachment in data.attachments:
                attachment = Attachment(
                    id=str(uuid.uuid4()),
                    formation_id=formation.id,
                    label=attachment.label or "Github",
                    file_url=attachment.file_url
                )
                self.session.add(attachment)

        # 7. Commit transaction
        self.session.commit()
        self.session.refresh(formation)

        return self._to_read_model(formation)

    
    def delete(self, formation_id: str) -> bool:
        """
        Supprime une formation ainsi que ses dépendances (sessions, attachments),
        mais ne supprime pas les modules qui peuvent être partagés avec d'autres formations.
        """
        formation = self.session.get(Formation, formation_id)
        if not formation:
            return False

        # Supprimer les attachments liés uniquement à cette formation
        for attachment in formation.attachments:
            self.session.delete(attachment)
        
        # Détacher les modules (ne pas les supprimer)
        formation.modules.clear()  # supprime juste la relation dans la table d'association

        # Supprimer les sessions
        for session_obj in formation.sessions:
            self.session.delete(session_obj)

        # Détacher les tags et users
        formation.tags.clear()
        formation.users.clear()

        # Supprimer la formation
        self.session.delete(formation)
        self.session.commit()
        return True
    
    def update(self, formation_id: str, data: FormationUpdate) -> Optional[FormationRead]:
        formation = self.session.get(Formation, formation_id)
        if not formation:
            return None

        # --- Champs simples ---
        for field, value in data.dict(exclude_unset=True).items():
            if hasattr(formation, field) and field not in {"tags", "sessions", "modules", "trainers", "attachments"}:
                setattr(formation, field, value)

        # --- Tags ---
        if data.tags is not None:
            formation.tags.clear()
            for tag_data in data.tags:
                tag = self.session.get(Tag, tag_data.id)
                if not tag:
                    tag = Tag(id=tag_data.id or str(uuid.uuid4()), name=tag_data.name)
                    self.session.add(tag)
                formation.tags.append(tag)

        # --- Sessions ---
        if data.sessions is not None:
            # Supprimer les anciennes sessions
            for s in formation.sessions:
                self.session.delete(s)
            formation.sessions.clear()
            # Ajouter les nouvelles
            for s in data.sessions:
                session_obj = SessionModel(
                    id=str(uuid.uuid4()),
                    formation_id=formation.id,
                    start_date=s.start_date,
                    end_date=s.end_date,
                    location=s.location,
                    max_seats=s.max_seats,
                    price=s.price
                )
                self.session.add(session_obj)

        # --- Modules ---
        if data.modules is not None:
            formation.modules.clear()
            for m in data.modules:
                module_obj = Module(
                    id=m.id or str(uuid.uuid4()),
                    formation_id=formation.id,
                    title=m.title,
                    duration_hours=m.duration_hours,
                    description=m.description,
                    order_index=m.order_index or 0
                )
                self.session.add(module_obj)

        # --- Trainers / Users ---
        if data.trainers is not None:
            formation.users.clear()
            for u in data.trainers:
                user = self.session.get(User, u.id)
                if user:
                    formation.users.append(user)

        # --- Attachments ---
        if data.attachments is not None:
            for a in formation.attachments:
                self.session.delete(a)
            formation.attachments.clear()
            for a in data.attachments:
                attachment_obj = Attachment(
                    id=str(uuid.uuid4()),
                    formation_id=formation.id,
                    label=a.label,
                    file_url=a.file_url,
                    file_type=a.file_type or "application/pdf"
                )
                self.session.add(attachment_obj)

        self.session.commit()
        self.session.refresh(formation)
        
        return self._to_read_model(formation)
    
    
    # ---- PRIVATE MAPPER ----
    def _to_read_model(self, formation: Formation) -> FormationRead:
        
        return FormationRead(
            id=formation.id,
            title=formation.title,
            slug=formation.slug,
            description=formation.description,
            objectives=formation.objectives,
            prerequisites=formation.prerequisites,
            duration_hours=formation.duration_hours,
            pedagogy_methods=formation.pedagogy_methods,
            evaluation_methods=formation.evaluation_methods,
            qualiopi_certificate_number=formation.qualiopi_certificate_number,
            qualiopi_certificate_date=formation.qualiopi_certificate_date,
            prefecture_registration_number=formation.prefecture_registration_number,
            qualiopi_scope=formation.qualiopi_scope,
            status=formation.status,
            order_number=formation.order_number,
            order_date=formation.order_date,
            total_amount=formation.total_amount,
            classroom_student_counts=formation.classroom_student_counts,
            rate=formation.rate,
            tags=[TagRead(id=t.id, name=t.name) for t in formation.tags],
            sessions=[
                SessionRead(
                    id=s.id,
                    start_date=s.start_date,
                    end_date=s.end_date,
                    location=s.location,
                    max_seats=s.max_seats,
                    price=s.price,
                )
                for s in formation.sessions
            ],
            modules=[
                ModuleRead(
                    id=m.id,
                    title=m.title,
                    duration_hours=m.duration_hours,
                    description=m.description,
                    order_index=m.order_index,
                )
                for m in formation.modules
            ],
            trainers=[
                UserRead(
                    id = u.id,
                    fullname=u.fullname, status=u.status, email=u.email)
                for u in formation.users
            ],
            attachments=[
                AttachmentRead(
                    id=a.id,
                    label=a.label,
                    file_url=a.file_url,
                    file_type=a.file_type,
                )
                for a in formation.attachments
            ],
            created_at=formation.created_at,
            updated_at=formation.updated_at,
        )
        
        
"""
{
  "title": "Formation Go Avancé",
  "slug": "formation-go-avance",
  "description": "Formation complète sur Go avec approfondissement.",
  "objectives": "Maîtriser Go pour des projets avancés et la programmation concurrente.",
  "prerequisites": "Bases de Go ou expérience en programmation",
  "duration_hours": 35,
  "pedagogy_methods": "Cours, ateliers pratiques",
  "evaluation_methods": "QCM, projet final",
  "qualiopi_certificate_number": "Q54321",
  "qualiopi_certificate_date": "2025-02-20",
  "prefecture_registration_number": "P09876",
  "qualiopi_scope": "Développement logiciel",
  "status": "draft",
  "order_number": "CMD-2025-002",
  "order_date": "2025-08-13",
  "total_amount": 3800,
  "classroom_student_counts": 12,
  "rate": 100,
  "tags": [
   
    {
      "id": "b1bda123-a6c5-4a54-bf66-023cdd002890",
      "name": "Go"
    }
  ],
  "sessions": [
    {
      "id": "f6bfc001-a1c4-4dd9-9bfa-06d77ff05999",
      "start_date": "2025-09-15",
      "end_date": "2025-09-20",
      "location": "Lyon",
      "max_seats": 15,
      "price": 400
    }
  ],
  "modules": [
    {
      "id": "c0a8b501-5244-4ff7-9df4-9c85b5007788",
      "title": "Introduction au langage Go",
      "duration_hours": 7,
      "description": "Présentation de Go, installation, premiers programmes.",
      "order_index": 1
    },
    {
      "id": "c0a8b501-5244-4ff7-9df4-9c85b5008899",
      "title": "Structures de données et types",
      "duration_hours": 10,
      "description": "Tableaux, slices, maps et structs en Go.",
      "order_index": 2
    },
    {
      "id": "c0a8b501-5244-4ff7-9df4-9c85b5009900",
      "title": "Goroutines et Concurrency",
      "duration_hours": 10,
      "description": "Gestion des goroutines, channels et patterns concurrents.",
      "order_index": 3
    }
  ],
  "trainers": [
    {
      "id": "b8c06e9b-7497-48f4-b8ef-5f5a8dc14999",
      "fullname": "Alice Martin",
      "status": "active"
    }
  ],
  "attachments": [
    {
      "id": "a1f4d501-12b4-4ff9-9df4-4f95b5006677",
      "label": "Programme de formation",
      "file_url": "https://exemple.com/programme-go.pdf",
      "file_type": "application/pdf"
    }
  ]
}

"""