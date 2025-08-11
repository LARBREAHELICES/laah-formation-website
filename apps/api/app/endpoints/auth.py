from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from fastapi.responses import JSONResponse

from app.models.User import User
from app.schemas.schema_app import UserRequest
from app.services.AuthService import AuthService
from app.dependency import get_auth_service, get_current_active_user
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
    access_token = auth_service.create_access_token(
        user, expires_delta=access_token_expires
    )

    # Réponse JSON + Cookie HTTPOnly
    response = JSONResponse(content={
        "message": "Login successful",
        "username": user.username,
        "id": user.id,
        "roles": [role for role in user.roles ] if user.roles else []
    })
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.env == "production",  # HTTP en dev, HTTPS en prod
        samesite="strict",
        max_age=settings.access_token_expire_minutes * 60
    )
    return response


@router.get("/users/me", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@router.get("/users/me/items")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return [{
        "owner": current_user.username,
        "owner_id": current_user.id
    }]
