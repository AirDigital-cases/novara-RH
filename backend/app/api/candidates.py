from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.api.utils import get_request_data, json_error, parse_decimal, save_upload
from app.extensions import db
from app.models import (
    CANDIDATE_STAGES,
    DOCUMENT_TYPES,
    TEST_TYPES,
    Candidate,
    CandidateAnswer,
    CandidateDocument,
    CandidateTag,
    CandidateTest,
    Job,
)
from app.services.candidate_score import refresh_candidate_intelligence


candidates_bp = Blueprint("candidates", __name__)

STANDARD_ANSWER_MAP = {
    "has_experience": "Você tem experiência na função?",
    "availability": "Tem disponibilidade de horário?",
    "excel_knowledge": "Tem conhecimento em Excel?",
    "can_take_technical_test": "Pode realizar teste técnico?",
    "can_send_audio": "Pode enviar um áudio de apresentação?",
    "technical_competency": "Competência técnica compatível com a vaga?",
}


def attach_standard_answers(candidate: Candidate, data: dict) -> None:
    for field_name, question in STANDARD_ANSWER_MAP.items():
        if data.get(field_name) in (None, ""):
            continue
        db.session.add(
            CandidateAnswer(
                candidate=candidate,
                question=question,
                answer=str(data[field_name]),
            )
        )


@candidates_bp.post("/jobs/<int:job_id>/apply")
def apply_to_job(job_id: int):
    job = db.get_or_404(Job, job_id)
    if job.status != "open":
        return json_error("Esta vaga nao esta aberta para novas candidaturas.", 409)

    data = get_request_data()

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()

    if not name or not email:
        return json_error("name e email sao obrigatorios.")

    candidate = Candidate(
        job_id=job.id,
        name=name,
        email=email,
        phone=(data.get("phone") or "").strip() or None,
        city=(data.get("city") or "").strip() or None,
        last_salary=parse_decimal(data.get("last_salary")),
        desired_salary=parse_decimal(data.get("desired_salary")),
        status="inscricao_recebida",
    )

    resume = request.files.get("resume")
    audio_pitch = request.files.get("audio_pitch")

    if resume:
        candidate.resume_path = save_upload(resume, "resumes")

    if audio_pitch:
        candidate.audio_pitch_path = save_upload(audio_pitch, "audio")

    db.session.add(candidate)
    db.session.flush()

    attach_standard_answers(candidate, data)
    refresh_candidate_intelligence(candidate)
    db.session.commit()

    return jsonify({"candidate": candidate.to_dict(include_relations=True)}), 201


@candidates_bp.get("/candidates")
@jwt_required()
def list_candidates():
    query = Candidate.query.order_by(Candidate.score.desc(), Candidate.created_at.desc())

    job_id = request.args.get("job_id", type=int)
    status = request.args.get("status")

    if job_id:
        query = query.filter_by(job_id=job_id)
    if status:
        query = query.filter_by(status=status)

    candidates = query.all()
    return jsonify({"items": [candidate.to_dict() for candidate in candidates]})


@candidates_bp.get("/candidates/<int:candidate_id>")
@jwt_required()
def get_candidate(candidate_id: int):
    candidate = db.get_or_404(Candidate, candidate_id)
    return jsonify({"candidate": candidate.to_dict(include_relations=True)})


@candidates_bp.patch("/candidates/<int:candidate_id>/status")
@jwt_required()
def update_candidate_status(candidate_id: int):
    candidate = db.get_or_404(Candidate, candidate_id)
    data = get_request_data()
    status = (data.get("status") or "").strip()

    if status not in CANDIDATE_STAGES:
        return json_error("status invalido.")

    candidate.status = status
    refresh_candidate_intelligence(candidate)
    db.session.commit()

    return jsonify({"candidate": candidate.to_dict(include_relations=True)})


@candidates_bp.post("/candidates/<int:candidate_id>/documents")
def upload_candidate_document(candidate_id: int):
    candidate = db.get_or_404(Candidate, candidate_id)
    data = get_request_data()
    document_type = (data.get("document_type") or "").strip()
    status = (data.get("status") or "pending").strip()
    file_storage = request.files.get("file")

    if document_type not in DOCUMENT_TYPES:
        return json_error("document_type invalido.")

    if not file_storage:
        return json_error("Arquivo nao enviado.")

    document = CandidateDocument(
        candidate=candidate,
        document_type=document_type,
        status=status,
        file_path=save_upload(file_storage, "documents"),
    )
    db.session.add(document)
    refresh_candidate_intelligence(candidate)
    db.session.commit()

    return jsonify({"document": document.to_dict(), "candidate": candidate.to_dict()}), 201


