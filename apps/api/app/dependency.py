from fastapi import Depends, HTTPException, status, Cookie
from typing import Optional

from app.schemas.schema_app import TokenData
from app.models.User import User
from app.services.AuthService import AuthService
from app.database import get_db
from app.schemas.schema_app import UserInDB

def get_auth_service(session=Depends(get_db)) -> AuthService:
    return AuthService(session=session)


async def get_token_from_cookie(
    access_token: Optional[str] = Cookie(None),
):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No access token cookie found",
        )
    return access_token


async def get_current_user(
    token: str = Depends(get_token_from_cookie),
    auth_service: AuthService = Depends(get_auth_service),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    token_data = auth_service.decode_access_token(token)
    if not token_data or not token_data.username:
        raise credentials_exception

    user = auth_service.get_user(username=token_data.username)
    if user is None:
        raise credentials_exception

    return UserInDB(
            id=user.id,
            username=user.username,
            roles=[role for role in user.roles ]
        )


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
):
    if getattr(current_user, "disabled", False):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
