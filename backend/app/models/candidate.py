from __future__ import annotations

from decimal import Decimal

from app.extensions import db
from app.models.base import TimestampMixin


class Candidate(TimestampMixin, db.Model):
    __tablename__ = "candidates"

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30))
    city = db.Column(db.String(120))
    last_salary = db.Column(db.Numeric(10, 2))
    desired_salary = db.Column(db.Numeric(10, 2))
    resume_path = db.Column(db.String(255))
    audio_pitch_path = db.Column(db.String(255))
    status = db.Column(db.String(50), nullable=False, default="inscricao_recebida")
    score = db.Column(db.Integer, nullable=False, default=0)

    job = db.relationship("Job", back_populates="candidates")
    documents = db.relationship(
        "CandidateDocument",
        back_populates="candidate",
        cascade="all, delete-orphan",
        lazy=True,
    )
    answers = db.relationship(
        "CandidateAnswer",
        back_populates="candidate",
        cascade="all, delete-orphan",
        lazy=True,
    )
    tests = db.relationship(
        "CandidateTest",
        back_populates="candidate",
        cascade="all, delete-orphan",
        lazy=True,
    )
    tags = db.relationship(
        "CandidateTag",
        back_populates="candidate",
        cascade="all, delete-orphan",
        lazy=True,
    )

    @staticmethod
    def _decimal_to_float(value: Decimal | None) -> float | None:
        return float(value) if value is not None else None

    def to_dict(self, include_relations: bool = False) -> dict:
        payload = {
            "id": self.id,
            "job_id": self.job_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "city": self.city,
            "last_salary": self._decimal_to_float(self.last_salary),
            "desired_salary": self._decimal_to_float(self.desired_salary),
            "resume_path": self.resume_path,
            "audio_pitch_path": self.audio_pitch_path,
            "status": self.status,
            "score": self.score,
            "created_at": self.created_at.isoformat(),
            "job": self.job.to_dict(include_company=False) if self.job else None,
        }
        if include_relations:
            payload["documents"] = [document.to_dict() for document in self.documents]
            payload["answers"] = [answer.to_dict() for answer in self.answers]
            payload["tests"] = [test.to_dict() for test in self.tests]
            payload["tags"] = [tag.to_dict() for tag in self.tags]
        return payload


class CandidateDocument(TimestampMixin, db.Model):
    __tablename__ = "candidate_documents"

    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidates.id"), nullable=False)
    document_type = db.Column(db.String(50), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(30), nullable=False, default="pending")

    candidate = db.relationship("Candidate", back_populates="documents")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "candidate_id": self.candidate_id,
            "document_type": self.document_type,
            "file_path": self.file_path,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class CandidateAnswer(TimestampMixin, db.Model):
    __tablename__ = "candidate_answers"

    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidates.id"), nullable=False)
    question = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.Text, nullable=False)

    candidate = db.relationship("Candidate", back_populates="answers")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "candidate_id": self.candidate_id,
            "question": self.question,
            "answer": self.answer,
            "created_at": self.created_at.isoformat(),
        }


class CandidateTest(TimestampMixin, db.Model):
    __tablename__ = "candidate_tests"

    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidates.id"), nullable=False)
    test_type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    file_path = db.Column(db.String(255))
    result = db.Column(db.Text)
    status = db.Column(db.String(30), nullable=False, default="pending")

    candidate = db.relationship("Candidate", back_populates="tests")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "candidate_id": self.candidate_id,
            "test_type": self.test_type,
            "title": self.title,
            "description": self.description,
            "file_path": self.file_path,
            "result": self.result,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class CandidateTag(TimestampMixin, db.Model):
    __tablename__ = "candidate_tags"
    __table_args__ = (
        db.UniqueConstraint("candidate_id", "tag", name="uq_candidate_tag"),
    )

    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidates.id"), nullable=False)
    tag = db.Column(db.String(80), nullable=False)

    candidate = db.relationship("Candidate", back_populates="tags")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "candidate_id": self.candidate_id,
            "tag": self.tag,
            "created_at": self.created_at.isoformat(),
        }
