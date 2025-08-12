from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from passlib.context import CryptContext
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload, joinedload

from app.schemas.schema_app import TokenData, UserInDB
from app.models.User import User
from app.Settings import settings

class AuthService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    # -------- Mot de passe --------
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    # -------- Authentification --------
    def authenticate_user(self, username: str, password: str):
        user = (
            self.session.query(User)
            .options(selectinload(User.roles))
            .filter(User.username == username)
            .first()
        )

        if not user:
            return None

        if not self.verify_password(password, user.password):
            return None

        return UserInDB(
            id=user.id,
            username=user.username,
            roles=[role.name for role in user.roles] if user.roles else []
        )
    # -------- JWT --------
    def create_access_token(
        self,
        user: UserInDB,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        to_encode = {
            "sub": user.username,
            "user_id": user.id,
            "roles": user.roles,
            "exp": datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        }
        return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    def decode_access_token(self, token: str) -> Optional[TokenData]:
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            return TokenData(
                username=payload.get("sub"),
                user_id=payload.get("user_id"),
                roles=payload.get("roles")
            )
        except ExpiredSignatureError:
            return None
        except InvalidTokenError:
            return None

    # -------- Utilisateur --------
    def get_user(self, username: str) -> Optional[UserInDB]:
        statement = (
            select(User)
            .options(selectinload(User.roles))
            .where(User.username == username)
        )
        user = self.session.exec(statement).one_or_none()

        if not user:
            return None

        return UserInDB(
            id=user.id,
            username=user.username,
            roles=[role.name for role in user.roles]
        )
