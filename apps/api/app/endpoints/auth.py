from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from fastapi.responses import JSONResponse

from app.models.User import User
from app.models.RefreshToken import RefreshToken
from app.schemas.User import UserInDB, UserRequest

from app.services.AuthService import AuthService
from app.dependency import get_auth_service, get_current_active_user, get_refresh_token_from_cookie
from app.Settings import settings

router = APIRouter(prefix="/api", tags=["auth"])

@router.post("/token")
async def login_for_access_token(
    form_data: UserRequest ,
    auth_service: AuthService = Depends(get_auth_service)
):
    # Authentification
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Génération du token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    refresh_token = auth_service.create_refresh_token(user.id)
    access_token = auth_service.create_access_token(
        user, expires_delta=access_token_expires
    )
    
    # Réponse JSON + Cookie HTTPOnly
    response = JSONResponse(content={
        "message": "Login successful",
        "username": user.username,
        "id": user.id,
        "roles": [role for role in user.roles ] if user.roles else [],
        "scopes": [scope for scope in user.scopes ] if user.scopes else [],
    })
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.env == "production",
        samesite="strict",
        max_age=settings.refresh_token_expire_days * 24 * 3600,
        path="/api",
    )
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.env == "production",  # HTTP en dev, HTTPS en prod
        samesite="strict",
        max_age=settings.access_token_expire_minutes * 60,
        path="/api",
    )
    
    
    return response

@router.get("/auth/me", response_model=UserInDB)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user

@router.get("/auth/me/items")
async def read_own_items(
    current_user: Annotated[UserInDB, Depends(get_current_active_user)],
):
    return [{
        "owner": current_user.username,
        "owner_id": current_user.id
    }]

@router.post("/auth/refresh-token")
def refresh_token(
    db_token: RefreshToken = Depends(get_refresh_token_from_cookie),
    auth_service: AuthService = Depends(get_auth_service),
):
    # Charger utilisateur lié
    user = auth_service.get_user_by_id(db_token.user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Créer nouveau access token
    access_token = auth_service.create_access_token(user)

    # Révoquer ancien refresh token et en créer un nouveau (optionnel mais recommandé)
    auth_service.revoke_refresh_token(db_token.token)
    new_refresh_token = auth_service.create_refresh_token(user.id)

    response = Response(content='{"access_token": "' + access_token + '"}', media_type="application/json")

    # Mettre à jour cookie refresh_token
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=settings.env == "production",
        samesite="strict",
        max_age=7 * 24 * 3600,
        path="/api"
    )

    return response

@router.post("/auth/logout")
def logout(
    db_token: RefreshToken = Depends(get_refresh_token_from_cookie),
    auth_service: AuthService = Depends(get_auth_service),
):
    if db_token:
        # Révoquer le refresh token en base
        db_token.revoked = True
        auth_service.revoke_refresh_token(db_token.token)

    response = Response(content='{"message":"Logged out"}', media_type="application/json")

    # Supprimer les cookies côté client en les vidant et en forçant une expiration immédiate
    response.delete_cookie("refresh_token", path="/api")
    response.delete_cookie("access_token", path="/api")

    return response