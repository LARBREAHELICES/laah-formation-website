import pytest
from fastapi.testclient import TestClient

from sqlmodel import SQLModel, Session, create_engine
from uuid import uuid4
from datetime import datetime

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) 

from main import app

from app.models.User import User
from app.services.AuthService import AuthService
from app.Settings import settings

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

# Crée une DB SQLite en mémoire pour les tests
@pytest.fixture(scope="function")
def session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)

    with Session(engine) as s:
        yield s

    SQLModel.metadata.drop_all(engine)
    
@pytest.fixture
def client_with_test_db(session: Session):
    from app.dependency import get_auth_service

    # Override AuthService pour utiliser la session de test
    def override_get_auth_service():
        return AuthService(session)

    app.dependency_overrides[get_auth_service] = override_get_auth_service
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def create_user_without_roles(session: Session):
    """Crée un user sans rôles"""
    user = User(
        id=str(uuid4()),
        username="noroles",
        fullname="No Roles",
        password=AuthService(session).get_password_hash("password"),
        status="active" , # si nécessaire
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    session.add(user)
    session.commit()
    yield user
    session.delete(user)
    session.commit()

@pytest.fixture
def create_user_without_scopes(session: Session):
    """Crée un user avec rôles mais sans scopes"""
    user = User(
        id=str(uuid4()),
        username="noscopes",
        fullname="No Scopes",
        password=AuthService(session).get_password_hash("password"),
        status="active",  # si nécessaire
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    # Ici on pourrait ajouter un rôle vide si nécessaire
    session.add(user)
    session.commit()
    yield user
    session.delete(user)
    session.commit()