@candidates_bp.post("/candidates/<int:candidate_id>/audio")
def upload_candidate_audio(candidate_id: int):
    candidate = db.get_or_404(Candidate, candidate_id)
    file_storage = request.files.get("file") or request.files.get("audio_pitch")

    if not file_storage:
        return json_error("Arquivo de audio nao enviado.")

    candidate.audio_pitch_path = save_upload(file_storage, "audio")
    refresh_candidate_intelligence(candidate)
    db.session.commit()

    return jsonify({"candidate": candidate.to_dict(include_relations=True)})


@candidates_bp.post("/candidates/<int:candidate_id>/tags")
@jwt_required()
def add_candidate_tag(candidate_id: int):
    candidate = db.get_or_404(Candidate, candidate_id)
    data = get_request_data()
    tag_name = (data.get("tag") or "").strip()

    if not tag_name:
        return json_error("tag e obrigatoria.")

    if any(existing.tag == tag_name for existing in candidate.tags):
        return json_error("Tag ja cadastrada.", 409)

    tag = CandidateTag(candidate=candidate, tag=tag_name)
    db.session.add(tag)
    db.session.commit()

    return jsonify({"tag": tag.to_dict()}), 201


@candidates_bp.post("/candidates/<int:candidate_id>/answers")
def create_candidate_answers(candidate_id: int):
    candidate = db.get_or_404(Candidate, candidate_id)
    data = request.get_json(silent=True) or {}

    answers = data.get("answers")
    if answers is None and data.get("question") and data.get("answer"):
        answers = [{"question": data["question"], "answer": data["answer"]}]

    if not answers or not isinstance(answers, list):
        return json_error("Envie answers como lista de question/answer.")

    created_answers = []
    for item in answers:
        question = (item.get("question") or "").strip()
        answer = (item.get("answer") or "").strip()
        if not question or not answer:
            return json_error("Cada resposta precisa de question e answer.")
        answer_model = CandidateAnswer(candidate=candidate, question=question, answer=answer)
        db.session.add(answer_model)
        created_answers.append(answer_model)

    refresh_candidate_intelligence(candidate)
    db.session.commit()

    return jsonify({"items": [answer.to_dict() for answer in created_answers]}), 201


@candidates_bp.get("/candidates/<int:candidate_id>/answers")
@jwt_required()
def list_candidate_answers(candidate_id: int):
    candidate = db.get_or_404(Candidate, candidate_id)
    return jsonify({"items": [answer.to_dict() for answer in candidate.answers]})


@candidates_bp.post("/candidates/<int:candidate_id>/tests")
@jwt_required()
def create_candidate_test(candidate_id: int):
    candidate = db.get_or_404(Candidate, candidate_id)
    data = get_request_data()
    test_type = (data.get("test_type") or "").strip()
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip() or None
    status = (data.get("status") or "pending").strip()
    file_storage = request.files.get("file")

    if test_type not in TEST_TYPES:
        return json_error("test_type invalido.")

    if not title:
        return json_error("title e obrigatorio.")

    test = CandidateTest(
        candidate=candidate,
        test_type=test_type,
        title=title,
        description=description,
        status=status,
    )

    if file_storage:
        test.file_path = save_upload(file_storage, "tests")

    db.session.add(test)
    refresh_candidate_intelligence(candidate)
    db.session.commit()

    return jsonify({"test": test.to_dict()}), 201


@candidates_bp.get("/candidates/<int:candidate_id>/tests")
@jwt_required()
def list_candidate_tests(candidate_id: int):
    candidate = db.get_or_404(Candidate, candidate_id)
    return jsonify({"items": [test.to_dict() for test in candidate.tests]})


@candidates_bp.patch("/tests/<int:test_id>/result")
@jwt_required()
def update_test_result(test_id: int):
    test = db.get_or_404(CandidateTest, test_id)
    data = request.get_json(silent=True) or {}

    test.result = data.get("result")
    if "status" in data:
        test.status = data["status"]

    refresh_candidate_intelligence(test.candidate)
    db.session.commit()

    return jsonify({"test": test.to_dict()})
