# Expérience 3D — v2 « la goutte voyageuse »

## Concept
Une seule goutte de matière cosmétique accompagne la visite : **sérum** turquoise dans le héros, **huile** ambrée près
du manifeste, puis au centre du **laboratoire** où chaque palier de défilement la transforme (sérum, crème, gel, huile),
et enfin **perle** nacrée sur l'abysse du contact. Une poussière de lumière (turquoise sur fond clair, dorée sur fond
sombre) flotte en profondeur. Représentation abstraite : aucun produit, aucun packaging, aucune gamme inventée.

## Technique
- `apps/web/src/components/experience/matter-stage.tsx` : un canevas plein écran fixé derrière le contenu ; les sections
  déclarent `data-stage="hero|manifesto|lab|finale"` ; table `STAGES` (position, échelle, matière, ambiance, ordinateur /
  mobile). La goutte se déplace par amortissement (voyage fluide), le canevas s'efface ailleurs et le rendu s'arrête.
- `apps/web/src/components/matter/engine.ts` : icosaèdre subdivisé, bruit simplex 3D, studio procédural, Fresnel,
  transmission, irisation, tonalité ACES ; v2 : groupe « rig » positionné en coordonnées d'écran (`setPose`),
  **ondulation selon la vitesse de défilement** (`setVelocity`), poussière de lumière (`Points`, 520 / 220 points),
  ambiance claire/sombre (`setMood`), attraction vers la souris.
- Matières : `textures.ts`. Visuels de repli : `public/media/matter/*` (rendus depuis la même scène).

## Performance et repli
| Garde-fou | Effet |
|---|---|
| Visuels statiques AVIF/WebP dans chaque section | Affichés tant que la scène n'est pas active (`html[data-stage-live]`) |
| Three.js (≈ 137 Ko) chargé dynamiquement | Seulement si la scène peut s'animer |
| Ordinateur : démarrage au repos après chargement ; mobile : au premier geste (ou 3,5 s) | Premier affichage non concurrencé |
| Rendu logiciel (SwiftShader, llvmpipe), `Save-Data`, `?webgl=0`, moins d'animations | Pas de 3D |
| Qualité basse (mobile, < 4 cœurs, < 4 Go) | Moins de subdivisions, moins de particules, densité de pixels ≤ 1,25 |
| Qualité adaptative (< 30 i/s puis < 20 i/s) | Résolution réduite puis image figée |
| Rendu stoppé hors scène et onglet masqué | Batterie préservée |

Contrôle qualité sans GPU : `?webgl=force`. Régénération des visuels : `node apps/web/scripts/render-posters.mjs`.
