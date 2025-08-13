from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from typing import  List
from app.database import get_db
from app.services.FormationService import FormationService
from app.schemas.schema_app import FormationRead, FormationCreate, FormationUpdate

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


# --- CREATE ---
@router.post("/formation", response_model=FormationRead, status_code=201)
def create(data: FormationCreate, session: Session = Depends(get_db)):
    formation = FormationService(session).create(data)
    
    return formation

# --- UPDATE ---
@router.put("/formation/{id}", response_model=FormationRead)
def update(id: str, data: FormationUpdate, session: Session = Depends(get_db)):
    formation = FormationService(session).update(id, data)
    if not formation:
        return JSONResponse(status_code=404, content={"message": "Formation not found"})
    return formation

# --- DELETE ---
@router.delete("/formation/{id}", status_code=204)
def delete(id: str, session: Session = Depends(get_db)):
    deleted = FormationService(session).delete(id)
    if not deleted:
        return JSONResponse(status_code=404, content={"message": "Formation not found"})
    return JSONResponse(status_code=204, content={"message": "Formation deleted"})