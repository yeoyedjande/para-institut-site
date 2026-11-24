from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, String, Text, text
from sqlalchemy.dialects.postgresql import TSTZRANGE, ExcludeConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, Timestamped

BOOKING_STATUSES = ("REQUESTED", "CONFIRMED", "DECLINED", "RESCHEDULED", "CANCELLED", "COMPLETED", "NO_SHOW")


class Resource(Timestamped, Base):
    """Cabine ou ressource de l'institut (configurable en back-office)."""

    __tablename__ = "resources"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)
    is_active: Mapped[bool] = mapped_column(default=True)


class BookingRequest(Timestamped, Base):
    """Demande de rendez-vous : jamais un rendez-vous confirmé tant que l'équipe ne l'a pas validée."""

    __tablename__ = "booking_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    reference: Mapped[str] = mapped_column(String(24), unique=True)
    service_id: Mapped[int | None] = mapped_column(ForeignKey("services.id"))
    family: Mapped[str] = mapped_column(String(16))
    preferred_date: Mapped[str] = mapped_column(String(10))
    preferred_moment: Mapped[str] = mapped_column(String(16))
    customer_name: Mapped[str] = mapped_column(String(120))
    customer_phone: Mapped[str] = mapped_column(String(24))
    message: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(16), default="REQUESTED")
    __table_args__ = (CheckConstraint(f"status IN {BOOKING_STATUSES}", name="status"),)


class Appointment(Timestamped, Base):
    """Rendez-vous confirmé sur une ressource. La contrainte d'exclusion PostgreSQL empêche
    deux rendez-vous actifs qui se chevauchent sur la même cabine (prévention des doubles réservations)."""

    __tablename__ = "appointments"
    id: Mapped[int] = mapped_column(primary_key=True)
    booking_request_id: Mapped[int | None] = mapped_column(ForeignKey("booking_requests.id"))
    resource_id: Mapped[int] = mapped_column(ForeignKey("resources.id"))
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(default=True)

    __table_args__ = (
        CheckConstraint("ends_at > starts_at", name="period"),
        ExcludeConstraint(
            ("resource_id", "="),
            (text("tstzrange(starts_at, ends_at, '[)')"), "&&"),
            where=text("is_active"),
            using="gist",
            name="appointments_no_overlap",
        ),
    )


__all__ = ["TSTZRANGE", "Appointment", "BookingRequest", "Resource"]
