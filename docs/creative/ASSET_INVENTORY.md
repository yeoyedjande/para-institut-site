# Inventaire des ressources graphiques

| Ressource | Emplacement | Source | Licence / droits | Usage |
|---|---|---|---|---|
| Logo officiel `logo_para.jpg` (1418×1072) | `assets/brand/`, `apps/web/public/brand/`, `apps/admin/public/brand/` | Dépôt `yeoyedjande/para-institut` (SRC-01), MD5 `bda63771…` | Propriété de l'établissement | En-tête (plaque), pied de page, Open Graph, JSON-LD |
| Icônes favicon / écran d'accueil | `apps/web/src/app/{favicon.ico,icon.png,apple-icon.png}`, `apps/web/public/icons/` | Dérivées du monogramme par le dépôt SRC-01 (`scripts/brand/generate_icons.py`), non modifiées | Établissement | Navigateur, manifeste |
| Visuels de campagne Lomé 2026 (`consultation-dermo-analyse.webp`, `masterclass-atelier.webp`, `hero-foulard-africain.webp`, 831–1672 px) | `assets/events/`, `apps/web/public/media/events/lome-2026/` | Dépôt SRC-01 (affiche de l'événement) | Fournis par l'établissement pour l'événement ; droits d'usage hors événement à confirmer | Uniquement l'actualité de l'événement, légende « Visuel de campagne », retirée après le 7/12/2026 |
| Visuels « matière » (perle, sérum, crème, gel, huile) AVIF/WebP 640/1200 | `apps/web/public/media/matter/` | **Créations originales** rendues depuis le shader du projet (`scripts/render-posters.mjs`) | Projet | Héros, univers, laboratoire, cartes produits (« visuel indicatif de texture ») |
| Polices Bodoni Moda, Jost | `apps/web/public/fonts/`, `apps/admin/public/fonts/` | Google Fonts (téléchargées le 24/11/2026) | SIL OFL 1.1 (fichiers joints) | Typographie |
| Pictogrammes au trait, fronde de palme, plan stylisé, nuancier | Code (`icons.tsx`, `visit.tsx`, `expertise.tsx`) | Dessinés pour le projet | Projet | Interface |
| Grain photographique | CSS inline (SVG `feTurbulence`) | Projet | Projet | Sections sombres |

Aucune photographie de banque d'images, aucun hotlinking, aucune image Google. Les hôtes de banques d'images sont
d'ailleurs inaccessibles depuis l'environnement de développement. Photographies authentiques à produire : M9.
