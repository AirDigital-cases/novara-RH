from __future__ import annotations

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func

from app.models import Candidate, CandidateDocument, CandidateTest, Job


dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


@dashboard_bp.get("/overview")
@jwt_required()
def dashboard_overview():
    candidates_by_stage = (
        Candidate.query.with_entities(Candidate.status, func.count(Candidate.id))
        .group_by(Candidate.status)
        .all()
    )

    top_candidates = Candidate.query.order_by(Candidate.score.desc(), Candidate.created_at.desc()).limit(5).all()

    payload = {
        "total_open_jobs": Job.query.filter_by(status="open").count(),
        "total_candidates": Candidate.query.count(),
        "candidates_by_stage": [
            {"stage": status, "count": count} for status, count in candidates_by_stage
        ],
        "top_candidates": [candidate.to_dict() for candidate in top_candidates],
        "pending_documents": CandidateDocument.query.filter_by(status="pending").count(),
        "pending_tests": CandidateTest.query.filter_by(status="pending").count(),
        "scheduled_interviews": Candidate.query.filter_by(status="entrevista").count(),
    }
    return jsonify(payload)
