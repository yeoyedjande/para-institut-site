from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Request, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.errors import DomainError
from app.core.rate_limit import RateLimiter, client_key
from app.db.session import get_session
from app.modules.orders.models import Order
from app.modules.orders.service import LineRequest, OrderRequest, hash_token, place_order

router = APIRouter(prefix="/orders", tags=["commandes"])
_limiter = RateLimiter(get_settings().public_rate_limit_per_minute)

# Frais de livraison : paramètre administrable (V1 : valeur à saisir en back-office, aucun montant inventé)
DELIVERY_FEE_NOT_CONFIGURED = None


class LineIn(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, le=50)


class OrderIn(BaseModel):
    lines: list[LineIn] = Field(min_length=1, max_length=30)
    fulfilment_mode: Literal["DELIVERY_ABIDJAN", "PICKUP_INSTITUTE"]
    payment_method: Literal["CASH_ON_DELIVERY", "PAY_AT_PICKUP"]
    customer_name: str = Field(min_length=2, max_length=120)
    customer_phone: str = Field(pattern=r"^\+?[\d\s.-]{8,20}$")
    delivery_address: str | None = Field(default=None, max_length=400)
    accepted_delivery_fee_xof: int = Field(default=0, ge=0)


class OrderCreated(BaseModel):
    reference: str
    status: str
    total_xof: int
    tracking_token: str


class OrderTracking(BaseModel):
    reference: str
    status: str
    payment_status: str
    total_xof: int


@router.post("", response_model=OrderCreated, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderIn, request: Request, session: Annotated[Session, Depends(get_session)]
) -> OrderCreated:
    _limiter.check(client_key(request))
    if payload.fulfilment_mode == "DELIVERY_ABIDJAN" and payload.payment_method != "CASH_ON_DELIVERY":
        raise DomainError("invalid_payment_method", "Livraison : règlement à la livraison uniquement.")
    if payload.fulfilment_mode == "PICKUP_INSTITUTE" and payload.payment_method != "PAY_AT_PICKUP":
        raise DomainError("invalid_payment_method", "Retrait : règlement au retrait uniquement.")
    order, token = place_order(
        session,
        OrderRequest(
            lines=[LineRequest(line.product_id, line.quantity) for line in payload.lines],
            fulfilment_mode=payload.fulfilment_mode,
            payment_method=payload.payment_method,
            customer_name=payload.customer_name,
            customer_phone=payload.customer_phone,
            delivery_address=payload.delivery_address,
            delivery_fee_xof=payload.accepted_delivery_fee_xof,
        ),
    )
    return OrderCreated(
        reference=order.reference, status=order.status, total_xof=order.total_xof, tracking_token=token
    )


@router.get("/track", response_model=OrderTracking)
def track_order(
    reference: str, token: str, session: Annotated[Session, Depends(get_session)]
) -> OrderTracking:
    order = session.scalar(select(Order).where(Order.reference == reference))
    # Réponse identique si la référence ou le jeton est faux : pas d'énumération possible
    if order is None or order.tracking_token_hash != hash_token(token):
        raise DomainError("order_not_found", "Commande introuvable.", 404)
    return OrderTracking(
        reference=order.reference,
        status=order.status,
        payment_status=order.payment_status,
        total_xof=order.total_xof,
    )
