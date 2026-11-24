# Règles métier V1

## Boutique (e-commerce hybride)
1. Catalogue saisi **manuellement** en back-office (aucun import CSV/Excel en V1).
2. Commande **sans compte obligatoire** ; suivi sécurisé par référence opaque (`PI-XXXXXXXX`) + jeton (seule l'empreinte
   SHA-256 est stockée ; réponse identique en cas d'erreur de référence ou de jeton).
3. Modes : **livraison à Abidjan** (règlement à la livraison) ou **retrait à l'institut** (règlement au retrait). Toute
   autre combinaison est refusée.
4. Une commande est créée **en attente de confirmation** (`PENDING_CONFIRMATION`) ; confirmation **manuelle** par l'équipe.
5. **Réservation transactionnelle** des quantités à la création : verrou `SELECT … FOR UPDATE` des produits (ordre stable
   par identifiant, pas d'interblocage), contrôle `stock_on_hand - stock_reserved ≥ quantité`. Contrainte de base :
   `0 ≤ stock_reserved ≤ stock_on_hand`. Testé en concurrence : 10 achats simultanés pour 3 articles → 3 commandes.
6. La **confirmation** revérifie le stock ; l'**annulation** libère les quantités réservées ; la **remise** (COMPLETED)
   décrémente le stock physique et la réservation.
7. **Prix, noms et frais figés** dans la commande (`order_lines.unit_price_xof`, `product_name`, `orders.delivery_fee_xof`).
   Contrainte : `total = sous-total + frais`.
8. **Statut de règlement indépendant** (`UNPAID`, `PAID`, `PARTIALLY_REFUNDED`, `REFUNDED`) ; impossible d'enregistrer un
   règlement sur une commande annulée.
9. **Historique** append-only (`order_events`) : création, changements de statut (auteur, motif), règlement.
10. Frais de livraison **configurables** et communiqués avant engagement définitif (la cliente accepte un montant
    explicite `accepted_delivery_fee_xof`). Aucun montant n'est inventé.
11. Cycle de vie : `PENDING_CONFIRMATION → CONFIRMED → PREPARING → READY_FOR_PICKUP | OUT_FOR_DELIVERY → COMPLETED`,
    annulation possible jusqu'à la remise. Transitions vérifiées côté API et partagées (`@para/contracts`).
12. Architecture de paiement extensible (Mobile Money, carte) : `payment_method` énuméré, aucun paiement en ligne en V1,
    **aucun faux paiement**.

## Réservation de soins
1. Une **demande** (`REQUESTED`) n'est jamais un rendez-vous confirmé ; le site le dit à chaque étape.
2. Décisions manuelles : confirmer, refuser, reporter, annuler ; présence (`COMPLETED`, `NO_SHOW`).
3. **Prévention des doubles réservations** par contrainte d'exclusion PostgreSQL (`btree_gist`) : pas deux rendez-vous
   actifs qui se chevauchent sur la même cabine (testé). Un rendez-vous annulé libère le créneau.
4. Aucun acompte en V1. Demande sans compte, consentement explicite au recontact, aucune donnée médicale demandée.
5. Prototype actuel : la demande est préparée sur le site puis **envoyée par la cliente sur WhatsApp** (rien n'est stocké) ;
   l'API `POST /api/v1/booking-requests` est prête pour la bascule.

## Contenus
1. Une actualité possède une date de fin ; une fois passée, elle n'est plus présentée comme actuelle (`isCurrent`,
   régénération horaire des pages).
2. Une promotion passée n'est jamais affichée comme actuelle.
3. Seules les informations VERIFIED sont publiées en production (`docs/SOURCE_OF_TRUTH.md`).
