from __future__ import annotations

from flask import Flask, jsonify

from app.api import register_blueprints
from app.config import Config
from app.extensions import db, jwt


def create_app(config_object=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

    app.config["UPLOAD_FOLDER"].mkdir(parents=True, exist_ok=True)
    (app.config["BASE_DIR"] / "instance").mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)
    register_blueprints(app)

    with app.app_context():
        db.create_all()

    @app.get("/health")
    def healthcheck():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Recurso nao encontrado."}), 404

    return app
