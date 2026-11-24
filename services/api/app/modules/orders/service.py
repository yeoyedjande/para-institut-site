"""Règles de commande V1 (docs/business/BUSINESS_RULES.md).

- Une commande est créée « en attente de confirmation » ; les quantités sont réservées dans la même
  transaction, sous verrou des lignes produits (SELECT … FOR UPDATE, ordre stable par id : pas d'interblocage).
- La confirmation vérifie de nouveau le stock ; l'annulation libère les quantités réservées.
- La remise au client (COMPLETED) décrémente le stock physique et la réservation.
- Prix, frais et noms des produits sont figés dans la commande. Statut de règlement indépendant.
"""

import hashlib
import secrets
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.errors import DomainError
from app.modules.catalog.models import Product
from app.modules.orders.models import Order, OrderEvent, OrderLine

TRANSITIONS: dict[str, tuple[str, ...]] = {
    "PENDING_CONFIRMATION": ("CONFIRMED", "CANCELLED"),
    "CONFIRMED": ("PREPARING", "CANCELLED"),
    "PREPARING": ("READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "CANCELLED"),
    "READY_FOR_PICKUP": ("COMPLETED", "CANCELLED"),
    "OUT_FOR_DELIVERY": ("COMPLETED", "CANCELLED"),
    "COMPLETED": (),
    "CANCELLED": (),
}

MAX_LINE_QTY = 50


@dataclass(frozen=True)
class LineRequest:
    product_id: int
    quantity: int


@dataclass(frozen=True)
class OrderRequest:
    lines: list[LineRequest]
    fulfilment_mode: str
    payment_method: str
    customer_name: str
    customer_phone: str
    delivery_address: str | None
    delivery_fee_xof: int


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def _reference() -> str:
    # Référence opaque, non prédictible, lisible au téléphone (sans 0/O/1/I)
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "PI-" + "".join(secrets.choice(alphabet) for _ in range(8))


def _merge_lines(lines: list[LineRequest]) -> dict[int, int]:
    merged: dict[int, int] = {}
    for line in lines:
        if line.quantity <= 0 or line.quantity > MAX_LINE_QTY:
            raise DomainError("invalid_quantity", "Quantité invalide.")
        merged[line.product_id] = merged.get(line.product_id, 0) + line.quantity
    if not merged:
        raise DomainError("empty_order", "La commande ne contient aucun article.")
    return merged


def place_order(session: Session, req: OrderRequest, actor: str = "client") -> tuple[Order, str]:
    """Crée la commande et réserve le stock de façon atomique. Retourne la commande et le jeton de suivi
    (affiché une seule fois au client, jamais stocké en clair)."""
    if req.fulfilment_mode == "DELIVERY_ABIDJAN" and not (req.delivery_address or "").strip():
        raise DomainError("delivery_address_required", "Adresse de livraison requise.")
    if req.fulfilment_mode == "PICKUP_INSTITUTE" and req.delivery_fee_xof != 0:
        raise DomainError("invalid_fee", "Aucun frais de livraison pour un retrait à l'institut.")
    if req.delivery_fee_xof < 0:
        raise DomainError("invalid_fee", "Frais de livraison invalides.")
    wanted = _merge_lines(req.lines)

    with session.begin_nested() if session.in_transaction() else session.begin():
        products = (
            session.execute(
                select(Product).where(Product.id.in_(wanted)).order_by(Product.id).with_for_update()
            )
            .scalars()
            .all()
        )
        by_id = {p.id: p for p in products}
        lines: list[OrderLine] = []
        subtotal = 0
        for product_id, qty in sorted(wanted.items()):
            product = by_id.get(product_id)
            if product is None or not product.is_published or product.price_xof is None:
                raise DomainError("product_unavailable", "Un produit n'est pas disponible à la vente.", 409)
            if product.available < qty:
                raise DomainError("insufficient_stock", f"Stock insuffisant pour « {product.name} ».", 409)
            product.stock_reserved += qty
            subtotal += product.price_xof * qty
            lines.append(
                OrderLine(
                    product_id=product.id,
                    product_name=product.name,
                    unit_price_xof=product.price_xof,
                    quantity=qty,
                )
            )

        token = secrets.token_urlsafe(24)
        order = Order(
            reference=_reference(),
            tracking_token_hash=hash_token(token),
            fulfilment_mode=req.fulfilment_mode,
            payment_method=req.payment_method,
            customer_name=req.customer_name.strip(),
            customer_phone=req.customer_phone.strip(),
            delivery_address=(req.delivery_address or "").strip() or None,
            subtotal_xof=subtotal,
            delivery_fee_xof=req.delivery_fee_xof,
            total_xof=subtotal + req.delivery_fee_xof,
            lines=lines,
        )
        order.events.append(
            OrderEvent(
                kind="created", to_status="PENDING_CONFIRMATION", actor=actor, data={"lines": len(lines)}
            )
        )
        session.add(order)
    return order, token


def _lock_order(session: Session, order_id: int) -> Order:
    order = session.execute(select(Order).where(Order.id == order_id).with_for_update()).scalar_one_or_none()
    if order is None:
        raise DomainError("order_not_found", "Commande introuvable.", 404)
    return order


def _lock_products(session: Session, order: Order) -> dict[int, Product]:
    ids = sorted({line.product_id for line in order.lines})
    rows = session.execute(
        select(Product).where(Product.id.in_(ids)).order_by(Product.id).with_for_update()
    ).scalars()
    return {p.id: p for p in rows}


def transition(
    session: Session, order_id: int, to_status: str, actor: str, reason: str | None = None
) -> Order:
    """Change le statut d'une commande en respectant le cycle de vie et les effets sur le stock."""
    with session.begin_nested() if session.in_transaction() else session.begin():
        order = _lock_order(session, order_id)
        if to_status == order.status:
            return order  # idempotent
        if to_status not in TRANSITIONS[order.status]:
            raise DomainError(
                "invalid_transition", f"Transition {order.status} → {to_status} interdite.", 409
            )
        products = _lock_products(session, order)

        if to_status == "CONFIRMED":
            # Le stock réservé doit toujours être couvert par le stock physique (inventaire corrigé entre-temps)
            for line in order.lines:
                product = products[line.product_id]
                if product.stock_on_hand < product.stock_reserved:
                    raise DomainError(
                        "insufficient_stock", f"Stock insuffisant pour « {line.product_name} ».", 409
                    )
        elif to_status == "CANCELLED":
            for line in order.lines:
                products[line.product_id].stock_reserved -= line.quantity
        elif to_status == "COMPLETED":
            for line in order.lines:
                product = products[line.product_id]
                product.stock_reserved -= line.quantity
                product.stock_on_hand -= line.quantity

        order.events.append(
            OrderEvent(
                kind="status_changed",
                from_status=order.status,
                to_status=to_status,
                actor=actor,
                data={"reason": reason} if reason else {},
            )
        )
        order.status = to_status
    return order


def set_payment_status(session: Session, order_id: int, payment_status: str, actor: str) -> Order:
    """Enregistre le règlement (espèces à la livraison ou au retrait) indépendamment du statut de commande."""
    with session.begin_nested() if session.in_transaction() else session.begin():
        order = _lock_order(session, order_id)
        if order.status == "CANCELLED" and payment_status == "PAID":
            raise DomainError(
                "order_cancelled", "Commande annulée : aucun règlement ne peut être enregistré.", 409
            )
        order.events.append(
            OrderEvent(
                kind="payment_status_changed",
                actor=actor,
                data={"from": order.payment_status, "to": payment_status},
            )
        )
        order.payment_status = payment_status
    return order
