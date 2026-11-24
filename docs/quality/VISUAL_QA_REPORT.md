# Rapport de contrôle qualité visuel

Date : 24/11/2026. Environnement : conteneur Linux sans GPU, Chromium 1243 (Playwright 1.63) headless, WebGL par
SwiftShader (rendu logiciel). Build de production (`next build && next start`). Script reproductible :
`apps/web/scripts/qa-screenshots.mjs`. Captures : `docs/quality/screenshots/` (WebP, réduites à 1440 px de large max).

## Couverture
- **Pleine page** (préférence « moins d'animations » : sections empilées, visuels de repli) pour `/`, `/boutique`,
  `/boutique/serum-hydratant-demo`, `/soins`, `/soins/reservation` à **360×800, 390×844, 768×1024, 1024×768,
  1440×900, 1920×1080** (30 captures).
- **Ciblées avec animations et WebGL** à 1440×900 et 390×844 : héros, transition des deux univers (début, milieu, fin),
  laboratoire (sérum puis huile) — 12 captures.
- Mesures automatiques à chaque résolution : débordement horizontal (`scrollWidth - innerWidth`) et erreurs console.

## Résultats automatiques (dernière passe)
| Contrôle | Résultat |
|---|---|
| Débordement horizontal (30 combinaisons page × résolution) | 0 |
| Erreurs console / exceptions (6 résolutions × 5 pages) | 0 |
| Violations CSP | 0 (après élimination de zod du bundle client) |

## Cycles d'autocorrection
| # | Constat | Correction |
|---|---|---|
| 1 | Titres affichés en Jost au lieu de Bodoni | Nom de police « Bodoni 72 » non quoté dans la pile de repli générée : déclaration invalide. Pile corrigée, puis polices déclarées en `@font-face` |
| 2 | « Encre » des boutons visible sous le libellé au repos | Disque repositionné sous le bouton (`top: 100%`) |
| 3 | Matière 3D « froissée », éclairage plat | Bruit à basse fréquence, softbox à bords nets, Fresnel de Schlick, transmission, tonalité ACES ; visuels de repli régénérés |
| 4 | Plan de l'institut jamais révélé | `clip-path` sur la cible excluait l'élément de l'IntersectionObserver : masque appliqué aux enfants |
| 5 | Texte du panneau Parapharmacie à 3,5:1 | Dégradé turquoise → turquoise profond, texte blanc ≥ 5,9:1 ; spécificité CSS corrigée (classe globale prioritaire en production) |
| 6 | Mobile : sélecteur d'univers sur le bouton d'action | Goutte en médaillon, étiquettes masquées < 600 px, marge basse dédiée |
| 7 | Titre du héros sur 4 lignes à 1440 px | Échelle du titre réduite (max 6,4 rem) |
| 8 | Ordre des titres (h1 → h3) sur la boutique | Titre de section `h2` (lecteurs d'écran) |
| 9 | Texte indicatif des champs à 3,56:1 | `#667673` (4,6:1) |

## v2 « expérience » (24/11/2026)
Refonte demandée par le commanditaire (« waouh », fluidité, animation, 3D). Captures du parcours complet à 1440×900 et
390×844 (rideau, héros, manifeste, univers, laboratoire épinglé à deux paliers, soins horizontaux, boutique, finale).
Corrections issues de l'examen : espaces absorbés entre les mots découpés en lettres (« Votrepeau. »), anneau du curseur
affichant « ON » (attribut de détection lu par erreur), goutte nacrée trop pâle sur ivoire (héros passé en sérum),
avertissement d'hydratation dû au script d'ouverture, mots du manifeste estompés sous 3:1 (couleur au lieu d'opacité),
en-tête transparent au-dessus d'un en-tête de page sombre, laboratoire transparent hors de sa zone active.
Les captures `motion-*` de `docs/quality/screenshots/` sont rendues avec `?webgl=force` (rendu logiciel, sans GPU).

## Analyse qualitative (captures examinées)
- **Hiérarchie** : promesse lisible dès le premier écran à toutes les tailles ; deux actions visibles sans défilement
  jusqu'à 360×800.
- **Compositions** : asymétrie maintenue sur ordinateur, empilement soigné sur mobile ; le héros 1920 px laisse un
  espace généreux sous la ligne d'information (assumé).
- **Couleurs** : turquoise officiel dominant, ivoire et abysse en contrepoint, or rare.
- **Matière 3D** : rendu « photo produit » convaincant pour le sérum, l'huile et la perle ; la crème reste la plus sobre.
- **Interactions testées** (Playwright) : panier, aperçu rapide, filtres, recherche, onglets clavier, formulaire en
  3 étapes, lien d'évitement.
- **Points ouverts** : photographies authentiques absentes (illustrations 3D et plan stylisé à la place, légendés) ;
  visuel de campagne 833 px légèrement doux sur écrans haute densité ; vérification sur appareils physiques (Android
  milieu de gamme, iPhone) et sur GPU réel **non effectuée** dans cet environnement.
