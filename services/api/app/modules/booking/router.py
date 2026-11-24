import secrets
from datetime import UTC, date, datetime
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Request, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.rate_limit import RateLimiter, client_key
from app.db.session import get_session
from app.modules.booking.models import BookingRequest

router = APIRouter(prefix="/booking-requests", tags=["réservation"])
_limiter = RateLimiter(get_settings().public_rate_limit_per_minute)


class BookingIn(BaseModel):
    family: Literal["visage", "corps", "massages", "spa"]
    preferred_date: date
    preferred_moment: Literal["matin", "apres-midi", "indifferent"]
    customer_name: str = Field(min_length=2, max_length=120)
    customer_phone: str = Field(pattern=r"^\+?[\d\s.-]{8,20}$")
    message: str = Field(default="", max_length=500)
    consent: Literal[True]

    @field_validator("preferred_date")
    @classmethod
    def not_in_past(cls, value: date) -> date:
        if value < datetime.now(UTC).date():  # Abidjan : UTC+0 toute l'année
            raise ValueError("La date souhaitée ne peut pas être passée.")
        return value


class BookingOut(BaseModel):
    reference: str
    status: str
    message: str


@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking_request(
    payload: BookingIn, request: Request, session: Annotated[Session, Depends(get_session)]
) -> BookingOut:
    _limiter.check(client_key(request))
    booking = BookingRequest(
        reference="RDV-" + secrets.token_hex(4).upper(),
        family=payload.family,
        preferred_date=payload.preferred_date.isoformat(),
        preferred_moment=payload.preferred_moment,
        customer_name=payload.customer_name.strip(),
        customer_phone=payload.customer_phone.strip(),
        message=payload.message.strip(),
    )
    session.add(booking)
    session.commit()
    return BookingOut(
        reference=booking.reference,
        status=booking.status,
        message="Demande reçue. Ce n'est pas encore un rendez-vous : l'institut vous recontacte pour confirmer un créneau.",
    )
