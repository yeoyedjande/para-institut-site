# Rapport de tests

Date : 24/11/2026. Toutes les commandes ci-dessous ont été exécutées dans l'environnement de développement.

| Commande | Portée | Résultat |
|---|---|---|
| `pnpm lint` | ESLint (web, admin, ui, contracts) | ✅ 0 erreur, 0 avertissement |
| `pnpm typecheck` | TypeScript strict (4 paquets) | ✅ |
| `pnpm test` | Vitest : contracts 6, ui 3, admin 3, web 18 | ✅ **30 tests** |
| `pnpm build` | Next.js web (28 routes) et admin | ✅ |
| `pnpm test:e2e` | Playwright, build de production, projets « desktop » (1440×900) et « mobile » (Pixel 7) | ✅ **30 réussis** (v2 incluse), 2 ignorés volontairement (tests clavier sur ordinateur uniquement) |
| `uv run ruff check . && ruff format --check .` | API | ✅ |
| `uv run mypy` | API, mode strict | ✅ 23 fichiers |
| `uv run pytest` | API sur PostgreSQL 16 réel | ✅ **12 tests** |
| `alembic upgrade head / downgrade base / upgrade head` | Migration 0001 | ✅ |

## Ce que couvrent les tests
- **Contrats** : publication selon la provenance, format FCFA, transitions de commande, actualité expirée.
- **Contenus** : aucune donnée de démonstration en production, numéros vérifiés au format E.164, horaires et réseaux non
  confirmés masqués.
- **Composants** : champ accessible (libellé, aide, erreur), badges.
- **Boutique** : filtres, tri, recherche sans accents ; **réservation** : validation, message « à confirmer ».
- **Bout en bout** : accueil sans erreur console, absence de débordement (360–1024), numéros WhatsApp, repli sans WebGL,
  scène 3D voyageuse (forcée ; sur mobile, démarrage au premier geste), rendu logiciel → statique, « moins d'animations » (ni défilement fluide, ni épinglage, ni 3D), lien d'évitement, onglets clavier, panier,
  filtres, fiche produit, recherche, demande de rendez-vous jusqu'au lien WhatsApp, design system en 404, pages
  principales.
- **API** : réservation et libération du stock, stock insuffisant, prix figés, transitions interdites, règlement
  indépendant, adresse de livraison obligatoire, **concurrence** (10 achats simultanés / stock 3 → 3), contrainte
  anti-double réservation, suivi par jeton, limitation de cohérence livraison/règlement.

## Non testé
Navigateurs Safari/Firefox, appareils physiques, lecteurs d'écran réels (NVDA, VoiceOver), GPU matériel, charge.
