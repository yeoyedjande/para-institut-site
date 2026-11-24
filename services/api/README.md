# API Para Institut du Palm Club

FastAPI · SQLAlchemy 2 · Alembic · PostgreSQL. Monolithe modulaire : `catalog`, `orders`, `booking`, `audit`.

```bash
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000   # http://localhost:8000/docs
uv run ruff check . && uv run mypy && uv run pytest
```

Les tests d'intégration utilisent `TEST_DATABASE_URL` (PostgreSQL, extension `btree_gist`). Sans base disponible,
ils sont ignorés, sauf si `REQUIRE_INTEGRATION_DB=1` (CI).

Règles métier implémentées : `app/modules/orders/service.py` (réservation transactionnelle du stock, annulation qui
libère les quantités, prix figés, règlement indépendant) et contrainte d'exclusion anti-double réservation
(`app/modules/booking/models.py`). Voir `docs/business/BUSINESS_RULES.md`.
