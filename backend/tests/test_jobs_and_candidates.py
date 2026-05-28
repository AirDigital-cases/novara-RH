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
    job_slug = job_response.get_json()["job"]["slug"]

    job_lookup_response = client.get(f"/api/v1/jobs?slug={job_slug}")
    assert job_lookup_response.status_code == 200
    assert len(job_lookup_response.get_json()["items"]) == 1

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


def test_create_candidate_answers_in_batch(client, auth_header):
    company_response = client.post(
        "/api/v1/companies",
        json={
            "name": "Novare Dois",
            "cnpj": "98.765.432/0001-11",
            "email": "contato2@novare.test",
            "phone": "11999998888",
        },
        headers=auth_header,
    )
    company_id = company_response.get_json()["company"]["id"]

    job_response = client.post(
        "/api/v1/jobs",
        json={
            "company_id": company_id,
            "title": "Auxiliar de RH",
            "description": "Apoio em recrutamento e selecao.",
            "department": "People",
            "location": "Sao Paulo",
            "salary_min": 2000,
            "salary_max": 3000,
        },
        headers=auth_header,
    )
    job_id = job_response.get_json()["job"]["id"]

    apply_response = client.post(
        f"/api/v1/jobs/{job_id}/apply",
        json={
            "name": "Candidata Respostas",
            "email": "respostas@example.com",
            "phone": "11977776666",
            "desired_salary": 2500,
        },
    )
    assert apply_response.status_code == 201
    candidate_id = apply_response.get_json()["candidate"]["id"]

    answers_response = client.post(
        f"/api/v1/candidates/{candidate_id}/answers",
        json={
            "answers": [
                {
                    "question": "Você tem experiência na função?",
                    "answer": "sim",
                },
                {
                    "question": "Você tem conhecimento em Excel?",
                    "answer": "sim",
                },
                {
                    "question": "Por que você quer essa vaga?",
                    "answer": "Quero crescer na area de RH.",
                },
            ]
        },
    )
    assert answers_response.status_code == 201
    assert len(answers_response.get_json()["items"]) == 3

    candidate_response = client.get(f"/api/v1/candidates/{candidate_id}", headers=auth_header)
    candidate = candidate_response.get_json()["candidate"]

    assert candidate_response.status_code == 200
    assert candidate["score"] == 60
    assert any(answer["question"] == "Por que você quer essa vaga?" for answer in candidate["answers"])
