# Motion design

Principe : chaque mouvement sert la lecture ou la marque ; rien n'empêche de lire, naviguer ou commander.
Aucune bibliothèque d'animation n'a été ajoutée : CSS + quelques hooks (`apps/web/src/components/motion`). GSAP avait été
envisagé ; il a été écarté (≈ 70 Ko) car le défilement natif + IntersectionObserver suffisent (décision documentée).

| Animation | Où | Technique | Durée / courbe | Réduit |
|---|---|---|---|---|
| Lignes du titre montant de leur masque | Héros | CSS `@keyframes`, décalage 120 ms | 1200 ms, expo out | Désactivé |
| Fondu des textes du héros | Héros | CSS | 900 ms | Désactivé |
| Anneau de texte en rotation lente | Héros | CSS | 60 s, linéaire | Désactivé |
| Goutte vivante (respiration, pointeur) | Héros (ordinateur), Laboratoire | WebGL | continue, pausée hors écran | Visuel fixe |
| Révélations (montée, fondu, masque, ligne) | Sections | `Reveal` + IntersectionObserver | 1200 ms | Contenu visible d'emblée |
| Ouverture en goutte de la Parapharmacie | Deux univers | `position: sticky` + `clip-path: circle()` piloté par la progression de défilement (`useScrollProgress`) | lié au défilement | Sections empilées |
| Parallaxe et rotation des gouttes | Deux univers | `transform` lié à `--progress` | lié au défilement | Aucun |
| Changement de matière | Laboratoire | Interpolation des uniformes (1,3 s, cubic in-out) avec « liquéfaction » à mi-parcours | 1300 ms | Image fixe de la texture choisie |
| Matière qui suit le pointeur | Soins (ordinateur, souris) | `transform` + transition 420 ms | — | Masqué sur tactile |
| Encre des boutons | Partout | Disque qui monte (`::before`) | 700 ms | Survol uniquement |
| Soulignement des liens | Navigation, pied de page | `scaleX` / `background-size` | 360 ms | — |
| Tiroir et modale | Panier, recherche, aperçu | `<dialog>` + keyframes | 700 ms | Instantané |
| Pulsation du repère | Plan de l'institut | CSS | 2,8 s | Désactivé |

Règles : pas de défilement détourné (aucune bibliothèque de défilement lissé), pas d'écran de chargement, contenu
principal visible immédiatement (le LCP n'attend aucune animation), `prefers-reduced-motion` respecté globalement
(jetons de durée à 0, défilement collant et 3D désactivés — testé par Playwright), seules `transform`, `opacity` et
`clip-path` sont animées.
