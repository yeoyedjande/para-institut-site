# Infrastructure

- `../docker-compose.yml` (racine) : pile complète locale — site, back-office, API (migrations au démarrage), PostgreSQL
  (`docker compose up --build`). Images : `apps/web/Dockerfile`, `apps/admin/Dockerfile`, `services/api/Dockerfile`.
- `docker-compose.yml` (ce dossier) : PostgreSQL 16 seul (`pnpm db:up`), bases `para_official` et `para_official_test`.
- Cible d'hébergement : **Railway** (non déployé pendant cette mission). Trois services prévus :
  `web` (apps/web, `output: standalone`), `admin` (apps/admin, accès restreint), `api` (services/api, Dockerfile),
  plus PostgreSQL managé et un stockage S3 compatible pour la médiathèque.
- Environnements séparés : `development`, `staging` (recette, `NEXT_PUBLIC_CONTENT_MODE=demo`, noindex),
  `production` (`NEXT_PUBLIC_CONTENT_MODE=production`). Secrets uniquement dans les variables Railway.
- Détails : `docs/specifications/TECHNICAL_ARCHITECTURE.md`.
