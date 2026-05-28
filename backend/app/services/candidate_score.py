from __future__ import annotations

from app.extensions import db
from app.models import Candidate, CandidateTag, SMART_TAGS


POSITIVE_VALUES = {"1", "sim", "true", "yes", "y", "ok"}


def normalize_answer(value: str | None) -> str:
    return (value or "").strip().lower()


def has_positive_answer(candidate: Candidate, questions: set[str]) -> bool:
    return any(
        normalize_answer(answer.answer) in POSITIVE_VALUES
        for answer in candidate.answers
        if answer.question in questions
    )


def has_negative_answer(candidate: Candidate, questions: set[str]) -> bool:
    return any(
        normalize_answer(answer.answer) in {"0", "nao", "não", "false", "no", "n"}
        for answer in candidate.answers
        if answer.question in questions
    )


def calculate_candidate_score(candidate: Candidate) -> int:
    score = 0
    experience_questions = {"Você tem experiência na função?"}
    competency_questions = {
        "Tem conhecimento em Excel?",
        "Competência técnica compatível com a vaga?",
    }

    if has_positive_answer(candidate, experience_questions):
        score += 20

    if (
        candidate.job
        and candidate.desired_salary is not None
        and candidate.job.salary_min is not None
        and candidate.job.salary_max is not None
        and candidate.job.salary_min <= candidate.desired_salary <= candidate.job.salary_max
    ):
        score += 20

    if has_positive_answer(candidate, competency_questions):
        score += 20

    if candidate.resume_path:
        score += 20

    if candidate.audio_pitch_path:
        score += 20

    return score


def derive_candidate_tags(candidate: Candidate) -> set[str]:
    tags: set[str] = set()
    experience_questions = {"Você tem experiência na função?"}

    if candidate.score >= 60:
        tags.add("bom_perfil")

    if not candidate.resume_path:
        tags.add("faltou_documento")

    if (
        candidate.job
        and candidate.desired_salary is not None
        and candidate.job.salary_max is not None
        and candidate.desired_salary > candidate.job.salary_max
    ):
        tags.add("salario_acima")

    if has_positive_answer(candidate, experience_questions):
        tags.add("experiencia_compativel")
    elif has_negative_answer(candidate, experience_questions):
        tags.add("sem_experiencia")

    if candidate.status == "entrevista":
        tags.add("chamar_entrevista")

    if candidate.status in {"competencia_tecnica", "teste_excel", "teste_comportamental"}:
        tags.add("em_teste")

    if candidate.status == "reprovado":
        tags.add("reprovado")

    if candidate.status == "aprovado":
        tags.add("aprovado")

    return tags


def sync_candidate_tags(candidate: Candidate) -> None:
    desired_tags = derive_candidate_tags(candidate)
    existing_tags = {tag.tag: tag for tag in candidate.tags}

    for tag_name, tag in existing_tags.items():
        if tag_name in SMART_TAGS and tag_name not in desired_tags:
            db.session.delete(tag)

    for tag_name in desired_tags:
        if tag_name not in existing_tags:
            db.session.add(CandidateTag(candidate=candidate, tag=tag_name))


def refresh_candidate_intelligence(candidate: Candidate) -> Candidate:
    candidate.score = calculate_candidate_score(candidate)
    sync_candidate_tags(candidate)
    return candidate
