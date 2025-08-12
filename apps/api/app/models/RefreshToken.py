from sqlmodel import SQLModel, Field
from datetime import datetime

class RefreshToken(SQLModel, table=True):  # type: ignore[misc] :
    id: str | None = Field(default=None, primary_key=True)
    user_id: str
    token: str  # le refresh token en string (UUID ou JWT signé)
    created_at: datetime = Field(default_factory=datetime.now)
    expires_at: datetime
    revoked: bool = Field(default=False)

    def is_expired(self) -> bool:
        return datetime.now() > self.expires_at