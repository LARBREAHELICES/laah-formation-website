from datetime import datetime, timedelta, timezone
from typing import Optional
import uuid

import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from passlib.context import CryptContext
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload

from app.schemas.Token import TokenData
from app.schemas.User import UserInDB
from app.models.User import User
from app.models.Role import Role
from app.models.RefreshToken import RefreshToken
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
    def authenticate_user(self, username: str, password: str) -> Optional[UserInDB]:
        statement = (
            select(User)
            .options(selectinload(User.roles))
            .where(User.username == username)
        )
        user = self.session.exec(statement).one_or_none()

        if not user or not self.verify_password(password, user.password):
            return None

        return UserInDB(
            id=user.id,
            username=user.username,
            roles=[role.name for role in user.roles],
            scopes=[role.scopes for role in user.roles],
        )

    # -------- JWT --------
    def create_access_token(
        self,
        user: UserInDB,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        to_encode = {
            "sub": user.username,
            "user_id": user.id,
            "roles": user.roles,
            "scopes": user.scopes,
            "exp": expire,
        }
        return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    def decode_access_token(self, token: str) -> Optional[TokenData]:
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            return TokenData(
                username=payload.get("sub"),
                user_id=payload.get("user_id"),
                roles=payload.get("roles"),
                scopes=payload.get("scopes"),
            )
        except (ExpiredSignatureError, InvalidTokenError):
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
            roles=[role.name for role in user.roles],
            scopes=[role.scopes for role in user.roles],
        )

    def get_user_by_id(self, id: str) -> Optional[UserInDB]:
        statement = (
            select(User)
            .options(selectinload(User.roles))
            .where(User.id == id)
        )
        user = self.session.exec(statement).one_or_none()
        if not user:
            return None
        
        scopes = [
            scope.strip()
            for role in user.roles
            for scope in (role.scopes or "").split(",")  # split string en liste
            if scope.strip()
        ]

        return UserInDB(
            id=user.id,
            username=user.username,
            roles=[role.name for role in user.roles],
            scopes=scopes,
        )

    # -------- Refresh tokens --------
    def create_refresh_token(self, user_id: str, expires_delta: timedelta = timedelta(days=7)) -> str:
        token_str = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + expires_delta
        refresh_id = str(uuid.uuid4())

        # Supprime tous les tokens non révoqués pour cet utilisateur
        self.session.exec(
            select(RefreshToken)
            .where(RefreshToken.user_id == user_id, RefreshToken.revoked == False)
        )
        
        statement = select(RefreshToken).where(
            RefreshToken.user_id == user_id,
            RefreshToken.revoked == False
        )
        existing_tokens = self.session.exec(statement).all()
        for token in existing_tokens:
            self.session.delete(token)
        self.session.commit()
        
        # Crée un nouveau token
        refresh_token = RefreshToken(
            id=refresh_id,
            user_id=user_id,
            token=token_str,
            expires_at=expires_at,
            revoked=False,
        )
        self.session.add(refresh_token)
        self.session.commit()
        return token_str

    def validate_refresh_token(self, token: str) -> bool:
        statement = (
            select(RefreshToken)
            .where(
                RefreshToken.token == token,
                RefreshToken.revoked == False,
                RefreshToken.expires_at > datetime.now(timezone.utc),
            )
        )
        refresh_token = self.session.exec(statement).one_or_none()
        return refresh_token is not None

    def revoke_refresh_token(self, token: str) -> None:
        statement = select(RefreshToken).where(RefreshToken.token == token)
        refresh_token = self.session.exec(statement).one_or_none()
        if refresh_token:
            refresh_token.revoked = True
            self.session.add(refresh_token)
            self.session.commit()

    def get_refresh_token(self, refresh_token: str) -> Optional[RefreshToken]:
        statement = select(RefreshToken).where(RefreshToken.token == refresh_token)
        return self.session.exec(statement).one_or_none()

    def purge_expired_refresh_tokens(self) -> None:
        now = datetime.now(timezone.utc)
        
        statement = select(RefreshToken).where(RefreshToken.expires_at < now)
        expired_tokens = self.session.exec(statement).all()
        
        count = expired_tokens.delete(synchronize_session=False)
        
        self.session.commit()
        
        print(f"Purged {count} expired refresh tokens.")
