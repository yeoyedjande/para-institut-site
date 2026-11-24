import { Badge, Notice } from "@para/ui";

const KPIS = ["Commandes à confirmer", "Demandes de rendez-vous", "Produits sous le seuil", "Rendez-vous du jour"];

/** Tableau de bord : aucune donnée affichée tant que l'API n'est pas branchée (aucune statistique inventée). */
export default function Dashboard() {
  return (
    <>
      <div className="topbar">
        <h1 className="title">Tableau de bord</h1>
        <Badge tone="warning">Prototype — non connecté</Badge>
      </div>
      <Notice tone="info" title="Squelette du back-office">
        La navigation, les modules et les permissions sont en place. Les écrans seront branchés sur l&apos;API (services/api) au fil des phases
        suivantes ; l&apos;authentification (sessions, double authentification) précède toute donnée réelle.
      </Notice>
      <div className="cards">
        {KPIS.map((k) => (
          <section key={k} className="card" aria-label={k}>
            <h2>{k}</h2>
            <p className="metric" aria-label="Donnée indisponible">
              —
            </p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Disponible après connexion à l&apos;API</p>
          </section>
        ))}
      </div>
    </>
  );
}
