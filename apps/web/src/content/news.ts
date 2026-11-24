import type { NewsItem } from "@para/contracts";

/**
 * Actualités. Le back-office les administrera ; un contenu terminé n'est plus présenté comme actuel
 * (isCurrent). L'événement de Lomé est publié sur le site événementiel officiel (SRC-03).
 */
export const NEWS: NewsItem[] = [
  {
    id: "n-lome-2026",
    slug: "peau-noire-peau-lumineuse-lome-2026",
    kind: "evenement",
    title: "Peau noire, peau lumineuse — Spécial fêtes",
    excerpt:
      "Masterclass, atelier et consultations de dermo-analyse à l'Hôtel Mirambeau de Lomé, du 5 au 7 décembre 2026.",
    startsAt: "2026-12-05T09:00:00+00:00",
    endsAt: "2026-12-07T19:00:00+00:00",
    href: "https://www.parainstitut-palmclub.com/",
    image: {
      src: "/media/events/lome-2026/consultation-dermo-analyse.webp",
      alt: "Visuel de campagne : une conseillère réalise une analyse de peau",
    },
    status: "VERIFIED",
  },
  {
    id: "n-demo-conseil",
    slug: "exemple-conseil-beaute",
    kind: "conseil",
    title: "Exemple de conseil beauté",
    excerpt: "Emplacement de démonstration : les conseils seront rédigés et publiés par l'équipe depuis le back-office.",
    startsAt: "2026-11-01T00:00:00+00:00",
    endsAt: null,
    status: "DEMO_ONLY",
  },
  {
    id: "n-demo-nouveaute",
    slug: "exemple-nouveaute",
    kind: "nouveaute",
    title: "Exemple de nouveauté en boutique",
    excerpt: "Emplacement de démonstration pour les arrivages et animations commerciales administrés en back-office.",
    startsAt: "2026-11-01T00:00:00+00:00",
    endsAt: null,
    status: "DEMO_ONLY",
  },
];

export const NEWS_KIND_LABELS: Record<NewsItem["kind"], string> = {
  evenement: "Événement",
  promotion: "Promotion",
  conseil: "Conseil beauté",
  nouveaute: "Nouveauté",
  animation: "Animation",
};
