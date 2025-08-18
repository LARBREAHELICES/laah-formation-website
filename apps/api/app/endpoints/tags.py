# app/api/routes/tag_router.py
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlmodel import Session

from app.database import get_db
from app.services.TagService import TagService
from app.schemas.schema_app import TagRead

router = APIRouter(
    prefix="/api",
    tags=["tags"],
)

@router.get("/tags", response_model=List[TagRead])
def all_tags(session: Session = Depends(get_db)):
    tags = TagService(session).all()
    if not tags:
        return JSONResponse(status_code=404, content={"message": "No tags found"})
    return tags

@router.get("/tag/{id}", response_model=TagRead)
def get_tag(id: str, session: Session = Depends(get_db)):
    tag = TagService(session).get(id)
    if not tag:
        return JSONResponse(status_code=404, content={"message": "Tag not found"})
    return tag

@router.get("/formation/{formation_id}/tags", response_model=List[TagRead])
def tags_by_formation(formation_id: str, session: Session = Depends(get_db)):
    tags = TagService(session).all_by_formation(formation_id)
    if not tags:
        return JSONResponse(status_code=404, content={"message": "No tags found for this formation"})
    return tags
