# app/services/formation_service.py
from typing import List, Optional
from sqlmodel import Session, select

from sqlalchemy.orm import selectinload

from app.schemas.schema_formation import FormationRead
from app.models.Formation import Formation
from app.models.Tag import Tag

class FormationService:
    
    def __init__(self, session: Session):
        self.session = session

    def all(self) -> List[FormationRead]:
        
        stmt = (
            select(Formation)
            .options(
                selectinload(Formation.tags),   # via TagFormation
            )
        )
        formations = self.session.exec(select(Formation)).all()
        
        return [
            FormationRead(
                title = formation.title,
                description = formation.description,
                tags=[Tag(id=t.id, name=t.name) for t in formation.tags],
            ) for formation in formations
        ]
