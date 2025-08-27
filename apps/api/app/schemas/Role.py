from pydantic import BaseModel

class RoleRead(BaseModel):
    id: str
    name: str