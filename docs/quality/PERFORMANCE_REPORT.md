# Rapport de performance

## Conditions (mesures de laboratoire)
- Lighthouse 13.6.0, Chromium 1243 headless, serveur `next start` local (aucune latence réseau réelle).
- « mobile » : profil Lighthouse par défaut (Moto G Power simulé, 4G lente simulée, CPU ×4) ; « desktop » : `--preset=desktop`.
- Machine sans GPU : WebGL en rendu logiciel → la scène 3D reste statique (comportement prévu). Les scores reflètent donc
  l'expérience « visuel de repli » ; sur GPU réel, la 3D démarre après le chargement, au repos du navigateur.
- Données brutes : `docs/quality/lighthouse-summary.json`. **Aucune mesure terrain (CrUX/RUM) : site non déployé.**

## Résultats (24/11/2026)
| Page | Forme | Perf. | Access. | Bonnes pr. | SEO* | LCP (simulé) | CLS | TBT | JS |
|---|---|---|---|---|---|---|---|---|---|
| `/` | mobile | **95** | 100 | 100 | 69 | 2,9 s | 0 | 100 ms | 161 Ko |
| `/` | desktop | **100** | 100 | 100 | 69 | 0,7 s | 0 | 10 ms | 167 Ko |
| `/boutique` | mobile | **100** | 100 | 100 | 69 | 0,9 s | 0,001 | 90 ms | 170 Ko |
| `/boutique` | desktop | **100** | 100 | 100 | 69 | 0,2 s | 0,007 | 20 ms | 176 Ko |
| `/boutique/serum-hydratant-demo` | mobile | **93** | 100 | 100 | 69 | 3,2 s | 0 | 80 ms | 166 Ko |
| `/boutique/serum-hydratant-demo` | desktop | **100** | 100 | 100 | 69 | 0,7 s | 0 | 10 ms | 171 Ko |
| `/soins` | mobile | **90** | 100 | 100 | 69 | 3,5 s | 0,001 | 120 ms | 163 Ko |
| `/soins` | desktop | **100** | 100 | 100 | 69 | 0,7 s | 0,001 | 20 ms | 167 Ko |
| `/soins/reservation` | mobile | **100** | 100 | 100 | 69 | 0,9 s | 0,001 | 80 ms | 165 Ko |
| `/soins/reservation` | desktop | **100** | 100 | 100 | 69 | 0,2 s | 0,001 | 0 ms | 165 Ko |

\* SEO 69 : uniquement parce que le prototype est volontairement `noindex` (`NEXT_PUBLIC_CONTENT_MODE=demo`).

## Lecture
- Objectif « Performance ≥ 90 » : **atteint sur toutes les pages mesurées**, mobile et ordinateur.
- **LCP** : ≤ 2,5 s sur ordinateur et sur les pages à LCP textuel ; **2,9 à 3,5 s en simulation mobile** quand le LCP est
  une image de matière (LCP observé localement : 0,15–0,25 s). Objectif 2,5 s non garanti en 4G lente : à confirmer par
  des mesures terrain ; piste : versions 480 px plus légères des visuels, `Early Hints`, CDN.
- **CLS** ≤ 0,007 (objectif 0,1). **INP** : non mesurable en laboratoire ; TBT ≤ 120 ms, interactions sans calcul lourd.

## Optimisations réalisées
Visuels AVIF/WebP responsives (10–30 Ko), image LCP préchargée en priorité haute, polices auto-hébergées (romain et
Jost préchargés, italique à la demande), Three.js (137 Ko) téléchargé seulement si la scène s'anime, héros statique sur
appareils modestes, détection du rendu logiciel, démarrage au repos, pause hors écran, qualité adaptative, zod retiré du
bundle client (`sideEffects: false`), pages statiques/ISR, aucune ressource tierce.

Historique : accueil mobile 60 (TBT 2,56 s) → 86 → 90 → **95** au fil des correctifs.
