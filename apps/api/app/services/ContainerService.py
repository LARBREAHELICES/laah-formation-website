# app/container.py
from dependency_injector import containers, providers
from app.services.FormationService import FormationService
from app.database import get_session   # ton context-manager
from sqlalchemy.orm import Session

class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=["app.api.endpoints.formation_router"]   # aligné avec le vrai module
    )

    # 1) Provider de session fourni par FastAPI (contexte requête)
    db_session = providers.Callable(get_session)   # un simple callable, FastAPI gère le close

    # 2) Service
    formation_service = providers.Factory(
        FormationService,
        session=db_session
    )