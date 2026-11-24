import { Badge, Button, EmptyState, Field, Notice, ProvenanceBadge, Skeleton, Spinner, controlClass } from "@para/ui";
import { Poster } from "@/components/home/poster";
import { ProductCard } from "@/components/shop/product-card";
import { PRODUCTS } from "@/content/catalog";
import { SheetDemo } from "./sheet-demo";
import styles from "./ds.module.css";

export const metadata = { title: "Design system" };

const COLORS = [
  { name: "brand-turquoise", hex: "#009a96", role: "Primaire de marque (fond du logo)" },
  { name: "brand-turquoise-deep", hex: "#00706d", role: "Interactif sur clair" },
  { name: "brand-turquoise-night", hex: "#005c59", role: "Titres, fonds sombres" },
  { name: "brand-abyss", hex: "#003f3c", role: "Sections immersives" },
  { name: "brand-ink-deep", hex: "#032523", role: "Scènes 3D" },
  { name: "brand-silver", hex: "#c6c6c6", role: "Secondaire (monogramme)" },
  { name: "neutral-ivory", hex: "#fbf8f3", role: "Fond" },
  { name: "neutral-sand", hex: "#f2ece2", role: "Surface secondaire" },
  { name: "neutral-mist", hex: "#e6f3f2", role: "Accent clair" },
  { name: "accent-gold", hex: "#e2c27f", role: "Accent sur sombre" },
  { name: "accent-gold-deep", hex: "#7a5c1e", role: "Accent sur clair" },
  { name: "text", hex: "#0f2826", role: "Texte principal" },
  { name: "text-secondary", hex: "#4a605c", role: "Texte secondaire" },
  { name: "border", hex: "#dcd6cb", role: "Bordures" },
  { name: "success", hex: "#1d6b45", role: "Succès" },
  { name: "warning", hex: "#8a5300", role: "Avertissement" },
  { name: "error", hex: "#b42318", role: "Erreur" },
];

const TYPE = [
  { token: "--text-display", sample: "Votre peau.", display: true },
  { token: "--text-3xl", sample: "Un temps pour soi.", display: true },
  { token: "--text-2xl", sample: "Soins du visage", display: true },
  { token: "--text-xl", sample: "Chaque peau a sa lumière", display: true },
  { token: "--text-md", sample: "Texte de lecture — Jost, interface commerciale." },
  { token: "--text-sm", sample: "Texte secondaire, légendes, aides de saisie." },
];

const MOTION = [
  ["--dur-fast", "200 ms", "survols, focus"],
  ["--dur-base", "360 ms", "changements d'état"],
  ["--dur-slow", "700 ms", "tiroirs, modales, encre des boutons"],
  ["--dur-cinematic", "1200 ms", "révélations éditoriales"],
  ["--ease-out", "cubic-bezier(.16,1,.3,1)", "entrées"],
  ["--ease-in-out", "cubic-bezier(.65,.05,.36,1)", "transitions d'univers"],
];

