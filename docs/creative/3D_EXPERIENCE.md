# Expérience 3D — « Laboratoire de la matière »

## Concept
Une goutte de matière cosmétique éclairée comme en studio photo. Cinq matières : **perle** (héros), **sérum**, **crème**,
**gel**, **huile**. Représentation abstraite des familles de textures : aucun packaging, aucun produit, aucune gamme
Para Institut n'est inventé (packagings réels : seulement avec ressources et droits, non disponibles).

## Technique
- **Three.js 0.187** brut (sans React Three Fiber ni Drei : une seule scène, contrôle fin, poids réduit).
- `apps/web/src/components/matter/engine.ts` : icosaèdre subdivisé (72 niveaux en haute qualité, 36 en basse), bruit
  simplex 3D dans le vertex shader (ondulation ample + stries de crème), normales recalculées par différences finies,
  attraction vers le pointeur.
- Fragment shader : studio procédural (deux boîtes à lumière à bords nets + rebond chaud), Fresnel de Schlick,
  spéculaire Blinn-Phong double lobe, transmission simulée (cœur lumineux, bords épais), diffusion enveloppante pour les
  matières opaques, irisation en couches minces, tonalité filmique ACES. **Aucune texture téléchargée.**
- Matières = jeux d'uniformes (`textures.ts`) interpolés à chaque changement.
- Trois gouttelettes satellites pour l'échelle et la profondeur.

## Performance et repli
| Garde-fou | Effet |
|---|---|
| Visuel de repli toujours rendu en premier (AVIF/WebP 640/1200, rendus depuis la même scène) | LCP immédiat, identique visuellement |
| `support.ts` séparé du moteur | Three.js (≈ 137 Ko compressés) n'est téléchargé que si la scène doit s'animer |
| Mobile / < 4 cœurs / < 4 Go | Héros statique ; laboratoire démarré seulement à l'entrée dans l'écran, qualité basse |
| Rendu logiciel détecté (SwiftShader, llvmpipe) | Aucune animation continue (évite de saturer le processeur) |
| `prefers-reduced-motion`, `Save-Data`, `?webgl=0` | Visuel statique |
| Démarrage au repos du navigateur (`requestIdleCallback`) | Ne concurrence pas le premier affichage |
| IntersectionObserver + `visibilitychange` | Boucle arrêtée hors écran / onglet masqué |
| Qualité adaptative | < 30 i/s : résolution réduite ; < 20 i/s : image figée |
| Perte de contexte WebGL | Retour au visuel de repli |
| Canevas `aria-hidden`, image de repli avec texte alternatif | Accessibilité |

## Régénérer les visuels de repli
```bash
pnpm --filter @para/web dev
node apps/web/scripts/render-posters.mjs   # → apps/web/public/media/matter/*.avif|webp
```
Contrôle qualité : `?webgl=force` force la scène même en rendu logiciel.
