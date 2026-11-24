# Couleurs officielles et système chromatique

Relevé effectué sur le logo officiel (SRC-01) et confirmé par `docs/brand.md` du dépôt événementiel. Contrastes calculés
selon WCAG 2.2 (formule de luminance relative), le 24/11/2026. Jetons : `packages/ui/src/tokens.css`.

## Couleurs permanentes de la marque (logo)

| Jeton | Hex | Source | Rôle |
|---|---|---|---|
| `--brand-turquoise` | `#009a96` | Fond du logo (pixel) | **Brand primary** : aplats, plaque du logo, surfaces de marque |
| `--brand-silver` | `#c6c6c6` | Monogramme « PI » | **Brand secondary** : filets, détails |
| `--brand-white` | `#ffffff` | Texte du logo | Texte sur fonds sombres |

## Déclinaisons dérivées (calculées depuis le turquoise)

| Jeton | Hex | Rôle | Contraste |
|---|---|---|---|
| `--brand-turquoise-deep` | `#00706d` | Boutons, liens (primary interactif) | blanc 5,93:1 · sur ivoire 5,60:1 |
| `--brand-turquoise-night` | `#005c59` | Titres, info | blanc 7,85:1 |
| `--brand-abyss` | `#003f3c` | Sections immersives (background sombre) | blanc 11,82:1 |
| `--brand-ink-deep` | `#032523` | Scène 3D, fond le plus profond | blanc 16,24:1 |
| `--neutral-mist` | `#e6f3f2` | Fond d'accent clair | night sur mist 6,90:1 |

## Couleurs de campagne (événement « Peau noire, peau lumineuse »)

| Jeton | Hex | Statut | Rôle dans le site |
|---|---|---|---|
| `--accent-gold` | `#e2c27f` | HISTORICAL — proposé en accent permanent, à valider (M13) | **Accent** sur fonds sombres uniquement (6,90:1 sur abyss) |
| `--accent-gold-deep` | `#7a5c1e` | Dérivé | Accent sur clair (5,87:1 sur ivoire) |
| crème `#fbf6ea` | — | Campagne | Non réutilisée telle quelle (remplacée par l'ivoire ci-dessous) |

Les visuels et la typographie manuscrite de la campagne (Great Vibes, feuillages dorés) **ne sont pas** repris comme
identité permanente.

## Neutres chauds (Warm Beauty Studio)

| Jeton | Hex | Rôle | Contraste |
|---|---|---|---|
| `--neutral-ivory` | `#fbf8f3` | **Background** | texte 14,66:1 |
| `--color-surface` | `#ffffff` | **Surface** | — |
| `--neutral-sand` | `#f2ece2` | Surface secondaire | texte secondaire 5,73:1 |
| `--color-text` | `#0f2826` | **Text primary** | 14,66:1 sur ivoire |
| `--color-text-secondary` | `#4a605c` | **Text secondary** | 6,36:1 sur ivoire · 6,73:1 sur blanc |
| `--color-border` | `#dcd6cb` | **Borders** (décoratives) | — |
| `--color-border-strong` | `#a9b8b4` | Bordures de champs | — |

Pourquoi ces neutres : ils réchauffent le turquoise sans le remplacer. Le site reste majoritairement turquoise / ivoire /
abysse ; aucune palette générique beige, terracotta, violette ou pastel n'a été introduite.

## États

| Jeton | Hex | Fond | Contraste |
|---|---|---|---|
| `--color-success` | `#1d6b45` | `#e3f1e9` | 5,56:1 |
| `--color-warning` | `#8a5300` | `#fbefd9` | 5,56:1 |
| `--color-error` | `#b42318` | `#fbe7e5` | 5,53:1 |
| `--color-info` | `#005c59` | `#e6f3f2` | 6,90:1 |

## Règles
- Pas de petit texte blanc sur `#009a96` (3,46:1). Le panneau « Parapharmacie » emploie un dégradé `#009a96` → `#00706d`
  pour que le texte repose sur ≥ 5,9:1.
- Texte d'interface sur turquoise officiel : encre `#0f2826` (4,48:1, grands textes) ou blanc sur turquoise profond.
- Le focus visible utilise `#00706d` sur clair et l'or sur sombre.
