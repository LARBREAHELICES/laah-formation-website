
from typing import List, Optional
from uuid import uuid4
from sqlmodel import Session, select
from app.models.Role import Role
from app.schemas.schema_app import  RoleRead
from app.models.UserRole import UserRole

class RoleService:
    def __init__(self, session: Session):
        self.session = session

    def all(self) -> List[RoleRead]:
        stmt = select(Role)
        roles = self.session.exec(stmt).all()
        return [
            RoleRead(
                id=r.id,
                name=r.name
            )
            for r in roles
        ]

    def get(self, role_id: str) -> Optional[RoleRead]:
        role = self.session.get(Role, role_id)
        if not role:
            return None
        return RoleRead(
            id=role.id,
            name=role.name,
        )

    def all_by_user(self, user_id: str) -> List[RoleRead]:
        stmt = (
            select(Role)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(UserRole.user_id == user_id)
        )
        roles = self.session.exec(stmt).all()
        return [RoleRead(id=r.id, name=r.name) for r in roles]