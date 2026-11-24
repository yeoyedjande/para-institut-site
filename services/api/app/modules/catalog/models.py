from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, Timestamped

# Statut de provenance (docs/SOURCE_OF_TRUTH.md). Seul VERIFIED est servi par l'API publique en production.
SOURCE_STATUSES = ("VERIFIED", "HISTORICAL", "TO_CONFIRM", "DEMO_ONLY")


class Brand(Timestamped, Base):
    __tablename__ = "brands"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(16), default="TO_CONFIRM")
    __table_args__ = (CheckConstraint(f"status IN {SOURCE_STATUSES}", name="status"),)


class Category(Timestamped, Base):
    __tablename__ = "categories"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(16), default="TO_CONFIRM")
    __table_args__ = (CheckConstraint(f"status IN {SOURCE_STATUSES}", name="status"),)


class Product(Timestamped, Base):
    """Produit saisi manuellement en back-office. Stock : physique et réservé (commandes en attente)."""

    __tablename__ = "products"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True)
    name: Mapped[str] = mapped_column(String(200))
    brand_id: Mapped[int | None] = mapped_column(ForeignKey("brands.id"))
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    description: Mapped[str] = mapped_column(Text, default="")
    price_xof: Mapped[int | None] = mapped_column(Integer)
    stock_on_hand: Mapped[int] = mapped_column(Integer, default=0)
    stock_reserved: Mapped[int] = mapped_column(Integer, default=0)
    is_published: Mapped[bool] = mapped_column(default=False)
    status: Mapped[str] = mapped_column(String(16), default="TO_CONFIRM")

    __table_args__ = (
        CheckConstraint(f"status IN {SOURCE_STATUSES}", name="status"),
        CheckConstraint("price_xof IS NULL OR price_xof >= 0", name="price_positive"),
        CheckConstraint("stock_on_hand >= 0", name="stock_on_hand_positive"),
        # La base garantit qu'on ne réserve jamais plus que le stock physique
        CheckConstraint(
            "stock_reserved >= 0 AND stock_reserved <= stock_on_hand", name="stock_reserved_bounds"
        ),
    )

    @property
    def available(self) -> int:
        return self.stock_on_hand - self.stock_reserved


class ServiceItem(Timestamped, Base):
    """Prestation de l'institut. Durée et tarif nuls tant que non communiqués par l'institut."""

    __tablename__ = "services"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True)
    family: Mapped[str] = mapped_column(String(16))
    name: Mapped[str] = mapped_column(String(200))
    summary: Mapped[str] = mapped_column(Text, default="")
    duration_minutes: Mapped[int | None] = mapped_column(Integer)
    price_xof: Mapped[int | None] = mapped_column(Integer)
    is_published: Mapped[bool] = mapped_column(default=False)
    status: Mapped[str] = mapped_column(String(16), default="TO_CONFIRM")
    __table_args__ = (
        CheckConstraint("family IN ('visage','corps','massages','spa')", name="family"),
        CheckConstraint(f"status IN {SOURCE_STATUSES}", name="status"),
    )
