from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
import uuid
from jwt import ExpiredSignatureError, InvalidTokenError
from passlib.context import CryptContext
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload, joinedload

from app.schemas.schema_app import TokenData, UserInDB
from app.models.User import User
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
            roles=[ role.name for role in user.roles ] if user.roles else [],
            scopes=[
               role.scopes for role in user.roles
            ]
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
            "scopes" : user.scopes,
            "exp": datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        }
        return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    def decode_access_token(self, token: str) -> Optional[TokenData]:
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            return TokenData(
                username=payload.get("sub"),
                user_id=payload.get("user_id"),
                roles=payload.get("roles"),
                scopes = payload.get("scopes")
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
            roles=[role.name for role in user.roles],
            scopes = [role.scopes for role in user.roles]
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

        return UserInDB(
            id=user.id,
            username=user.username,
            roles=[role.name for role in user.roles]
        )

    def create_refresh_token(self, user_id: str, expires_delta: timedelta = timedelta(days=7)) -> str:
        token_str = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + expires_delta
        refresh_id = str(uuid.uuid4())

        # Supprime tous les tokens non révoqués pour cet utilisateur
        self.session.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.revoked == False
        ).delete(synchronize_session=False)

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
        refresh_token = self.session.query(RefreshToken).filter(
            RefreshToken.token == token,
            RefreshToken.revoked == False,
            RefreshToken.expires_at > datetime.now(timezone.utc)
        ).first()
        return refresh_token is not None

    def revoke_refresh_token(self, token: str) -> None:
        refresh_token = self.session.query(RefreshToken).filter(RefreshToken.token == token).first()
        if refresh_token:
            refresh_token.revoked = True
            self.session.commit()
            
    def get_refresh_token(self, refresh_token : str):
        
        db_token = self.session.exec(
            select(RefreshToken).where(RefreshToken.token == refresh_token)
        ).one_or_none()
        
        return db_token

    def purge_expired_refresh_tokens(self, session):
        now = datetime.now()
        expired_tokens = self.session.query(RefreshToken).filter(
            RefreshToken.expires_at < now
        )
        count = expired_tokens.delete(synchronize_session=False)
        session.commit()
        print(f"Purged {count} expired refresh tokens.")