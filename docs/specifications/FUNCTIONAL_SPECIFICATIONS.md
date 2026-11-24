# Spécifications fonctionnelles — V1

Légende : ✅ réalisé dans le prototype · 🟡 fondation (interface ou API prête, non branchée) · ⏳ à faire.

## Site vitrine
| Fonction | État |
|---|---|
| Accueil narratif (11 sections) | ✅ |
| Notre institut, Prestations, Actualités et événements, Contact | ✅ (contenus limités aux informations vérifiées) |
| Mentions légales, Données personnelles | 🟡 (à compléter : M7, M8) |
| SEO : métadonnées, Open Graph, sitemap, robots, canoniques, JSON-LD `HealthAndBeautyBusiness` | ✅ (indexation coupée hors production) |

## E-commerce hybride
| Fonction | État |
|---|---|
| Catalogue, catégories, recherche, filtres (catégorie, disponibilité), tri | ✅ sur données de démonstration |
| Marques | 🟡 (section + modèle ; données TO_CONFIRM) |
| Fiche produit (quantité, disponibilité, modes de retrait, détails) | ✅ démo |
| Panier (local, aperçu rapide, tiroir) | ✅ prototype (aucune donnée transmise) |
| Commande sans compte, livraison Abidjan / retrait, règlement à la livraison / au retrait | 🟡 API `POST /api/v1/orders` + règles + tests ; tunnel web ⏳ |
| Confirmation manuelle, gestion des stocks, réservation transactionnelle, annulation | 🟡 service `orders` testé ; écrans back-office ⏳ |
| Suivi de commande sans compte | 🟡 API `GET /api/v1/orders/track` ; page ⏳ |
| Paiement en ligne | Hors V1 (architecture extensible) |

## Réservation de soins
| Fonction | État |
|---|---|
| Catalogue de prestations (familles) | ✅ ; détails ⏳ (M3) |
| Demande en 3 étapes sans compte, validation, transmission WhatsApp | ✅ |
| API de demande (`REQUESTED`) | 🟡 |
| Disponibilités, créneaux, cabines, planning, prévention des doubles réservations | 🟡 modèle + contrainte testée ; écrans ⏳ (M4) |
| Confirmer / refuser / reporter / annuler | ⏳ back-office |

## Espace client
Authentification, profil, historique et suivi des commandes et réservations, coordonnées : ⏳ (page d'attente honnête).

## Back-office
22 modules navigables avec périmètre et permission (`apps/admin`) : 🟡 coque. Authentification (sessions, Argon2id,
double authentification, aucun compte par défaut) : ⏳ prioritaire avant toute donnée réelle.
