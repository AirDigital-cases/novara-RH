from app.api.auth import auth_bp
from app.api.candidates import candidates_bp
from app.api.companies import companies_bp
from app.api.dashboard import dashboard_bp
from app.api.jobs import jobs_bp


def register_blueprints(app) -> None:
    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(companies_bp, url_prefix="/api/v1/companies")
    app.register_blueprint(jobs_bp, url_prefix="/api/v1/jobs")
    app.register_blueprint(candidates_bp, url_prefix="/api/v1")
    app.register_blueprint(dashboard_bp, url_prefix="/api/v1/dashboard")
