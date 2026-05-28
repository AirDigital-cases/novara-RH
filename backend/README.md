# Novare RH Backend

API Flask modular para o MVP do sistema de RH.

## Endpoints principais

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/companies`
- `GET /api/v1/companies`
- `POST /api/v1/jobs`
- `GET /api/v1/jobs`
- `GET /api/v1/jobs/<id>`
- `PATCH /api/v1/jobs/<id>`
- `POST /api/v1/jobs/<job_id>/apply`
- `GET /api/v1/candidates`
- `GET /api/v1/candidates/<id>`
- `PATCH /api/v1/candidates/<id>/status`
- `POST /api/v1/candidates/<id>/documents`
- `POST /api/v1/candidates/<id>/audio`
- `POST /api/v1/candidates/<id>/tags`
- `POST /api/v1/candidates/<id>/answers`
- `GET /api/v1/candidates/<id>/answers`
- `POST /api/v1/candidates/<id>/tests`
- `GET /api/v1/candidates/<id>/tests`
- `PATCH /api/v1/tests/<id>/result`
- `GET /api/v1/dashboard/overview`

## Execucao local

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python wsgi.py
```
