from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models import Company, USER_ROLES, User
from app.api.utils import json_error


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "").strip()
    company_id = data.get("company_id")

    if not all([name, email, password, role]):
        return json_error("name, email, password e role sao obrigatorios.")

    if role not in USER_ROLES:
        return json_error("role invalido.")

    if User.query.filter_by(email=email).first():
        return json_error("Ja existe usuario com este email.", 409)

    if company_id is not None and not db.session.get(Company, company_id):
        return json_error("company_id informado nao existe.", 404)

    user = User(name=name, email=email, role=role, company_id=company_id)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"user": user.to_dict()}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return json_error("email e password sao obrigatorios.")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return json_error("Credenciais invalidas.", 401)

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )
    return jsonify({"access_token": access_token, "user": user.to_dict()})
