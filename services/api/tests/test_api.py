from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session, sessionmaker

from app.main import create_app
from app.modules.catalog.models import Category, Product


def test_health() -> None:
    client = TestClient(create_app())
    response = client.get("/health")
    assert response.status_code == 200
    assert response.headers["X-Content-Type-Options"] == "nosniff"


def test_demande_de_rendez_vous_jamais_confirmee(factory: sessionmaker[Session]) -> None:
    client = TestClient(create_app())
    payload = {
        "family": "visage",
        "preferred_date": (datetime.now(UTC).date() + timedelta(days=3)).isoformat(),
        "preferred_moment": "matin",
        "customer_name": "Awa",
        "customer_phone": "+225 07 00 00 00 00",
        "consent": True,
    }
    response = client.post("/api/v1/booking-requests", json=payload)
    assert response.status_code == 201, response.text
    assert response.json()["status"] == "REQUESTED"
    past = {**payload, "preferred_date": "2020-01-01"}
    assert client.post("/api/v1/booking-requests", json=past).status_code == 422
    assert client.post("/api/v1/booking-requests", json={**payload, "consent": False}).status_code == 422


def test_commande_et_suivi_sans_compte(factory: sessionmaker[Session]) -> None:
    with factory() as s, s.begin():
        cat = Category(slug="corps", name="Corps", status="DEMO_ONLY")
        s.add(cat)
        s.flush()
        p = Product(
            slug="x",
            name="X",
            category_id=cat.id,
            price_xof=5000,
            stock_on_hand=2,
            is_published=True,
            status="DEMO_ONLY",
        )
        s.add(p)
        s.flush()
        pid = p.id
    client = TestClient(create_app())
    body = {
        "lines": [{"product_id": pid, "quantity": 2}],
        "fulfilment_mode": "PICKUP_INSTITUTE",
        "payment_method": "PAY_AT_PICKUP",
        "customer_name": "Cliente",
        "customer_phone": "+2250700000000",
    }
    created = client.post("/api/v1/orders", json=body)
    assert created.status_code == 201, created.text
    data = created.json()
    assert data["status"] == "PENDING_CONFIRMATION"
    # Stock épuisé : seconde commande refusée
    assert client.post("/api/v1/orders", json=body).json()["error"]["code"] == "insufficient_stock"
    ok = client.get(
        "/api/v1/orders/track", params={"reference": data["reference"], "token": data["tracking_token"]}
    )
    assert ok.status_code == 200 and ok.json()["payment_status"] == "UNPAID"
    bad = client.get("/api/v1/orders/track", params={"reference": data["reference"], "token": "faux"})
    assert bad.status_code == 404
    # Mode de règlement incohérent refusé
    wrong = {**body, "payment_method": "CASH_ON_DELIVERY"}
    assert client.post("/api/v1/orders", json=wrong).status_code == 422
    products = client.get("/api/v1/catalog/products").json()
    assert products[0]["availability"] == "OUT_OF_STOCK"
