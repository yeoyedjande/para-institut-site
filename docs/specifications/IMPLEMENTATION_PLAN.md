# Plan de mise en œuvre

| Phase | Contenu | État |
|---|---|---|
| P00 | Audit, source de vérité, inventaire | ✅ 24/11/2026 |
| P01 | Monorepo, outillage, conventions, CI | ✅ |
| P02 | Direction artistique, design system, motion, 3D | ✅ |
| P03 | Accueil haute fidélité + fondations Boutique, Fiche, Prestations, Réservation | ✅ |
| P04 | Contrôle qualité, stabilisation | ✅ (voir `docs/quality`) |
| P05 | Authentification back-office (sessions, Argon2id, TOTP), RBAC, journal d'audit branché | ⏳ |
| P06 | Back-office catalogue (produits, catégories, marques, stocks, médiathèque S3) ; web branché sur l'API | ⏳ |
| P07 | Tunnel de commande (livraison/retrait, frais, CGV), suivi sans compte, back-office commandes/règlements/livraisons | ⏳ |
| P08 | Prestations détaillées, disponibilités, planning, cabines, réservations (confirmation, report, refus) | ⏳ |
| P09 | Espace client (authentification, historique) | ⏳ |
| P10 | Actualités/événements/promotions administrables, contenus, rapports | ⏳ |
| P11 | Photographies authentiques, recette, sécurité (nonces CSP, sauvegardes), préproduction Railway | ⏳ |
| P12 | Mise en production (sur décision explicite du commanditaire) | ⏳ |

Prérequis métier : `docs/MISSING_INFORMATION.md`.
