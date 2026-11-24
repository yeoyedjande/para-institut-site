from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, Timestamped

ORDER_STATUSES = (
    "PENDING_CONFIRMATION",
    "CONFIRMED",
    "PREPARING",
    "READY_FOR_PICKUP",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELLED",
)
PAYMENT_STATUSES = ("UNPAID", "PAID", "PARTIALLY_REFUNDED", "REFUNDED")
FULFILMENT_MODES = ("DELIVERY_ABIDJAN", "PICKUP_INSTITUTE")
PAYMENT_METHODS = ("CASH_ON_DELIVERY", "PAY_AT_PICKUP")


class Order(Timestamped, Base):
    """Commande. Statut de commande et statut de règlement indépendants ; prix et frais figés."""

    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    reference: Mapped[str] = mapped_column(String(24), unique=True)
    # Jeton de suivi sans compte : seule son empreinte est stockée
    tracking_token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    status: Mapped[str] = mapped_column(String(24), default="PENDING_CONFIRMATION")
    payment_status: Mapped[str] = mapped_column(String(24), default="UNPAID")
    fulfilment_mode: Mapped[str] = mapped_column(String(24))
    payment_method: Mapped[str] = mapped_column(String(24))
    customer_name: Mapped[str] = mapped_column(String(120))
    customer_phone: Mapped[str] = mapped_column(String(24))
    delivery_address: Mapped[str | None] = mapped_column(Text)
    subtotal_xof: Mapped[int] = mapped_column(Integer)
    delivery_fee_xof: Mapped[int] = mapped_column(Integer, default=0)
    total_xof: Mapped[int] = mapped_column(Integer)
    lines: Mapped[list["OrderLine"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    events: Mapped[list["OrderEvent"]] = relationship(
        back_populates="order", cascade="all, delete-orphan", order_by="OrderEvent.id"
    )

    __table_args__ = (
        CheckConstraint(f"status IN {ORDER_STATUSES}", name="status"),
        CheckConstraint(f"payment_status IN {PAYMENT_STATUSES}", name="payment_status"),
        CheckConstraint(f"fulfilment_mode IN {FULFILMENT_MODES}", name="fulfilment_mode"),
        CheckConstraint(f"payment_method IN {PAYMENT_METHODS}", name="payment_method"),
        CheckConstraint("total_xof = subtotal_xof + delivery_fee_xof", name="total_consistent"),
        CheckConstraint(
            "fulfilment_mode <> 'DELIVERY_ABIDJAN' OR delivery_address IS NOT NULL", name="delivery_address"
        ),
    )


class OrderLine(Base):
    __tablename__ = "order_lines"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    product_name: Mapped[str] = mapped_column(String(200))  # instantané
    unit_price_xof: Mapped[int] = mapped_column(Integer)  # instantané
    quantity: Mapped[int] = mapped_column(Integer)
    order: Mapped[Order] = relationship(back_populates="lines")
    __table_args__ = (CheckConstraint("quantity > 0 AND quantity <= 50", name="quantity"),)


class OrderEvent(Base):
    """Historique des opérations sur la commande (append-only)."""

    __tablename__ = "order_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"))
    kind: Mapped[str] = mapped_column(String(40))
    from_status: Mapped[str | None] = mapped_column(String(24))
    to_status: Mapped[str | None] = mapped_column(String(24))
    actor: Mapped[str] = mapped_column(String(120))
    data: Mapped[dict[str, object]] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    order: Mapped[Order] = relationship(back_populates="events")
