# Architecture technique

```
para-institut-site/
├── apps/
│   ├── web/        Next.js 16.4 (App Router, TypeScript strict) — site public
│   └── admin/      Next.js 16.4 — back-office (coque)
├── services/
│   └── api/        FastAPI 0.165 · SQLAlchemy 2.0 · Alembic 1.20 · PostgreSQL 16 · Pydantic 2.14
├── packages/
│   ├── ui/         Design tokens + composants React accessibles (@para/ui)
│   └── contracts/  Types, schémas zod, provenance, statuts, montants XOF (@para/contracts)
├── assets/         Ressources officielles d'origine (logo, visuels de campagne)
├── docs/           Documentation (ce dossier)
├── infra/          docker-compose PostgreSQL, notes Railway
└── .github/workflows/ci.yml
```

## Choix et versions (vérifiées le 24/11/2026)
| Domaine | Choix | Raison |
|---|---|---|
| Gestionnaire | pnpm 10.28 workspaces | Monorepo léger, sans orchestrateur supplémentaire (pas de Turborepo : inutile à cette taille) |
| Front | Next.js 16.4.6, React 19.3.1 | Versions éprouvées par le dépôt événementiel ; rendu serveur, ISR, `output: standalone` (Railway) |
| Styles | CSS Modules + jetons CSS | Identité sur mesure sans gabarit ; pas de Tailwind ni de kit d'interface générique |
| 3D | three 0.187 (sans R3F/Drei) | Une scène unique ; poids et contrôle |
| Animation | GSAP 3.15 + ScrollTrigger, Lenis 1.3 (v2, 24/11/2026) | Expérience « waouh » demandée : épinglage, horizontal, chorégraphies ; tactile natif, désactivé sous `prefers-reduced-motion` |
| Validation | zod 4 (contrats), Pydantic 2 (API) | Validation serveur systématique |
| Tests | Vitest 5, Testing Library, Playwright 1.63, pytest 9 | Unitaires, composants, bout en bout, intégration PostgreSQL |
| Qualité Python | ruff, mypy strict | — |
| TypeScript | 5.9 (strict, `noUncheckedIndexedAccess`) | TS 7 écarté (compatibilité de l'outillage ESLint) |

## Séparation des responsabilités (web)
- `src/content/` : données et faits sourcés (statut de provenance) — remplacés à terme par l'API.
- `src/components/` : composants visuels par domaine (`home`, `shop`, `booking`, `matter`, `layout`, `motion`, `page`).
- `src/lib/` : configuration (mode de contenu), index de recherche, données structurées.
- `src/app/` : routes, métadonnées.

## API
Monolithe modulaire `app/modules/{catalog,orders,booking,audit}` : modèles, services (règles métier transactionnelles),
routeurs (`/api/v1`). Erreurs structurées `{error:{code,message}}`, documentation OpenAPI désactivée en production,
CORS restreint, en-têtes de sécurité, limitation de débit (mémoire, à externaliser en multi-instance). Migration
`0001` réversible (testée montée/descente/remontée).

## Sécurité
- CSP stricte (aucune ressource tierce : polices et images auto-hébergées), `frame-ancestors 'none'`, HSTS en production,
  `nosniff`, `Referrer-Policy`, `Permissions-Policy`. `unsafe-inline` des scripts à remplacer par des nonces.
- Aucun secret dans Git (`.env.example` sans valeur réelle) ; refus de démarrer en production avec la clé de dev.
- Validation serveur Pydantic ; requêtes paramétrées (ORM) ; jetons de suivi hachés ; références opaques.
- Données personnelles : minimisation (prénom, téléphone), aucune donnée médicale, consentement explicite ; panier local.
- Back-office : `noindex`, `X-Frame-Options: DENY` ; authentification et RBAC à implémenter avant toute donnée.
- Sauvegardes, rétention, séparation des environnements : `infra/README.md` (à mettre en œuvre lors du déploiement).

## Hébergement cible (non déployé)
Railway : services `web`, `admin`, `api`, PostgreSQL managé, stockage S3 compatible (médiathèque). CI GitHub Actions
(lint, types, tests, build, e2e, pytest sur PostgreSQL).
