# app/api/schemas/user_schema.py
from pydantic import BaseModel
from datetime import datetime

from typing import List, Optional

class FormationRead(BaseModel):
    title: str
    description : str 
   