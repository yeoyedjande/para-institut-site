# Source de vérité — Para Institut du Palm Club

Dernière mise à jour : 24 novembre 2026 (P00). Toute information publiée sur le site doit figurer ici avec sa source
et son statut. Le code reflète ces statuts (`apps/web/src/content/*.ts`, type `Sourced` de `@para/contracts`).

## Statuts

| Statut | Signification | Publication en production |
|---|---|---|
| `VERIFIED` | Confirmée par une source primaire (dépôt officiel, site officiel, publication de l'établissement) | Oui |
| `HISTORICAL` | Issue d'une communication passée, pas nécessairement actuelle | Non (jamais présentée comme actuelle) |
| `TO_CONFIRM` | Plausible mais non validée par l'établissement | Non |
| `DEMO_ONLY` | Donnée de démonstration (prototype) | Jamais |

Mécanisme : `NEXT_PUBLIC_CONTENT_MODE=production` ne publie que `VERIFIED` (`isPublishable`, testé). En mode `demo`
(prototype, recette), tout est affiché mais chaque élément non vérifié porte un badge de provenance.

## Sources consultées

| Réf. | Source | Consultée le | Accès |
|---|---|---|---|
| SRC-00 | Brief du commanditaire (« Master prompt », informations issues de précédentes communications) | 24/11/2026 | Message |
| SRC-01 | Dépôt `yeoyedjande/para-institut`, commit `72ce9e3`, fichier `apps/web/public/brand/logo_para.jpg` et `docs/brand.md` | 24/11/2026 | Lecture seule (clone superficiel) |
| SRC-02 | Site événementiel `https://www.parainstitut-palmclub.com/` (pied de page et « Une question ? ») et `infra/seed/peau-noire-peau-lumineuse-2026.json` (`contact_whatsapp`) du dépôt SRC-01 | 24/11/2026 | Lecture |
| SRC-03 | Site événementiel — page de l'événement « Peau noire, peau lumineuse — Spécial fêtes » | 24/11/2026 | Lecture |
| SRC-04 | Profils publics Facebook « Para-Institut du Palm CLUB » et Instagram « Para-Institut du Palm Club » : extraits de description indexés par un moteur de recherche (« Galerie marchande du Palm Club Hotel 07 11 11 18 28 / 07 11 11 18 31 », « Abidjan ») | 24/11/2026 | Extraits de recherche (pages non ouvertes : Facebook non accessible à l'outil) |
| SRC-05 | Résultats de recherche listant les comptes Instagram `@parainstitut2plateaux`, Facebook `ParaInstitutPalmClub`, TikTok `@parainstitutpalmclub` | 24/11/2026 | Extraits de recherche |
| SRC-06 | Annuaire jaimebabi.com : « Un cadre aménagé au sein de la galerie de l'hôtel rien que pour votre bien-être » | 24/11/2026 | Métadonnées de page |
| SRC-07 | `docs/references/formulaire-inscription-DIGITCOM.docx` du dépôt SRC-01 (numéros WhatsApp de renseignement) | 24/11/2026 | Lecture |

## Informations recensées

| Information | Valeur | Source | Statut | Usage sur le site |
|---|---|---|---|---|
| Nom | Para Institut du Palm Club | SRC-00, SRC-02 (« Para-Institut du Palm Club ») | VERIFIED | Titre, JSON-LD |
| Graphie du logo | Para-Institut · PALM CLUB | SRC-01 | VERIFIED | Texte alternatif du logo |
| Activités | Institut de détente et de beauté ; parapharmacie | SRC-00, SRC-06 | VERIFIED | Accueil, institut |
| Adresse | Galerie marchande de l'Hôtel Palm Club, Abidjan, Côte d'Ivoire | SRC-00, SRC-04, SRC-06 | VERIFIED | Pied de page, JSON-LD |
| Commune / quartier | Non publié | — | TO_CONFIRM | Non affiché |
| Téléphone / WhatsApp 1 | +225 07 11 11 18 28 | SRC-02, SRC-04, SRC-07 | VERIFIED | Contact, WhatsApp |
| Téléphone / WhatsApp 2 | +225 07 11 11 18 31 | SRC-02, SRC-04, SRC-07 | VERIFIED | Contact, WhatsApp |
| Affectation des numéros (commandes, réservations, service client) | Non attribuée | SRC-00 | TO_CONFIRM | Libellé générique « Renseignements », configurable |
| Horaires A | Du lundi au samedi, 08h00 – 20h00 | SRC-00 | TO_CONFIRM | Masqués en production |
| Horaires B | Du mardi au samedi, 09h00 – 19h00 | SRC-00 | TO_CONFIRM | Masqués en production |
| Soins du visage, soins du corps, massages, spa | Familles de prestations | SRC-00 | VERIFIED | Familles seulement (aucun protocole, durée ni tarif) |
| Conseils beauté | Activité | SRC-00 | VERIFIED | Section Expertise |
| Prestations détaillées, durées, tarifs | — | — | Manquant | Non publié |
| Marques Bioderma, Filorga, Biocyte | Citées dans de précédentes communications | SRC-00 | TO_CONFIRM | Badges « À confirmer », masquées en production |
| Instagram | `@parainstitut2plateaux` | SRC-04, SRC-05 | TO_CONFIRM (propriété à confirmer) | Masqué en production |
| Facebook | `ParaInstitutPalmClub` | SRC-04, SRC-05 | TO_CONFIRM | Masqué en production |
| TikTok | `@parainstitutpalmclub` | SRC-05 | TO_CONFIRM | Masqué en production |
| Événement « Peau noire, peau lumineuse — Spécial fêtes » | Hôtel Mirambeau, Lomé, 5–7 décembre 2026 | SRC-03 | VERIFIED (avec date de fin) | Actualités ; retiré automatiquement après le 7/12/2026 |
| Couleur turquoise du logo | `#009a96` | SRC-01 | VERIFIED | Couleur primaire |
| Argent du monogramme | `#c6c6c6` | SRC-01 | VERIFIED | Couleur secondaire |
| Or et crème | `#e2c27f`, `#fbf6ea` | SRC-01 (affiche de campagne) | HISTORICAL (campagne) | Accent parcimonieux, à valider |
| Catalogue (produits, catégories, prix) | Fictif | — | DEMO_ONLY | Prototype uniquement |
| Actualités « Exemple de conseil », « Exemple de nouveauté » | Emplacements | — | DEMO_ONLY | Prototype uniquement |
| Texte institutionnel | Proposition éditoriale du brief | SRC-00 | VERIFIED (validé comme base) | Page « Notre institut » |

## Informations écartées volontairement

| Information | Raison |
|---|---|
| Numéros de paiement Moov Money / Wave du site événementiel | Spécifiques au paiement de l'événement ; aucun paiement en ligne en V1 |
| Tarif « consultation seule 15 000 FCFA », billet 50 000 FCFA | Tarifs de l'événement, sans rapport avec les prestations de l'institut |
| Photographies de campagne comme visuels permanents | Spécifiques à l'événement (Lomé) ; utilisées uniquement dans l'actualité correspondante, légendées « Visuel de campagne » |
| Avis, notes, témoignages (TikTok, annuaires) | Non vérifiables et interdits sans accord ; aucune donnée structurée d'avis |

## Contradictions et points d'attention

1. **Graphie du nom** : « Para Institut du Palm Club » (brief), « Para-Institut du Palm Club » (site, réseaux), « Para-Institut
   Palm Club » (logo). Le site utilise la forme du brief dans les textes et la forme du logo dans son alternative. À trancher.
2. **Horaires** : deux plages différentes sans affectation (institut ou parapharmacie ?). Non publiées.
3. **Identifiant Instagram** `parainstitut2plateaux` : suggère un quartier (Deux-Plateaux) non mentionné ailleurs ; aucune
   commune n'est publiée tant qu'elle n'est pas confirmée.
4. **Statut juridique** : raison sociale, RCCM, responsable de publication inconnus (mentions légales incomplètes).
