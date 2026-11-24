from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.errors import DomainError, domain_error_handler
from app.modules.booking.router import router as booking_router
from app.modules.catalog.router import router as catalog_router
from app.modules.orders.router import router as orders_router


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="API Para Institut du Palm Club",
        version="0.1.0",
        docs_url="/docs" if settings.environment != "production" else None,
        openapi_url="/openapi.json" if settings.environment != "production" else None,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        allow_credentials=False,
    )
    app.add_exception_handler(DomainError, domain_error_handler)

    @app.middleware("http")
    async def security_headers(
        request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["Cache-Control"] = response.headers.get("Cache-Control", "no-store")
        return response

    @app.get("/health", tags=["exploitation"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    for router in (catalog_router, booking_router, orders_router):
        app.include_router(router, prefix="/api/v1")
    return app


app = create_app()
