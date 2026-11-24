# Pull Request — Fondation créative (P00–P04)

> Texte prêt à l'emploi. La PR n'a pas pu être ouverte : le dépôt ne contenait aucune branche `main` (dépôt vide).
> Pour l'ouvrir : créer `main` (par ex. depuis un commit initial vide), puis une PR `feature/creative-foundation` → `main`.

## Résumé
Prototype professionnel du site officiel Para Institut du Palm Club : monorepo, design system, page d'accueil immersive
(11 sections, scène WebGL signature), boutique, fiche produit, soins, demande de rendez-vous, back-office (coque), API
métier testée, documentation complète. Aucun fait commercial inventé ; données de démonstration isolées.

## Architecture
pnpm workspaces · `apps/web` et `apps/admin` (Next.js 16.4, React 19.3, TypeScript strict, CSS Modules) ·
`services/api` (FastAPI, SQLAlchemy 2, Alembic, PostgreSQL 16) · `packages/ui` (jetons + composants accessibles) ·
`packages/contracts` (types, provenance, statuts). CI GitHub Actions. Voir `docs/specifications/TECHNICAL_ARCHITECTURE.md`.

## Décisions artistiques
Warm Beauty Studio / « PARA — Beyond Beauty » : logo officiel en plaque turquoise, Bodoni Moda + Jost (OFL), turquoise
officiel `#009a96` dominant, ivoire et abysse, or de campagne en accent rare ; matière 3D abstraite (perle, sérum, crème,
gel, huile) ; transition « goutte qui s'ouvre » au défilement natif ; nuancier des carnations. `docs/creative/`.

## Sources utilisées
Dépôt `yeoyedjande/para-institut` (lecture seule), site `parainstitut-palmclub.com`, profils publics (extraits de
recherche). Détail : `docs/SOURCE_OF_TRUTH.md`.

## Fonctionnalités
Navigation responsive, recherche (« / »), panier local + aperçu rapide, filtres/tri, fiche produit, demande de
rendez-vous en 3 étapes transmise via WhatsApp, mode de contenu démo/production, SEO (sitemap, robots, JSON-LD vérifié),
API commandes (réservation transactionnelle du stock) et demandes de rendez-vous (contrainte anti-chevauchement).

## Captures
`docs/quality/screenshots/` — par exemple `motion-hero-1440.webp`, `motion-univers-transition-1440.webp`,
`motion-lab-huile-1440.webp`, `accueil-390x844.webp`, `boutique-360x800.webp`.

## Tests
lint ✅ · typecheck ✅ · Vitest 30 ✅ · build ✅ · Playwright 30 ✅ (2 ignorés volontairement) · ruff/mypy ✅ · pytest 12 ✅
(`docs/quality/TEST_REPORT.md`).

## Performance (Lighthouse 13.6, laboratoire)
| Page | Forme | Perf. | Access. | Bonnes pr. | LCP simulé | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | desktop | 100 | 100 | 100 | 0.7 s | 0 | 10 ms |
| `/` | mobile | 95 | 100 | 100 | 2.9 s | 0 | 100 ms |
| `/boutique` | desktop | 100 | 100 | 100 | 0.2 s | 0.007 | 20 ms |
| `/boutique` | mobile | 100 | 100 | 100 | 0.9 s | 0.001 | 90 ms |
| `/boutique/serum-hydratant-demo` | desktop | 100 | 100 | 100 | 0.7 s | 0 | 10 ms |
| `/boutique/serum-hydratant-demo` | mobile | 93 | 100 | 100 | 3.2 s | 0 | 80 ms |
| `/soins` | desktop | 100 | 100 | 100 | 0.7 s | 0.001 | 20 ms |
| `/soins` | mobile | 90 | 100 | 100 | 3.5 s | 0.001 | 120 ms |
| `/soins/reservation` | desktop | 100 | 100 | 100 | 0.2 s | 0.001 | 0 ms |
| `/soins/reservation` | mobile | 100 | 100 | 100 | 0.9 s | 0.001 | 80 ms |

SEO 69 uniquement dû au `noindex` volontaire du prototype. Conditions et limites : `docs/quality/PERFORMANCE_REPORT.md`.

## Limitations
Pas de GPU dans l'environnement (3D vérifiée en rendu logiciel forcé) ; références créatives non consultées en direct ;
pas d'appareils physiques ni de mesures terrain ; photographies authentiques absentes ; authentification, tunnel de
commande web, espace client et écrans back-office non implémentés.

## À confirmer
Horaires, affectation des numéros, prestations/tarifs, catalogue et marques, frais de livraison, mentions légales,
politique de confidentialité, réseaux sociaux, logo vectoriel — `docs/MISSING_INFORMATION.md`.

## Prochaines étapes
P05 authentification back-office → P06 catalogue administrable → P07 tunnel de commande → P08 réservations
(`docs/specifications/IMPLEMENTATION_PLAN.md`).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01Pa7DxxwqrZ2GBULVgRJgXh
