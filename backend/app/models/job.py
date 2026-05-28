from __future__ import annotations

from decimal import Decimal

from app.extensions import db
from app.models.base import TimestampMixin


class Job(TimestampMixin, db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey("companies.id"), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    department = db.Column(db.String(120))
    location = db.Column(db.String(120))
    salary_min = db.Column(db.Numeric(10, 2))
    salary_max = db.Column(db.Numeric(10, 2))
    status = db.Column(db.String(30), nullable=False, default="open")

    company = db.relationship("Company", back_populates="jobs")
    candidates = db.relationship("Candidate", back_populates="job", lazy=True)

    @staticmethod
    def _decimal_to_float(value: Decimal | None) -> float | None:
        return float(value) if value is not None else None

    def to_dict(self, include_company: bool = True) -> dict:
        return {
            "id": self.id,
            "company_id": self.company_id,
            "title": self.title,
            "description": self.description,
            "department": self.department,
            "location": self.location,
            "salary_min": self._decimal_to_float(self.salary_min),
            "salary_max": self._decimal_to_float(self.salary_max),
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "company": self.company.to_dict() if include_company and self.company else None,
        }
