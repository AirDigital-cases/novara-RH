def test_create_job_and_apply_candidate(client, auth_header):
    company_response = client.post(
        "/api/v1/companies",
        json={
            "name": "Novare",
            "cnpj": "12.345.678/0001-99",
            "email": "contato@novare.test",
            "phone": "11999999999",
        },
        headers=auth_header,
    )
    company_id = company_response.get_json()["company"]["id"]

    job_response = client.post(
        "/api/v1/jobs",
        json={
            "company_id": company_id,
            "title": "Analista de RH",
            "description": "Responsavel por triagem inicial.",
            "department": "People",
            "location": "Sao Paulo",
            "salary_min": 2500,
            "salary_max": 3500,
        },
        headers=auth_header,
    )
    assert job_response.status_code == 201
    job_id = job_response.get_json()["job"]["id"]

    apply_response = client.post(
        f"/api/v1/jobs/{job_id}/apply",
        json={
            "name": "Candidato Teste",
            "email": "candidato@example.com",
            "phone": "11988887777",
            "desired_salary": 3000,
            "has_experience": "sim",
            "excel_knowledge": "sim",
        },
    )
    assert apply_response.status_code == 201
    assert apply_response.get_json()["candidate"]["score"] == 60

    candidates_response = client.get("/api/v1/candidates", headers=auth_header)
    body = candidates_response.get_json()

    assert candidates_response.status_code == 200
    assert len(body["items"]) == 1
    assert body["items"][0]["status"] == "inscricao_recebida"
