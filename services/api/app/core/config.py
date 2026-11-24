from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuration par variables d'environnement (aucun secret dans le dépôt)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: Literal["development", "test", "staging", "production"] = "development"
    database_url: str = "postgresql+psycopg://para:para_dev@localhost:5432/para_official"
    secret_key: str = Field(default="dev-only-not-a-secret", min_length=16)
    cors_origins: str = "http://localhost:3000,http://localhost:3001"
    # Limitation de débit des points d'entrée publics (requêtes par minute et par adresse IP)
    public_rate_limit_per_minute: int = 30

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    def assert_safe_for_production(self) -> None:
        if self.environment == "production" and self.secret_key.startswith("dev-only"):
            raise RuntimeError("SECRET_KEY doit être défini en production.")


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.assert_safe_for_production()
    return settings
