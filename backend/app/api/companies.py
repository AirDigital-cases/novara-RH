from __future__ import annotations

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.api.utils import get_request_data, json_error
from app.extensions import db
from app.models import Company


companies_bp = Blueprint("companies", __name__, url_prefix="/companies")


@companies_bp.post("")
@jwt_required()
def create_company():
    data = get_request_data()

    name = (data.get("name") or "").strip()
    cnpj = (data.get("cnpj") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip() or None

    if not all([name, cnpj, email]):
        return json_error("name, cnpj e email sao obrigatorios.")

    if Company.query.filter_by(cnpj=cnpj).first():
        return json_error("Ja existe empresa com este CNPJ.", 409)

    company = Company(name=name, cnpj=cnpj, email=email, phone=phone)
    db.session.add(company)
    db.session.commit()

    return jsonify({"company": company.to_dict()}), 201


@companies_bp.get("")
@jwt_required()
def list_companies():
    companies = Company.query.order_by(Company.created_at.desc()).all()
    return jsonify({"items": [company.to_dict() for company in companies]})
