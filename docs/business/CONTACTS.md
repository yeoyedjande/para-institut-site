# Coordonnées

| Canal | Valeur | Statut | Affectation |
|---|---|---|---|
| WhatsApp / téléphone | +225 07 11 11 18 28 (`+2250711111828`) | VERIFIED (SRC-02, SRC-04, SRC-07) | « Renseignements » — à affecter (M2) |
| WhatsApp / téléphone | +225 07 11 11 18 31 (`+2250711111831`) | VERIFIED | idem |
| Adresse | Galerie marchande de l'Hôtel Palm Club, Abidjan | VERIFIED | Pied de page, JSON-LD |
| E-mail | — | Inconnu | Non publié |
| Instagram `@parainstitut2plateaux` | TO_CONFIRM | SRC-04/05 | Masqué en production |
| Facebook `ParaInstitutPalmClub` | TO_CONFIRM | SRC-04/05 | Masqué en production |
| TikTok `@parainstitutpalmclub` | TO_CONFIRM | SRC-05 | Masqué en production |

Les numéros sont stockés en E.164 dans `apps/web/src/content/establishment.ts` ; leur affectation aux commandes, aux
réservations et au service client sera un paramètre du back-office (module Paramètres), jamais codée en dur côté API.
