from sqlmodel import SQLModel, Field

class UserRole(SQLModel, table=True):  # type: ignore[misc]
    __tablename__ = "user_role_link"
    
    role_id: str = Field(foreign_key="role.id", primary_key=True)
    user_id: str = Field(foreign_key="user.id", primary_key=True)

