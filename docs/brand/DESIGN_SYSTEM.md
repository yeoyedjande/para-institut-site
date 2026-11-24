# Design system — Warm Beauty Studio

Paquet `@para/ui` (jetons, base CSS, composants React accessibles), partagé par `apps/web` et `apps/admin`.
Page vivante, **développement uniquement** : `http://localhost:3000/design-system` (404 en production, testé).

## Jetons (`packages/ui/src/tokens.css`)
- **Couleurs** : voir `OFFICIAL_COLORS.md`.
- **Typographies** (SIL OFL 1.1, auto-hébergées, `apps/web/public/fonts`) :
  - *Bodoni Moda* (Indestructible Type, variable 400–900, romain + italique) — titres éditoriaux. Choix : contraste
    fin/épais très marqué, cohérent avec le monogramme « PI » et le dessin de « Para-Institut ». L'italique sert de
    ponctuation éditoriale (« *Notre* expertise »).
  - *Jost* (Indestructible Type, variable 300–700) — interface et textes. Géométrique inspirée de Futura, proche des
    capitales espacées « P A L M  C L U B » du logo, très lisible en petit corps.
  - Licences vérifiées : fichiers `OFL-bodonimoda.txt`, `OFL-jost.txt`.
- **Échelle** fluide `--text-2xs` → `--text-display` (clamp 360 → 1440 px).
- **Espacements** base 4 px (`--space-1` … `--space-10`), `--section-y`, `--gutter`, `--container` 88 rem.
- **Grille** : conteneur 88 rem, gouttières fluides ; compositions asymétriques (1,12fr / 0,88fr, 1,2fr / 1fr).
- **Points de rupture** : 480, 640, 768, 900, 1024, 1100 (navigation complète), 1280.
- **Formes** : angles vifs (2–4 px) pour les surfaces commerciales, pilule pour les actions, **arche** pour les cadres
  éditoriaux. Pas de cartes arrondies répétitives.
- **Ombres** : deux niveaux sobres seulement.
- **Motion tokens** : `--dur-fast` 200 ms, `--dur-base` 360 ms, `--dur-slow` 700 ms, `--dur-cinematic` 1200 ms ;
  `--ease-out` (expo), `--ease-in-out` (« soie »). Mis à zéro sous `prefers-reduced-motion`.

## Composants
| Composant | Fichier | Notes d'accessibilité |
|---|---|---|
| `Button`, `buttonClass` (primaire, secondaire, inversé, contour inversé, discret ; sm/md/lg) | `primitives.tsx` | Cible ≥ 44 px, état désactivé, remplissage « encre » au survol uniquement (`hover: hover`) |
| `Badge`, `ProvenanceBadge` | `primitives.tsx` | Texte toujours présent (pas de couleur seule) |
| `Field` + `controlClass` (input, select, textarea) | `primitives.tsx` | Libellé lié, aide et erreur via `aria-describedby`, `aria-invalid`, erreur annoncée (`role="alert"`), 16 px (pas de zoom iOS) |
| `Notice` (info, succès, avertissement, erreur) | `primitives.tsx` | `role="note"` / `alert` |
| `Skeleton`, `Spinner` | `primitives.tsx` | Spinner annoncé (`role="status"`) |
| `EmptyState` | `primitives.tsx` | — |
| `Sheet` (modale / tiroir) | `sheet.tsx` | `<dialog>` natif : piège du focus, Échap, restitution du focus, fond inerte |
| Navigation, menu mobile, recherche | `apps/web/src/components/layout` | `aria-current`, `aria-expanded`, Échap, raccourci « / » |
| Carte produit + aperçu rapide | `apps/web/src/components/shop/product-card.tsx` | Nom et produit dans les libellés de bouton |
| Carte prestation, onglets matière, étapes de formulaire | `apps/web/src/components/*` | Onglets ARIA complets (flèches, Début, Fin) |

## États
Chargement (Skeleton, Spinner), vide (EmptyState), erreur (Notice error, page `error.tsx`), confirmation
(Notice success), 404 (`not-found.tsx`). Toute fonctionnalité non branchée est signalée explicitement.

## Règles d'accessibilité
WCAG 2.2 AA visé : contrastes ≥ 4,5:1 (texte) — voir tableau des couleurs ; focus visible 2 px ; lien d'évitement ;
navigation clavier complète ; cibles tactiles ≥ 44 px ; `prefers-reduced-motion` respecté (animations, défilement
collant et 3D désactivés) ; aucune information véhiculée par la seule couleur ; textes alternatifs (visuels 3D décrits
comme illustrations) ; langue `fr`.
