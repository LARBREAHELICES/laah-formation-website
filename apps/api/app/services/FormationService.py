# app/services/formation_service.py
from typing import List, Optional
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from decimal import Decimal

from app.schemas.schema_app import (
    FormationRead,
    TagRead,
    SessionRead,
    ModuleRead,
    UserRead,
    AttachmentRead,
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

        return [
            FormationRead(
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
                trainers = [
                    UserRead(
                        fullname=u.fullname,
                        status = u.status
                    ) for u in formation.users
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
            for formation in formations
        ]
        
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
            tags=[{"id": t.id, "name": t.name} for t in formation.tags],
            sessions=[
                {
                    "id": s.id,
                    "start_date": s.start_date,
                    "end_date": s.end_date,
                    "location": s.location,
                    "max_seats": s.max_seats,
                    "price": s.price,
                }
                for s in formation.sessions
            ],
            modules=[
                {
                    "id": m.id,
                    "title": m.title,
                    "duration_hours": m.duration_hours,
                    "description": m.description,
                    "order_index": m.order_index,
                }
                for m in formation.modules
            ],
            trainers=[{"fullname": u.fullname, "status": u.status} for u in formation.users],
            attachments=[
                {
                    "id": a.id,
                    "label": a.label,
                    "file_url": a.file_url,
                    "file_type": a.file_type,
                }
                for a in formation.attachments
            ],
            created_at=formation.created_at,
            updated_at=formation.updated_at,
        )