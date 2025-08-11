from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated

from app.schemas.schema_app import TokenData
from app.models.User import User
from app.services.AuthService import AuthService
from app.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_auth_service(session=Depends(get_db)) -> AuthService:
    return AuthService(session=session)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    auth_service: AuthService = Depends(get_auth_service)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_data = auth_service.decode_access_token(token)
    if not token_data or not token_data.username:
        raise credentials_exception

    user = auth_service.get_user(username=token_data.username)
    if user is None:
        raise credentials_exception

    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if getattr(current_user, "disabled", False):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
