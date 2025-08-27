import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture
def user_credentials():
    return {"username": "emilien", "password": "password"}

# -----------------------------
# Login
# -----------------------------
def test_login_sets_cookies(user_credentials):
    response = client.post("/api/token", json=user_credentials)
    assert response.status_code == 200

    # Vérifie la présence des cookies HTTPOnly
    assert "access_token" in response.cookies
    assert "refresh_token" in response.cookies

    # Vérifie la structure JSON
    data = response.json()
    assert "username" in data
    assert "roles" in data
    assert "scopes" in data

# -----------------------------
# Refresh token
# -----------------------------
def test_refresh_token_creates_new_access_token(user_credentials):
    # Login pour récupérer les cookies
    response = client.post("/api/token", json=user_credentials)
    refresh_token = response.cookies.get("refresh_token")
    assert refresh_token

    # Enregistre le refresh_token sur le client
    client.cookies.set("refresh_token", refresh_token)

    # Envoie la requête de refresh
    response2 = client.post("/api/auth/refresh-token")
    assert response2.status_code == 200
    new_access_token = response2.json().get("access_token")
    assert new_access_token and isinstance(new_access_token, str)

# -----------------------------
# Endpoint protégé
# -----------------------------
def test_access_protected_endpoint(user_credentials):
    # Login
    response = client.post("/api/token", json=user_credentials)
    access_token = response.cookies.get("access_token")

    # Enregistre le cookie d'accès
    client.cookies.set("access_token", access_token)

    response2 = client.get("/api/auth/me")
    assert response2.status_code == 200
    data = response2.json()
    assert data["username"] == user_credentials["username"]

# -----------------------------
# Accès refusé sans token
# -----------------------------
def test_protected_endpoint_fails_without_token():
    # Supprime tout cookie existant
    client.cookies.clear()
    
    response = client.get("/api/auth/me")
    assert response.status_code == 401

# -----------------------------
# Logout
# -----------------------------
def test_logout_revokes_refresh_token(user_credentials):
    response = client.post("/api/token", json=user_credentials)
    refresh_token = response.cookies.get("refresh_token")
    access_token = response.cookies.get("access_token")

    # Enregistre les cookies avant logout
    client.cookies.set("refresh_token", refresh_token)
    client.cookies.set("access_token", access_token)

    # Logout
    response2 = client.post("/api/auth/logout")
    assert response2.status_code == 200

    # Vérifie que les cookies sont supprimés
    assert "refresh_token" not in response2.cookies
    assert "access_token" not in response2.cookies
