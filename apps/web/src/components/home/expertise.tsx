import { Reveal } from "@/components/motion/reveal";
import styles from "./expertise.module.css";

/** Nuancier de carnations (aplats colorés, sans étiquette) : toutes les peaux, du plus profond au plus clair. */
const CARNATIONS = ["#2b1810", "#3d2316", "#55311e", "#6e4329", "#8a5a3b", "#a8754f", "#c69472", "#e0b896"];

const STEPS = [
  { n: "01", title: "Écouter", text: "Vos habitudes, vos envies, votre rythme de vie." },
  { n: "02", title: "Observer", text: "Votre peau et ce dont elle a besoin aujourd'hui." },
  { n: "03", title: "Conseiller", text: "Une orientation dans le choix des produits et des soins." },
  { n: "04", title: "Accompagner", text: "Des conseils qui évoluent avec votre peau, visite après visite." },
];

/** Section 07 — Expertise et conseils. Aucune qualification, aucun résultat thérapeutique revendiqué. */
export function Expertise() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="expertise-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.intro}>
          <p className="eyebrow">07 — Expertise &amp; conseils</p>
          <h2 id="expertise-title" className="h2">
            Chaque peau <em className={styles.em}>a sa lumière.</em>
          </h2>
          <p className="lede">
            Le conseil commence par l&apos;écoute. Quelle que soit votre carnation, nous prenons le temps de comprendre votre peau avant de vous
            orienter.
          </p>
        </Reveal>

        <Reveal className={styles.nuancier} variant="fade" delay={150}>
          <ul role="list" aria-label="Nuancier de carnations, du plus profond au plus clair">
            {CARNATIONS.map((c, i) => (
              <li key={c} style={{ "--c": c, "--i": i } as React.CSSProperties}>
                <span className="sr-only">Carnation {i + 1}</span>
              </li>
            ))}
          </ul>
          <p className={styles.nuancierCaption}>Toutes les carnations, toutes les peaux.</p>
        </Reveal>
      </div>

      <div className="container">
        <ol role="list" className={styles.steps}>
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 100} className={styles.step}>
              <span className={styles.stepN}>{s.n}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepText}>{s.text}</p>
            </Reveal>
          ))}
        </ol>
        <p className={styles.disclaimer}>Nos conseils beauté ne remplacent pas l&apos;avis d&apos;un médecin ou d&apos;un dermatologue.</p>
      </div>
    </section>
  );
}
