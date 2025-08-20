from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.User import User
from app.schemas.schema_app import UserRead

class UserService:
    def __init__(self, session: Session):
        self.session = session

    def create(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def get(self, user_id: str) -> Optional[UserRead]:
        user = self.session.get(User, user_id)
        
        return UserRead(
            id=user.id,
            fullname=user.fullname,
            email=user.email,
            status = user.status
        )

    def all(self) -> List[UserRead]:
        users = self.session.query(User).all()
        
        return [
            UserRead(
                id = user.id,
                fullname=user.fullname,
                email=user.email,
                status = user.status
            ) 
            for user in users 
        ]

    def update(self, user: User) -> UserRead:
        self.session.merge(user)
        self.session.commit()
        
        return UserRead(
            id = user.id,
            fullname=user.fullname,
            email=user.email,
            status = user.status
        )

    def delete(self, user_id: str) -> bool:
        """
        Supprime un utilisateur.
        """
        user = self.get(user_id)
        if not user:
            return False
        self.session.delete(user)
        self.session.commit()
        
        return True