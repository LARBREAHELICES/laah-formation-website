# app/services/tag_service.py
from typing import List, Optional
from uuid import uuid4
from sqlmodel import Session, select
from app.models.Tag import Tag
from app.schemas.Tag import TagCreate, TagRead

class TagService:
    def __init__(self, session: Session):
        self.session = session

    def all(self) -> List[TagRead]:
        stmt = select(Tag)
        tags = self.session.exec(stmt).all()
        return [
            TagRead(
                id=t.id,
                name=t.name
            )
            for t in tags
        ]

    def get(self, tag_id: str) -> Optional[TagRead]:
        tag = self.session.get(Tag, tag_id)
        if not tag:
            return None
        return TagRead(
            id=tag.id,
            name=tag.name,
        )

    def all_by_formation(self, formation_id: str) -> List[TagRead]:
        stmt = select(Tag).where(Tag.formation_id == formation_id)
        tags = self.session.exec(stmt).all()
        return [
            TagRead(
                id=t.id,
                name=t.name,
            )
            for t in tags
        ]
