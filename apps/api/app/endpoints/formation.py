from fastapi import APIRouter, Depends, Request
from dependency_injector.wiring import inject, Provide

from typing import  List
from app.database import get_db
from app.services.FormationService import FormationService
from app.schemas.schema_app import FormationRead

from sqlmodel import Session

router = APIRouter(
    prefix="/api",
    tags=["formation"],
)

@router.get("/formations", response_model=List[FormationRead])
def all(session: Session = Depends(get_db)):
    
    return FormationService(session).all()

@router.get("/formation/{id}", response_model=FormationRead)
def get(
    id: str,
    session: Session = Depends(get_db)):
    
    return FormationService(session).get(id)