from __future__ import annotations

from datetime import datetime, timezone

from app.extensions import db


class TimestampMixin:
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
