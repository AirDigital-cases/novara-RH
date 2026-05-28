from __future__ import annotations

from decimal import Decimal, InvalidOperation
from pathlib import Path
from uuid import uuid4

from flask import current_app, jsonify, request
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename


def json_error(message: str, status_code: int = 400):
    return jsonify({"error": message}), status_code


def get_request_data() -> dict:
    if request.is_json:
        return request.get_json(silent=True) or {}
    return request.form.to_dict()


def parse_decimal(value) -> Decimal | None:
    if value in (None, ""):
        return None
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        return None


def parse_bool(value) -> bool | None:
    if value in (None, ""):
        return None
    normalized = str(value).strip().lower()
    if normalized in {"1", "true", "sim", "yes", "y"}:
        return True
    if normalized in {"0", "false", "nao", "não", "no", "n"}:
        return False
    return None


def save_upload(file_storage: FileStorage, subdirectory: str) -> str:
    base_dir = Path(current_app.config["UPLOAD_FOLDER"]) / subdirectory
    base_dir.mkdir(parents=True, exist_ok=True)

    filename = secure_filename(file_storage.filename or "arquivo")
    suffix = Path(filename).suffix
    stored_name = f"{uuid4().hex}{suffix}"
    destination = base_dir / stored_name
    file_storage.save(destination)

    backend_root = Path(current_app.config["BASE_DIR"])
    return str(destination.relative_to(backend_root))
