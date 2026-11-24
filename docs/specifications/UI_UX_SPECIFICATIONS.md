# Spécifications UI/UX

## Principes
Mobile d'abord (clientèle majoritairement sur smartphone, réseaux mobiles), lisibilité avant spectacle, actions
commerciales toujours visibles, honnêteté de l'interface (rien n'est présenté comme confirmé ou réel s'il ne l'est pas).

## Navigation
- En-tête fixe : plaque du logo, 6 rubriques (≥ 1100 px), recherche (raccourci « / »), compte, panier avec compteur.
- Mobile : menu plein écran numéroté, appel « Demander un rendez-vous », fermeture par Échap, focus géré.
- Lien d'évitement « Aller au contenu ».

## Parcours
1. **Découvrir → acheter** : accueil → boutique (filtres) → fiche → panier (tiroir) → [commande V1 à brancher].
2. **Découvrir → réserver** : accueil/soins → demande en 3 étapes (soin, date et moment, coordonnées + consentement) →
   récapitulatif → envoi WhatsApp. Messages d'erreur précis, focus sur le premier champ en erreur.
3. **Se renseigner** : WhatsApp en un geste depuis l'en-tête du héros, le pied de page et l'institut.

## Composants commerciaux
- Carte produit : visuel, badge de provenance (hors production), catégorie, nom, prix FCFA (espaces fines insécables),
  disponibilité (texte + couleur), « Ajouter au panier », aperçu rapide (modale).
- Fiche produit : visuel collant, fil d'Ariane, quantité (1–10), modes de retrait et de règlement, détails repliables.
- Prix absent : « Prix communiqué en boutique » (jamais de prix inventé).

## Responsive
Testé à 360, 390, 768, 1024, 1440, 1920 px : aucun débordement horizontal, cibles ≥ 44 px, carrousel produits à défilement
horizontal accrocheur sur mobile, grille 4 colonnes décalée sur ordinateur.

## Accessibilité
WCAG 2.2 AA visé ; Lighthouse accessibilité 100 sur les pages mesurées. Voir `docs/brand/DESIGN_SYSTEM.md`.
