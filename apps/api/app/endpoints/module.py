# app/api/routes/module_router.py
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlmodel import Session

from app.database import get_db
from app.services.ModuleService import ModuleService
from app.schemas.Module import ModuleRead

router = APIRouter(
    prefix="/api",
    tags=["modules"],
)

@router.get("/modules", response_model=List[ModuleRead])
def all_modules(session: Session = Depends(get_db)):
    modules = ModuleService(session).all()
    if not modules:
        return JSONResponse(status_code=404, content={"message": "No modules found"})
    return modules

@router.get("/module/{id}", response_model=ModuleRead)
def get_module(id: str, session: Session = Depends(get_db)):
    module = ModuleService(session).get(id)
    if not module:
        return JSONResponse(status_code=404, content={"message": "Module not found"})
    return module

@router.get("/formation/{formation_id}/modules", response_model=List[ModuleRead])
def modules_by_formation(formation_id: str, session: Session = Depends(get_db)):
    modules = ModuleService(session).all_by_formation(formation_id)
    if not modules:
        return JSONResponse(status_code=404, content={"message": "No modules found for this formation"})
    return modules