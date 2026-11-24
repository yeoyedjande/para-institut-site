# Para Institut du Palm Club — site officiel

Site vitrine, boutique (parapharmacie), réservation de soins, espace client et back-office de **Para Institut du Palm
Club** — institut de détente et de beauté et parapharmacie, galerie marchande de l'Hôtel Palm Club, Abidjan.

> État : **prototype créatif** (phases P00–P04). Les produits et prix affichés sont des **données de démonstration**,
> signalées comme telles et absentes en mode production. Aucun déploiement public n'a été effectué.

## Structure
```
apps/web          Site public — Next.js 16 (App Router, TypeScript strict), Three.js
apps/admin        Back-office — Next.js 16 (coque, 22 modules)
services/api      API métier — FastAPI, SQLAlchemy 2, Alembic, PostgreSQL
packages/ui       Design tokens et composants accessibles (@para/ui)
packages/contracts Types, schémas, provenance des informations (@para/contracts)
assets/           Ressources officielles d'origine
docs/             Documentation (source de vérité, charte, spécifications, qualité)
infra/            PostgreSQL local (docker compose), notes d'hébergement
```

## Prérequis
Node.js ≥ 22, pnpm 10 (`corepack enable`), Python ≥ 3.12 et [uv](https://docs.astral.sh/uv/), PostgreSQL 16
(ou Docker).

## Démarrage
```bash
pnpm install
pnpm dev                     # site public → http://localhost:3000
pnpm dev:admin               # back-office → http://localhost:3001
```
API (facultative pour le prototype web) :
```bash
pnpm db:up                   # PostgreSQL local (docker compose)
cd services/api && cp .env.example .env && uv sync && uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000   # http://localhost:8000/docs
```

## Qualité
```bash
pnpm lint && pnpm typecheck && pnpm test     # ESLint, TypeScript, Vitest
pnpm build                                    # web + admin
pnpm test:e2e                                 # Playwright (build de production)
cd services/api && uv run ruff check . && uv run mypy && uv run pytest
```

## Mode de contenu
`NEXT_PUBLIC_CONTENT_MODE=demo` (défaut) : tout est affiché, données non vérifiées badgées, site `noindex`.
`NEXT_PUBLIC_CONTENT_MODE=production` : seules les informations `VERIFIED` sont publiées (`docs/SOURCE_OF_TRUTH.md`).

## Documentation
Commencer par `CLAUDE.md`, `docs/PROJECT_STATUS.md` et `docs/SOURCE_OF_TRUTH.md`.
