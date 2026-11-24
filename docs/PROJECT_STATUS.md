# État du projet

Mis à jour : 24 novembre 2026 — fin de la mission P00–P04.

| Phase | État | Détails |
|---|---|---|
| P00 Audit | ✅ | `SOURCE_OF_TRUTH.md`, `MISSING_INFORMATION.md`, `creative/ASSET_INVENTORY.md` |
| P01 Fondations | ✅ | Monorepo pnpm, Next.js ×2, FastAPI, paquets partagés, CI |
| P02 Direction artistique | ✅ | `brand/*`, `creative/*` |
| P03 Prototype | ✅ | Accueil 11 sections, boutique, fiche, soins, réservation, pages institutionnelles, back-office (coque) |
| P04 Qualité | ✅ | `quality/*` : 30 tests unitaires, 30 e2e, 12 API, Lighthouse ≥ 90 |

## Fonctionnel vs prototype
- **Fonctionnel** : navigation, recherche, panier local, filtres, fiche produit, demande de rendez-vous transmise par
  WhatsApp, mode de contenu (démo / production), API commandes et réservations (non branchée au site).
- **Démonstration** : catalogue (produits, prix, catégories), deux actualités d'exemple — badgés, absents en production.
- **Non implémenté** : authentification, tunnel de commande web, espace client, écrans du back-office, médiathèque S3.

## Dépôt événementiel
Consulté en lecture seule (clone superficiel). Aucune modification, aucun déploiement déclenché.

## Prochaine étape recommandée
Collecter M1–M8 (`MISSING_INFORMATION.md`), puis P05 (authentification back-office) et P06 (catalogue administrable).
