
# app/api/schemas/user_schema.py
from pydantic import BaseModel
from typing import List, Optional
from app.schemas.Role import RoleRead
from app.schemas.Formation import FormationReadShort

class UserRead(BaseModel):
    id: str
    fullname: str
    status : Optional[str] = None
    email: Optional[str] = None
    roles: Optional [List[RoleRead]] = []
    formations: Optional [List[FormationReadShort]] = []

class UserInDB(BaseModel):
    id : str
    username: str
    roles : List[str] | None = None
    scopes : List[str] | None = None
    
class UserRequest(BaseModel):
    username: str
    password: str
    
class UserCreate(BaseModel):
    fullname: str
    email: str
    username: str
    password: str
    status: str
    roles: Optional [List[RoleRead]] = []
    formations: Optional [List[FormationReadShort]] = []
    

class UserUpdate(BaseModel):
    fullname: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    status: Optional[str] = None
    roles: Optional [List[RoleRead]] = []
    formations: Optional [List[FormationReadShort]] = []