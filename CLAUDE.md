# CLAUDE.md — Para Institut du Palm Club (site officiel)

Lire ce fichier, puis `docs/PROJECT_STATUS.md` et `docs/SOURCE_OF_TRUTH.md`, avant toute modification.

## Mission
Site officiel de Para Institut du Palm Club (institut de détente et de beauté + parapharmacie, galerie marchande de
l'Hôtel Palm Club, Abidjan) : vitrine, e-commerce hybride, réservation de soins, espace client, back-office. Niveau
d'exigence : studio digital premium (direction artistique, performance, accessibilité, sécurité, authenticité).

## Règle fondamentale : aucune invention
Ne jamais inventer : histoire, date de création, certifications, récompenses, qualifications, avis, témoignages,
statistiques, produits, tarifs, promotions, partenariats, coordonnées, résultats médicaux/dermatologiques.
- Toute information publiée figure dans `docs/SOURCE_OF_TRUTH.md` avec sa source et un statut
  `VERIFIED | HISTORICAL | TO_CONFIRM | DEMO_ONLY`, et dans le code via `Sourced`/`status` (`apps/web/src/content`).
- En production (`NEXT_PUBLIC_CONTENT_MODE=production`) seul `VERIFIED` est publié ; ne pas contourner `publishable()`.
- Données de démonstration : isolées (`status: "DEMO_ONLY"`), badgées, jamais en production.
- Une campagne passée n'est jamais présentée comme actuelle (`endsAt` + `isCurrent`).
- Pas de données structurées d'avis ou de notes. Pas de faux paiement. Une demande n'est jamais un rendez-vous confirmé.

## Faits vérifiés (résumé)
Nom « Para Institut du Palm Club » ; adresse « Galerie marchande de l'Hôtel Palm Club, Abidjan » ; WhatsApp
+225 07 11 11 18 28 et +225 07 11 11 18 31 (affectation à configurer) ; familles : soins du visage, du corps, massages,
spa, conseils beauté ; turquoise du logo `#009a96`, argent `#c6c6c6`. Horaires, marques (Bioderma, Filorga, Biocyte)
et réseaux sociaux : **TO_CONFIRM**. Manques : `docs/MISSING_INFORMATION.md`.

## Marque
- Logo : `apps/web/public/brand/logo_para.jpg` (MD5 `bda63771f7b1fb990091a1279d844af3`), jamais modifié, recoloré,
  déformé ni recréé ; toujours sur turquoise (« plaque »). Composant `BrandLogo`.
- Direction artistique : Warm Beauty Studio, concept interne « PARA — Beyond Beauty » (pas un slogan public).
- Typo : Bodoni Moda (titres) + Jost (interface), OFL, auto-hébergées (`public/fonts`). Pas de police distante.
- Couleurs : `packages/ui/src/tokens.css` + `docs/brand/OFFICIAL_COLORS.md`. Contraste AA obligatoire ; jamais de petit
  texte blanc sur `#009a96`.
- Visuels 3D : abstraits (matières), jamais un produit ou une gamme inventée. Photos : authentiques ou libres de droits
  documentés (`docs/creative/ASSET_INVENTORY.md`), mise en valeur des peaux noires et de toutes les carnations.

## Architecture
pnpm workspaces : `apps/web`, `apps/admin` (Next.js 16.4, React 19.3, TS strict), `services/api` (FastAPI, SQLAlchemy 2,
Alembic, PostgreSQL 16), `packages/ui`, `packages/contracts`. CSS Modules + jetons (pas de Tailwind/kit générique).
Three.js brut pour la scène « matière » (`apps/web/src/components/matter`). Animations : CSS + IntersectionObserver
(pas de GSAP, pas de défilement détourné). Détails : `docs/specifications/TECHNICAL_ARCHITECTURE.md`.

## Règles métier
`docs/business/BUSINESS_RULES.md` (référence). Commandes : en attente de confirmation, réservation transactionnelle
(FOR UPDATE, ordre stable), annulation = libération, prix/frais figés, règlement indépendant, historique, livraison
Abidjan (règlement à la livraison) ou retrait (règlement au retrait), aucun paiement en ligne en V1. Réservations :
demande ≠ rendez-vous, confirmation manuelle, contrainte d'exclusion anti-chevauchement par cabine.

## Exigences qualité (non négociables)
- Avant de conclure : `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e` ;
  API : `uv run ruff check . && uv run ruff format --check . && uv run mypy && uv run pytest`.
- Mobile d'abord (360 px), aucun débordement horizontal, cibles ≥ 44 px, `prefers-reduced-motion` respecté, alternative
  sans WebGL, LCP jamais bloqué par une animation, Lighthouse ≥ 90 (conditions dans `docs/quality/PERFORMANCE_REPORT.md`).
- WCAG 2.2 AA visé, navigation clavier, focus visible, textes alternatifs.
- Sécurité : aucun secret dans Git, validation serveur, CSP sans ressource tierce, aucun compte admin par défaut.
- Ne jamais prétendre avoir exécuté un test non exécuté ; documenter les limites.

## Conventions
Français pour l'interface, les commentaires et la documentation. Montants en FCFA entiers (`formatXof`). Numéros en
E.164. Commits explicites en français. Pas de déploiement en production, de dépense, de modification du dépôt
événementiel `yeoyedjande/para-institut` (lecture seule) sans accord explicite.

## Outils de contrôle
- `apps/web/scripts/render-posters.mjs` : régénère les visuels de repli 3D (serveur de dev requis).
- `apps/web/scripts/qa-screenshots.mjs` : captures QA 6 résolutions + animations (build de production sur :3100).
- `/design-system` : référence vivante, développement uniquement. `?webgl=0` / `?webgl=force` pour tester la 3D.
