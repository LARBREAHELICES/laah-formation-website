# app/services/UserService.py
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from app.models.User import User
from app.models.Role import Role  
from app.schemas.User import UserRead, UserCreate, UserUpdate
from app.schemas.Role import RoleRead  


class UserService:
    def __init__(self, session: Session):
        self.session = session

    def create(self, user_data: UserCreate) -> UserRead:
        # Créer l'utilisateur avec les données du schéma
        user = User(
            id=str(uuid.uuid4()),
            username=user_data.username,
            email=user_data.email,
            fullname=user_data.fullname,
            password=user_data.password,  # À hasher en production
            status=user_data.status,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
            # Ajouter les rôles
        if user_data.roles:
            role_ids = [r.id for r in user_data.roles]
            roles = self.session.query(Role).filter(Role.id.in_(role_ids)).all()
            user.roles = roles

        if user_data.formations:
            formation_ids = [f.id for f in user_data.formations]
            formations = self.session.query(Formation).filter(Formation.id.in_(formation_ids)).all()
            user.formations = formations
        
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        
        return self._convert_to_user_read(user)

    def update(self, user_id: str, user_data: UserUpdate) -> Optional[UserRead]:
        user = self.session.get(User, user_id)
        if not user:
            return None
            
        # Mettre à jour les champs
        if user_data.fullname is not None:
            user.fullname = user_data.fullname
        if user_data.email is not None:
            user.email = user_data.email
        if user_data.username is not None:
            user.username = user_data.username
        if user_data.password is not None:
            user.password = user_data.password
        if user_data.status is not None:
            user.status = user_data.status
            
                # Mettre à jour les rôles
        if user_data.roles is not None:
            role_ids = [r.id for r in user_data.roles]
            roles = self.session.query(Role).filter(Role.id.in_(role_ids)).all()
            user.roles = roles

        if user_data.formations is not None:
            formation_ids = [f.id for f in user_data.formations]
            formations = self.session.query(Formation).filter(Formation.id.in_(formation_ids)).all()
            user.formations = formations
                    
        user.updated_at = datetime.utcnow()
        self.session.commit()
        self.session.refresh(user)
        
        return self._convert_to_user_read(user)

    def get(self, user_id: str) -> Optional[UserRead]:
        user = self.session.get(User, user_id)
        if not user:
            return None
        return self._convert_to_user_read(user)

    def all(self) -> List[UserRead]:
        users = self.session.query(User).all()
        return [self._convert_to_user_read(user) for user in users]

    def delete(self, user_id: str) -> bool:
        user = self.session.get(User, user_id)
        if not user:
            return False
        self.session.delete(user)
        self.session.commit()
        return True

    def _convert_to_user_read(self, user: User) -> UserRead:
        return UserRead(
            id=user.id,
            username= user.username,
            fullname=user.fullname,
            email=user.email,
            status=user.status,
            roles=[RoleRead(id=r.id, name=r.name) for r in user.roles],
        )