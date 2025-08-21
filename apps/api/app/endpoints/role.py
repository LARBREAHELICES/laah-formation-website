
# app/api/routes/role_router.py
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlmodel import Session

from app.database import get_db
from app.services.RoleService import RoleService
from app.schemas.schema_app import RoleRead

router = APIRouter(
    prefix="/api",
    tags=["roles"],
)

@router.get("/roles", response_model=List[RoleRead])
def all_roles(session: Session = Depends(get_db)):
    roles = RoleService(session).all()
    if not roles:
        return JSONResponse(status_code=404, content={"message": "No roles found"})
    return roles

@router.get("/role/{id}", response_model=RoleRead)
def get_role(id: str, session: Session = Depends(get_db)):
    role = RoleService(session).get(id)
    if not role:
        return JSONResponse(status_code=404, content={"message": "Role not found"})
    return role

@router.get("/user/{user_id}/roles", response_model=List[RoleRead])
def roles_by_user(user_id: str, session: Session = Depends(get_db)):
    roles = RoleService(session).all_by_user(user_id)
    if not roles:
        return JSONResponse(status_code=404, content={"message": "No roles found for this user"})
    return roles
