from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.api.utils import get_request_data, json_error, parse_decimal
from app.extensions import db
from app.models import JOB_STATUSES, Company, Job
from app.models.job import build_job_slug, slugify_job_value


jobs_bp = Blueprint("jobs", __name__, url_prefix="/jobs")


@jobs_bp.post("")
@jwt_required()
def create_job():
    data = get_request_data()

    company_id = data.get("company_id")
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    department = (data.get("department") or "").strip() or None
    location = (data.get("location") or "").strip() or None
    status = (data.get("status") or "open").strip()
    salary_min = parse_decimal(data.get("salary_min"))
    salary_max = parse_decimal(data.get("salary_max"))

    if not all([company_id, title, description]):
        return json_error("company_id, title e description sao obrigatorios.")

    if status not in JOB_STATUSES:
        return json_error("status invalido.")

    company = db.session.get(Company, company_id)
    if not company:
        return json_error("Empresa nao encontrada.", 404)

    job = Job(
        company_id=company.id,
        title=title,
        description=description,
        department=department,
        location=location,
        salary_min=salary_min,
        salary_max=salary_max,
        status=status,
    )
    db.session.add(job)
    db.session.commit()

    return jsonify({"job": job.to_dict()}), 201


@jobs_bp.get("")
@jwt_required(optional=True)
def list_jobs():
    query = Job.query.order_by(Job.created_at.desc())

    status = request.args.get("status")
    company_id = request.args.get("company_id", type=int)
    slug = (request.args.get("slug") or "").strip()

    if status:
        query = query.filter_by(status=status)
    if company_id:
        query = query.filter_by(company_id=company_id)

    jobs = query.all()
    if slug:
        normalized_slug = slugify_job_value(slug)
        jobs = [
            job
            for job in jobs
            if build_job_slug(job.title, job.id) == normalized_slug
            or build_job_slug(job.title) == normalized_slug
        ]

    return jsonify({"items": [job.to_dict() for job in jobs]})


@jobs_bp.get("/<int:job_id>")
@jwt_required(optional=True)
def get_job(job_id: int):
    job = db.get_or_404(Job, job_id)
    return jsonify({"job": job.to_dict()})


@jobs_bp.patch("/<int:job_id>")
@jwt_required()
def update_job(job_id: int):
    job = db.get_or_404(Job, job_id)
    data = get_request_data()

    if "company_id" in data:
        company = db.session.get(Company, data["company_id"])
        if not company:
            return json_error("Empresa nao encontrada.", 404)
        job.company_id = company.id

    if "status" in data and data["status"] not in JOB_STATUSES:
        return json_error("status invalido.")

    for field in ("title", "description", "department", "location", "status"):
        if field in data:
            value = data[field]
            if isinstance(value, str):
                value = value.strip()
            if field in {"department", "location"}:
                setattr(job, field, value or None)
            else:
                setattr(job, field, value)

    if "salary_min" in data:
        job.salary_min = parse_decimal(data.get("salary_min"))
    if "salary_max" in data:
        job.salary_max = parse_decimal(data.get("salary_max"))

    db.session.commit()
    return jsonify({"job": job.to_dict()})
