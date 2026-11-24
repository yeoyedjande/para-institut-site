"""Point d'import unique des modèles (Alembic et tests)."""

from app.db.base import Base
from app.modules.audit.models import AuditLog
from app.modules.booking.models import Appointment, BookingRequest, Resource
from app.modules.catalog.models import Brand, Category, Product, ServiceItem
from app.modules.orders.models import Order, OrderEvent, OrderLine

__all__ = [
    "Appointment",
    "AuditLog",
    "Base",
    "BookingRequest",
    "Brand",
    "Category",
    "Order",
    "OrderEvent",
    "OrderLine",
    "Product",
    "Resource",
    "ServiceItem",
]
