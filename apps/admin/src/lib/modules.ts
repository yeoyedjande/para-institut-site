/** Modules du back-office (docs/specifications/FUNCTIONAL_SPECIFICATIONS.md § Back-office). */
export interface AdminModule {
  slug: string;
  label: string;
  group: "Pilotage" | "Boutique" | "Institut" | "Clients & contenus" | "Administration";
  permission: string;
  features: string[];
}

export const MODULES: AdminModule[] = [
  { slug: "dashboard", label: "Tableau de bord", group: "Pilotage", permission: "dashboard:read", features: ["Commandes à confirmer", "Demandes de rendez-vous en attente", "Alertes de stock", "Planning du jour"] },
  { slug: "rapports", label: "Rapports", group: "Pilotage", permission: "reports:read", features: ["Ventes par période et par catégorie", "Prestations réalisées", "Exports CSV audités"] },
  { slug: "produits", label: "Produits", group: "Boutique", permission: "catalog:write", features: ["Saisie manuelle (aucun import en V1)", "Statut de publication", "Prix en FCFA", "Photographies via la médiathèque"] },
  { slug: "categories", label: "Catégories", group: "Boutique", permission: "catalog:write", features: ["Arborescence", "Ordre d'affichage"] },
  { slug: "marques", label: "Marques", group: "Boutique", permission: "catalog:write", features: ["Statut de vérification", "Visibilité sur l'accueil"] },
  { slug: "stocks", label: "Stocks", group: "Boutique", permission: "stock:write", features: ["Stock physique et réservé", "Mouvements tracés", "Seuils d'alerte"] },
  { slug: "commandes", label: "Commandes", group: "Boutique", permission: "orders:write", features: ["Confirmation manuelle", "Vérification du stock", "Annulation qui libère les quantités", "Historique des opérations"] },
  { slug: "reglements", label: "Règlements", group: "Boutique", permission: "payments:write", features: ["Règlement à la livraison ou au retrait", "Statut indépendant de la commande", "Extensible Mobile Money / carte"] },
  { slug: "livraisons", label: "Livraisons", group: "Boutique", permission: "delivery:write", features: ["Zones et frais d'Abidjan configurables", "Retrait à l'institut", "Suivi de remise"] },
  { slug: "promotions", label: "Promotions", group: "Boutique", permission: "promotions:write", features: ["Période de validité obligatoire", "Aucune promotion expirée affichée"] },
  { slug: "prestations", label: "Prestations", group: "Institut", permission: "services:write", features: ["Visage, corps, massages, spa", "Durée et tarif", "Publication après validation"] },
  { slug: "reservations", label: "Réservations", group: "Institut", permission: "bookings:write", features: ["Confirmer, refuser, reporter, annuler", "Une demande n'est pas un rendez-vous"] },
  { slug: "planning", label: "Planning", group: "Institut", permission: "planning:read", features: ["Vue par cabine et par jour", "Prévention des doubles réservations (contrainte base de données)"] },
  { slug: "clients", label: "Clients", group: "Clients & contenus", permission: "customers:read", features: ["Fiches clientes", "Historique commandes et réservations", "Minimisation des données"] },
  { slug: "actualites", label: "Actualités", group: "Clients & contenus", permission: "content:write", features: ["Conseils, nouveautés", "Date de fin : retrait automatique"] },
  { slug: "evenements", label: "Événements", group: "Clients & contenus", permission: "content:write", features: ["Animations commerciales", "Archives jamais présentées comme actuelles"] },
  { slug: "contenus", label: "Gestion des contenus", group: "Clients & contenus", permission: "content:write", features: ["Textes des pages", "Statut de provenance de chaque information"] },
  { slug: "mediatheque", label: "Médiathèque", group: "Clients & contenus", permission: "media:write", features: ["Stockage S3 compatible", "Source et licence obligatoires", "Conversion AVIF/WebP"] },
  { slug: "utilisateurs", label: "Utilisateurs", group: "Administration", permission: "users:write", features: ["Invitations", "Aucun compte administrateur par défaut", "Double authentification"] },
  { slug: "roles", label: "Rôles et permissions", group: "Administration", permission: "users:write", features: ["Moindre privilège", "Rôles : administration, boutique, institut, accueil"] },
  { slug: "audit", label: "Journal d'audit", group: "Administration", permission: "audit:read", features: ["Qui, quoi, quand", "Lecture seule"] },
  { slug: "parametres", label: "Paramètres", group: "Administration", permission: "settings:write", features: ["Coordonnées et horaires validés", "Numéros affectés aux commandes et réservations", "Frais de livraison"] },
];

export function getModule(slug: string): AdminModule | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export const GROUPS = ["Pilotage", "Boutique", "Institut", "Clients & contenus", "Administration"] as const;
