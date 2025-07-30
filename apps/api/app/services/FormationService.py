# app/services/formation_service.py
from typing import List, Optional
from sqlmodel import Session, select

from app.schemas.schema_formation import FormationRead
from app.models.Formation import Formation

class FormationService:
    
    def __init__(self, session: Session):
        self.session = session

    def all(self) -> List[FormationRead]:
        formations = self.session.exec(select(Formation)).all()
        
        return [
            FormationRead(
                title = formation.title,
                description = formation.description
            ) for formation in formations
        ]
