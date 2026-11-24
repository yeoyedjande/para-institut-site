from concurrent.futures import ThreadPoolExecutor

import pytest
from sqlalchemy.orm import Session, sessionmaker

from app.core.errors import DomainError
from app.modules.catalog.models import Category, Product
from app.modules.orders.models import Order
from app.modules.orders.service import LineRequest, OrderRequest, place_order, set_payment_status, transition


def make_product(factory: sessionmaker[Session], stock: int = 5, price: int = 10000) -> int:
    with factory() as s, s.begin():
        cat = Category(slug="visage", name="Visage", status="DEMO_ONLY")
        s.add(cat)
        s.flush()
        p = Product(
            slug="p",
            name="Produit test",
            category_id=cat.id,
            price_xof=price,
            stock_on_hand=stock,
            is_published=True,
            status="DEMO_ONLY",
        )
        s.add(p)
        s.flush()
        return p.id


def request(product_id: int, qty: int, mode: str = "PICKUP_INSTITUTE") -> OrderRequest:
    return OrderRequest(
        lines=[LineRequest(product_id, qty)],
        fulfilment_mode=mode,
        payment_method="PAY_AT_PICKUP" if mode == "PICKUP_INSTITUTE" else "CASH_ON_DELIVERY",
        customer_name="Cliente Test",
        customer_phone="+2250700000000",
        delivery_address="Adresse de test" if mode == "DELIVERY_ABIDJAN" else None,
        delivery_fee_xof=0,
    )


def stock(factory: sessionmaker[Session], pid: int) -> tuple[int, int]:
    with factory() as s:
        p = s.get(Product, pid)
        assert p is not None
        return p.stock_on_hand, p.stock_reserved


def test_commande_reserve_le_stock_et_fige_les_prix(factory: sessionmaker[Session]) -> None:
    pid = make_product(factory, stock=5, price=12500)
    with factory() as s:
        order, token = place_order(s, request(pid, 2))
    assert order.status == "PENDING_CONFIRMATION"
    assert order.payment_status == "UNPAID"
    assert order.total_xof == 25000
    assert order.lines[0].unit_price_xof == 12500
    assert len(token) > 20 and order.tracking_token_hash != token
    assert stock(factory, pid) == (5, 2)


def test_stock_insuffisant_refuse(factory: sessionmaker[Session]) -> None:
    pid = make_product(factory, stock=1)
    with factory() as s, pytest.raises(DomainError) as err:
        place_order(s, request(pid, 2))
    assert err.value.code == "insufficient_stock"
    assert stock(factory, pid) == (1, 0)


def test_annulation_libere_les_quantites(factory: sessionmaker[Session]) -> None:
    pid = make_product(factory, stock=3)
    with factory() as s:
        order, _ = place_order(s, request(pid, 3))
    with factory() as s:
        transition(s, order.id, "CANCELLED", actor="agent", reason="Demande de la cliente")
    assert stock(factory, pid) == (3, 0)
    with factory() as s:
        o = s.get(Order, order.id)
        assert o is not None
        assert [e.kind for e in o.events] == ["created", "status_changed"]


def test_remise_decremente_le_stock_physique(factory: sessionmaker[Session]) -> None:
    pid = make_product(factory, stock=4)
    with factory() as s:
        order, _ = place_order(s, request(pid, 1))
    for status in ("CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "COMPLETED"):
        with factory() as s:
            transition(s, order.id, status, actor="agent")
    assert stock(factory, pid) == (3, 0)


def test_transition_interdite(factory: sessionmaker[Session]) -> None:
    pid = make_product(factory)
    with factory() as s:
        order, _ = place_order(s, request(pid, 1))
    with factory() as s:
        transition(s, order.id, "CANCELLED", actor="agent")
    with factory() as s, pytest.raises(DomainError) as err:
        transition(s, order.id, "CONFIRMED", actor="agent")
    assert err.value.code == "invalid_transition"


def test_reglement_independant_du_statut(factory: sessionmaker[Session]) -> None:
    pid = make_product(factory)
    with factory() as s:
        order, _ = place_order(s, request(pid, 1))
    with factory() as s:
        o = set_payment_status(s, order.id, "PAID", actor="caisse")
    assert o.status == "PENDING_CONFIRMATION" and o.payment_status == "PAID"


def test_livraison_exige_une_adresse(factory: sessionmaker[Session]) -> None:
    pid = make_product(factory)
    req = request(pid, 1, mode="DELIVERY_ABIDJAN")
    req = OrderRequest(**{**req.__dict__, "delivery_address": "  "})
    with factory() as s, pytest.raises(DomainError) as err:
        place_order(s, req)
    assert err.value.code == "delivery_address_required"


def test_commandes_concurrentes_sans_survente(factory: sessionmaker[Session]) -> None:
    """10 clientes tentent simultanément d'acheter 1 article d'un stock de 3 : exactement 3 réussissent."""
    pid = make_product(factory, stock=3)

    def attempt(_: int) -> bool:
        with factory() as s:
            try:
                place_order(s, request(pid, 1))
                return True
            except DomainError:
                return False

    with ThreadPoolExecutor(max_workers=10) as pool:
        results = list(pool.map(attempt, range(10)))
    assert sum(results) == 3
    assert stock(factory, pid) == (3, 3)
