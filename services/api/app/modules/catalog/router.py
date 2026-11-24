from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_session
from app.modules.catalog.models import Brand, Category, Product, ServiceItem

router = APIRouter(prefix="/catalog", tags=["catalogue"])
SessionDep = Annotated[Session, Depends(get_session)]


def _visible_statuses() -> tuple[str, ...]:
    # En production, seules les informations vérifiées sont servies (docs/SOURCE_OF_TRUTH.md)
    return (
        ("VERIFIED",)
        if get_settings().environment == "production"
        else ("VERIFIED", "DEMO_ONLY", "TO_CONFIRM", "HISTORICAL")
    )


class ProductOut(BaseModel):
    slug: str
    name: str
    category: str
    brand: str | None
    price_xof: int | None
    availability: str
    status: str


class NamedOut(BaseModel):
    slug: str
    name: str
    status: str


class ServiceOut(BaseModel):
    slug: str
    family: str
    name: str
    summary: str
    duration_minutes: int | None
    price_xof: int | None


def availability(product: Product) -> str:
    if product.available <= 0:
        return "OUT_OF_STOCK"
    return "LOW_STOCK" if product.available <= 3 else "IN_STOCK"


@router.get("/products", response_model=list[ProductOut])
def list_products(session: SessionDep) -> list[ProductOut]:
    rows = session.execute(
        select(Product, Category.name, Brand.name)
        .join(Category, Category.id == Product.category_id)
        .outerjoin(Brand, Brand.id == Product.brand_id)
        .where(Product.is_published, Product.status.in_(_visible_statuses()))
        .order_by(Product.name)
    ).all()
    return [
        ProductOut(
            slug=p.slug,
            name=p.name,
            category=c,
            brand=b,
            price_xof=p.price_xof,
            availability=availability(p),
            status=p.status,
        )
        for p, c, b in rows
    ]


@router.get("/categories", response_model=list[NamedOut])
def list_categories(session: SessionDep) -> list[NamedOut]:
    rows = session.scalars(
        select(Category).where(Category.status.in_(_visible_statuses())).order_by(Category.name)
    )
    return [NamedOut(slug=c.slug, name=c.name, status=c.status) for c in rows]


@router.get("/brands", response_model=list[NamedOut])
def list_brands(session: SessionDep) -> list[NamedOut]:
    rows = session.scalars(select(Brand).where(Brand.status.in_(_visible_statuses())).order_by(Brand.name))
    return [NamedOut(slug=b.slug, name=b.name, status=b.status) for b in rows]


@router.get("/services", response_model=list[ServiceOut])
def list_services(session: SessionDep) -> list[ServiceOut]:
    rows = session.scalars(
        select(ServiceItem)
        .where(ServiceItem.is_published, ServiceItem.status.in_(_visible_statuses()))
        .order_by(ServiceItem.family, ServiceItem.name)
    )
    return [
        ServiceOut(
            slug=s.slug,
            family=s.family,
            name=s.name,
            summary=s.summary,
            duration_minutes=s.duration_minutes,
            price_xof=s.price_xof,
        )
        for s in rows
    ]
