def test_register_and_login(client):
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Wesley",
            "email": "wesley@example.com",
            "password": "senha123",
            "role": "recrutador",
        },
    )
    assert register_response.status_code == 201

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "wesley@example.com", "password": "senha123"},
    )
    body = login_response.get_json()

    assert login_response.status_code == 200
    assert "access_token" in body
    assert body["user"]["role"] == "recrutador"
