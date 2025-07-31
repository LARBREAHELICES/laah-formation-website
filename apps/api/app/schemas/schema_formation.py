# app/api/schemas/user_schema.py
from pydantic import BaseModel
from datetime import datetime

from typing import List, Optional

from app.models.Tag import Tag
from app.models.User import User

class FormationRead(BaseModel):
    title: str
    description : str 
    tags: List[Tag] = []
   