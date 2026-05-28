import pytest

from app import create_app
from app.config import TestingConfig
from app.extensions import db


@pytest.fixture()
def app():
    app = create_app(TestingConfig)
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def auth_header(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Admin RH",
            "email": "admin@novare.test",
            "password": "123456",
            "role": "admin",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@novare.test", "password": "123456"},
    )
    token = response.get_json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
