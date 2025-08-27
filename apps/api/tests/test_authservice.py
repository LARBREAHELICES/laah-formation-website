from fastapi.testclient import TestClient
import pytest

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) 

from main import app

client = TestClient(app)

@pytest.fixture
def user_credentials():
    return {"username": "emilien", "password": "password"}

def test_login_returns_user_data(user_credentials):
    response = client.post("/api/token", json=user_credentials)
    assert response.status_code == 200
    data = response.json()

    # Vérifie les champs que ton service renvoie réellement
    assert "id" in data
    assert "username" in data
    assert "roles" in data
    assert "scopes" in data

    # Vérifie que le username correspond bien
    assert data["username"] == user_credentials["username"]

    # Vérifie que les rôles sont bien une liste
    assert isinstance(data["roles"], list)
    assert len(data["roles"]) > 0

def test_refresh_valid_refresh_token(user_credentials):
    # 1. Login -> récupère infos user
    tokens = client.post("/api/token", json=user_credentials).json()

    # Vérifie que la réponse contient bien les infos attendues
    assert "id" in tokens
    assert "roles" in tokens
    assert "scopes" in tokens

    # 2. Simule un refresh (dans ton cas, il n’y a pas de refresh_token distinct)
    resp = client.post("/api/auth/refresh-token", json={"user_id": tokens["id"]})
    assert resp.status_code == 200

    data = resp.json()
    # Vérifie que le refresh renvoie bien un nouveau access_token
    assert "access_token" in data
    assert isinstance(data["access_token"], str)

def test_login_includes_admin_role(client, user_credentials):
    response = client.post("/api/token", json=user_credentials)
    assert response.status_code == 200
    data = response.json()

    # Vérifie la structure attendue
    assert "id" in data
    assert "username" in data
    assert "roles" in data
    assert "scopes" in data

    # Vérifie qu'au moins un rôle est présent
    assert len(data["roles"]) > 0
    # Exemple : si tu sais que le user de test a le rôle admin
    assert "admin" in data["roles"]

def test_login_includes_scopes(client, user_credentials):
    response = client.post("/api/token", json=user_credentials)
    assert response.status_code == 200
    data = response.json()

    # Vérifie que scopes est une liste de chaînes non vides
    assert isinstance(data["scopes"], list)
    assert all(isinstance(scope, str) for scope in data["scopes"])
    assert all(scope.strip() != "" for scope in data["scopes"])


# --- Cas d'échec ---
def test_login_with_wrong_password(client, user_credentials):
    creds = dict(user_credentials)
    creds["password"] = "wrongpassword"
    response = client.post("/api/token", json=creds)
    assert response.status_code in (400, 401)


def test_login_with_unknown_username(client):
    response = client.post("/api/token", json={"username": "notexist", "password": "test"})
    assert response.status_code in (400, 401)


def test_login_with_missing_fields(client):
    response = client.post("/api/token", json={"username": "testonly"})
    assert response.status_code == 422  # Pydantic validation error
