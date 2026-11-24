import os
from collections.abc import Iterator

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

TEST_DB = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+psycopg://para:para_dev@localhost:5432/para_official_test"
)
os.environ.setdefault("DATABASE_URL", TEST_DB)
os.environ.setdefault("ENVIRONMENT", "test")


@pytest.fixture(scope="session")
def engine() -> Iterator[Engine]:
    eng = create_engine(TEST_DB, pool_pre_ping=True)
    try:
        with eng.connect() as conn:
            conn.execute(text("select 1"))
    except Exception as exc:  # pragma: no cover - dépend de l'environnement
        if os.environ.get("REQUIRE_INTEGRATION_DB") == "1":
            raise
        pytest.skip(f"PostgreSQL de test indisponible : {exc}")
    from alembic.config import Config

    from alembic import command

    cfg = Config(os.path.join(os.path.dirname(__file__), "..", "alembic.ini"))
    cfg.set_main_option("script_location", os.path.join(os.path.dirname(__file__), "..", "alembic"))
    os.environ["DATABASE_URL"] = TEST_DB
    command.downgrade(cfg, "base")
    command.upgrade(cfg, "head")
    yield eng
    eng.dispose()


@pytest.fixture
def factory(engine: Engine) -> Iterator[sessionmaker[Session]]:
    yield sessionmaker(engine, expire_on_commit=False)
    with engine.begin() as conn:
        conn.execute(
            text(
                "TRUNCATE appointments, booking_requests, resources, order_events, order_lines, orders, products, services, "
                "categories, brands, audit_logs RESTART IDENTITY CASCADE"
            )
        )
