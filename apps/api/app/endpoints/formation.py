<<<<<<< HEAD
from fastapi import APIRouter, Depends, Request
=======
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
>>>>>>> 01e7d4089682a32ed15219ef6048fee3fa02d7a4


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
    
    formations = FormationService(session).all()
    
    if not formations:
        return JSONResponse(status_code=404, content={"message": "No formations found"})
    
    return formations

@router.get("/formation/{id}", response_model=FormationRead)
def get(
    id: str,
    session: Session = Depends(get_db)):
    
    formation = FormationService(session).get(id)
    
    if not formation:
        return JSONResponse(status_code=404, content={"message": "No formation found"})
    
    return formation