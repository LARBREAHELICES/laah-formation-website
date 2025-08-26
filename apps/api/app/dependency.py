from fastapi import Depends, HTTPException, status, Cookie
from typing import Optional

from app.services.AuthService import AuthService
from app.database import get_db
from app.schemas.User import UserInDB
from datetime import datetime
from fastapi.security import SecurityScopes
from app.models.User import User

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
            roles=[role for role in user.roles ] if user.roles else [],
            scopes = [ scope for scope in user.scopes ] if user.scopes else [] # TODO recupérer les roles.scopes à voir si on change le modèle 
        )


async def get_current_active_user(
    current_user: UserInDB = Depends(get_current_user),
):
    if getattr(current_user, "disabled", False):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_refresh_token_from_cookie(
    refresh_token: Optional[str] = Cookie(None),
    auth_service: AuthService = Depends(get_auth_service),
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token cookie found")

    db_token = auth_service.get_refresh_token(refresh_token=refresh_token)

    if not db_token or db_token.revoked or db_token.expires_at < datetime.now():
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    return db_token

def check_scopes(
    security_scopes: SecurityScopes,
    current_user: User = Depends(get_current_active_user)
):
    """
    Vérifie que l'utilisateur a au moins un des scopes requis.
    Règle spéciale : admin a toujours tous les droits.
    """
    # Si l'utilisateur est admin, il a tous les droits
    
    
    if  "admin" in current_user.roles:
        return current_user
    
    user_scopes = set(current_user.roles[0].scopes.split())  # Ex: "formation:create formation:update"
    required_scopes = set(security_scopes.scopes)

    # Vérification stricte : tous les scopes requis doivent être présents
    if not required_scopes.issubset(user_scopes):
        raise HTTPException(
            status_code=403,
            detail=f"Not enough permissions. Required: {', '.join(required_scopes)}"
        )

    return current_user