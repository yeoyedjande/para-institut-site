from datetime import UTC, datetime, timedelta

import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.modules.booking.models import Appointment, Resource


def test_pas_de_double_reservation_sur_une_cabine(factory: sessionmaker[Session]) -> None:
    start = datetime(2027, 1, 10, 9, 0, tzinfo=UTC)
    with factory() as s, s.begin():
        cabin = Resource(name="Cabine 1")
        s.add(cabin)
        s.flush()
        s.add(Appointment(resource_id=cabin.id, starts_at=start, ends_at=start + timedelta(minutes=60)))
        cabin_id = cabin.id
    # Chevauchement sur la même cabine : refusé par la base
    with factory() as s, pytest.raises(IntegrityError), s.begin():
        s.add(
            Appointment(
                resource_id=cabin_id,
                starts_at=start + timedelta(minutes=30),
                ends_at=start + timedelta(minutes=90),
            )
        )
    # Bout à bout : accepté
    with factory() as s, s.begin():
        s.add(
            Appointment(
                resource_id=cabin_id,
                starts_at=start + timedelta(minutes=60),
                ends_at=start + timedelta(minutes=120),
            )
        )
    # Un rendez-vous annulé (inactif) libère le créneau
    with factory() as s, s.begin():
        s.add(
            Appointment(
                resource_id=cabin_id, starts_at=start, ends_at=start + timedelta(minutes=60), is_active=False
            )
        )
