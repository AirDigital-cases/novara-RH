from __future__ import annotations

from app.extensions import db
from app.models.base import TimestampMixin


class Company(TimestampMixin, db.Model):
    __tablename__ = "companies"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    cnpj = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30))

    users = db.relationship("User", back_populates="company", lazy=True)
    jobs = db.relationship("Job", back_populates="company", lazy=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "cnpj": self.cnpj,
            "email": self.email,
            "phone": self.phone,
            "created_at": self.created_at.isoformat(),
        }
