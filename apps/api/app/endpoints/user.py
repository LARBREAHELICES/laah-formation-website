# app/api/routes/tag_router.py
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlmodel import Session

from app.database import get_db
from app.services.UserService import UserService
from app.schemas.User import UserRead, UserCreate, UserUpdate

router = APIRouter(
    prefix="/api",
    tags=["user"],
)

@router.get("/users", response_model=List[UserRead])
def all_tags(session: Session = Depends(get_db)):
    users = UserService(session).all()
    if not users:
        return JSONResponse(status_code=404, content={"message": "No users found"})
    return users

@router.get("/user/{id}", response_model=UserRead)
def get_tag(id: str, session: Session = Depends(get_db)):
    user = UserService(session).get(id)
    if not user:
        return JSONResponse(status_code=404, content={"message": "user not found"})
    return user

@router.post("/user", response_model=UserRead)
def create_user(data: UserCreate, session: Session = Depends(get_db)):
    
    return UserService(session).create(data)

@router.put("/user/{id}", response_model=UserRead)
def update_user(id: str, data: UserUpdate, session: Session = Depends(get_db)):
    user = UserService(session).update(id, data)
    if not user:
        return JSONResponse(status_code=404, content={"message": "user not found"})
    return user

@router.delete("/user/{id}")
def delete_user(id: str, session: Session = Depends(get_db)):
    deleted = UserService(session).delete(id)
    if not deleted:
        return JSONResponse(status_code=404, content={"message": "user not found"})
    return {"message": "user deleted"}