# app/infrastructure/db/database.py
from sqlmodel import Session, create_engine, SQLModel

from typing import Generator, Any

from app.Settings import Settings

# ⚡ On importe les modèles d'infrastructure !
from app.models.User import User

settings = Settings()

# Créer un moteur
engine = create_engine(settings.database_url, echo=False if settings.debug else False)

# Session locale
def SessionLocal() -> Session:
    return Session(bind=engine)

def get_db() -> Generator[Session, None, None]:
    """Générateur pour obtenir une session de base de données."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