export default function DesignSystemPage() {
  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.head}>
        <p className="eyebrow">Développement uniquement</p>
        <h1 className="h2">Design system — Warm Beauty Studio</h1>
        <p className="lede">Référence vivante des jetons et composants. Documentation : docs/brand/DESIGN_SYSTEM.md.</p>
      </header>

      <section className={styles.block} aria-labelledby="ds-colors">
        <h2 id="ds-colors" className="h3">Couleurs</h2>
        <ul role="list" className={styles.swatches}>
          {COLORS.map((c) => (
            <li key={c.name}>
              <span className={styles.swatch} style={{ background: c.hex }} />
              <code>{c.name}</code>
              <span>{c.hex}</span>
              <span className={styles.muted}>{c.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.block} aria-labelledby="ds-type">
        <h2 id="ds-type" className="h3">Typographie</h2>
        <p className={styles.muted}>Bodoni Moda (titres, éditorial) · Jost (interface) — SIL OFL 1.1, auto-hébergées.</p>
        {TYPE.map((t) => (
          <div key={t.token} className={styles.typeRow}>
            <code>{t.token}</code>
            <span className={t.display ? "display" : undefined} style={{ fontSize: `var(${t.token})` }}>
              {t.sample}
            </span>
          </div>
        ))}
        <p className="eyebrow">Étiquette en capitales espacées</p>
      </section>

      <section className={styles.block} aria-labelledby="ds-buttons">
        <h2 id="ds-buttons" className="h3">Boutons</h2>
        <div className={styles.row}>
          <Button>Primaire</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="ghost">Discret</Button>
          <Button size="sm">Petit</Button>
          <Button disabled>Désactivé</Button>
        </div>
        <div className={`${styles.row} ${styles.dark}`} data-theme="inverse">
          <Button variant="inverse">Inversé</Button>
          <Button variant="ghostInverse">Contour inversé</Button>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="ds-badges">
        <h2 id="ds-badges" className="h3">Badges &amp; provenance</h2>
        <div className={styles.row}>
          <Badge>Neutre</Badge>
          <Badge tone="brand">Marque</Badge>
          <Badge tone="success" dot>
            Disponible
          </Badge>
          <Badge tone="warning" dot>
            Stock limité
          </Badge>
          <Badge tone="error">Erreur</Badge>
          <ProvenanceBadge status="VERIFIED" />
          <ProvenanceBadge status="HISTORICAL" />
          <ProvenanceBadge status="TO_CONFIRM" />
          <ProvenanceBadge status="DEMO_ONLY" />
        </div>
      </section>

      <section className={styles.block} aria-labelledby="ds-forms">
        <h2 id="ds-forms" className="h3">Formulaires</h2>
        <div className={styles.grid2}>
          <Field label="Prénom" required hint="Tel qu'il figure sur votre commande.">
            <input className={controlClass} placeholder="Awa" />
          </Field>
          <Field label="Téléphone" error="Numéro invalide : indiquez l'indicatif.">
            <input className={controlClass} defaultValue="0700" />
          </Field>
          <Field label="Mode de retrait">
            <select className={controlClass} defaultValue="pickup">
              <option value="pickup">Retrait à l&apos;institut</option>
              <option value="delivery">Livraison à Abidjan</option>
            </select>
          </Field>
          <Field label="Champ désactivé">
            <input className={controlClass} disabled value="Indisponible" readOnly />
          </Field>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="ds-feedback">
        <h2 id="ds-feedback" className="h3">Notifications &amp; états</h2>
        <div className={styles.stack}>
          <Notice tone="info" title="Information">Votre commande est en attente de confirmation.</Notice>
          <Notice tone="success" title="Confirmation">Votre demande a bien été préparée.</Notice>
          <Notice tone="warning" title="Attention">Frais de livraison communiqués avant confirmation.</Notice>
          <Notice tone="error" title="Erreur">Le produit n&apos;est plus disponible.</Notice>
          <div className={styles.row}>
            <Spinner />
            <Skeleton width="12rem" height="1rem" />
            <Skeleton width="6rem" height="2.5rem" />
          </div>
          <EmptyState title="État vide">Aucun résultat pour cette recherche.</EmptyState>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="ds-overlays">
        <h2 id="ds-overlays" className="h3">Modales &amp; tiroirs</h2>
        <SheetDemo />
      </section>

      <section className={styles.block} aria-labelledby="ds-cards">
        <h2 id="ds-cards" className="h3">Carte produit</h2>
        <div className={styles.cards}>
          {PRODUCTS.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} category="Démonstration" />
          ))}
        </div>
      </section>

      <section className={styles.block} aria-labelledby="ds-matter">
        <h2 id="ds-matter" className="h3">Matières (visuels de repli)</h2>
        <div className={styles.cards}>
          {(["perle", "serum", "creme", "gel", "huile"] as const).map((t) => (
            <figure key={t} className={styles.matter}>
              <Poster texture={t} alt="" />
              <figcaption>{t}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.block} aria-labelledby="ds-motion">
        <h2 id="ds-motion" className="h3">Motion tokens</h2>
        <table className={styles.table}>
          <tbody>
            {MOTION.map(([token, value, use]) => (
              <tr key={token}>
                <td>
                  <code>{token}</code>
                </td>
                <td>{value}</td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
