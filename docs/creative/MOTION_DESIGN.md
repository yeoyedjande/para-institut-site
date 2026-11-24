# Motion design — v2 « expérience »

Décision du 24/11/2026 : le commanditaire demande une expérience « waouh » (fluidité au défilement, animation, 3D
présente sur tout le site). La v1, volontairement sobre (CSS seul, défilement natif), est remplacée par une
chorégraphie complète. Principes conservés : contenu lisible immédiatement, aucune action bloquée, accessibilité.

## Outils
| Outil | Version | Rôle | Licence |
|---|---|---|---|
| Lenis | 1.3.27 | Défilement fluide à la molette (amorti `lerp 0.085`) ; tactile laissé natif (`syncTouch: false`) | MIT |
| GSAP + ScrollTrigger | 3.15.1 | Épinglage, défilement horizontal, animations liées au défilement (`scrub`) | GSAP Standard License (gratuite, usage commercial autorisé) |
| @gsap/react | 2.1.2 | Nettoyage automatique (`useGSAP`) | MIT |
| CSS | — | Lettres du héros, rideau, révélations, bandeaux | — |

Fichiers : `apps/web/src/components/experience/` (défilement fluide, curseur, rideau, scène 3D, ambiance).

## Chorégraphie de la page d'accueil
| Moment | Effet | Technique |
|---|---|---|
| Ouverture (1 fois par session) | Rideau turquoise, logo officiel révélé, filet argent, puis le rideau se retire en goutte | CSS pur (script en ligne avant affichage) ; ne bloque aucun clic ; ≈ 2 s |
| Héros | Titre géant lettre par lettre (montée, rotation, flou), goutte de sérum 3D libre derrière le texte, anneau typographique | CSS (lettres rendues côté serveur), WebGL |
| Défilement du héros | Les trois lignes s'écartent (gauche/droite), le texte s'efface, la goutte prend le relais | GSAP `scrub` |
| Manifeste | Les mots s'allument un à un (gris turquoise 3,2:1 → encre) | GSAP `scrub` + `stagger` |
| Bandeaux | Texte géant en contour qui défile en continu et s'incline selon la vitesse de défilement | CSS + vitesse Lenis |
| Deux univers | Épinglé ; la Parapharmacie s'ouvre en cercle depuis la goutte | `position: sticky` + `clip-path` |
| Laboratoire | Épinglé sur 4 paliers : chaque palier change la matière de la goutte, nom géant en contour qui se recompose | ScrollTrigger + événement `para:texture` |
| Soins | Défilement horizontal épinglé ; arches en parallaxe, numéros géants qui glissent | GSAP `containerAnimation` (≥ 900 px) ; carrousel natif sur mobile |
| Boutique | Cartes inclinables en 3D au survol | CSS `perspective` + pointeur |
| Ambiance | Le fond de page glisse d'une couleur à l'autre (ivoire → encre → sable → brume → abysse) | ScrollTrigger + GSAP sur `body` ; seule la section active devient transparente |
| Finale | « Parlons de votre peau. » lettre par lettre, la goutte nacrée revient sur l'abysse | `Reveal` + WebGL |
| Curseur (souris) | Point + anneau amorti, libellés (« Boutique », « Voir », « Réserver »), boutons magnétiques | `gsap.quickTo` ; curseur système conservé |

## Garde-fous
- `prefers-reduced-motion` : ni Lenis, ni épinglage, ni scène 3D, ni rideau, ni curseur ; sections empilées et
  visuels statiques (testé par Playwright).
- Tactile : inertie native ; scène 3D démarrée au premier geste.
- Le défilement reste celui du document (barre, clavier, ancres, lecteurs d'écran) ; aucun « snapping ».
- Animations sur `transform`, `opacity`, `clip-path`, `filter` uniquement ; boucles arrêtées hors écran.
