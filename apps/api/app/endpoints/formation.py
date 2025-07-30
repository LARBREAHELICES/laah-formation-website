from fastapi import APIRouter, Depends, Request
from dependency_injector.wiring import inject, Provide

from typing import  List
from app.schemas.schema_formation import FormationRead
from app.database import get_db
from app.services.FormationService import FormationService

from sqlmodel import Session

router = APIRouter(
    prefix="/api",
    tags=["formation"],
)

@router.get("/formations", response_model=List[FormationRead])
def list_plannings(session: Session = Depends(get_db)):
    
    return FormationService(session).all()