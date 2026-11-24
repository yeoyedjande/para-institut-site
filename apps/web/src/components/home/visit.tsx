import { ArrowIcon, buttonClass } from "@para/ui";
import { Reveal } from "@/components/motion/reveal";
import { ESTABLISHMENT, MAPS_HREF, PHONES, whatsappHref } from "@/content/establishment";
import { IS_DEMO } from "@/lib/content-mode";
import styles from "./visit.module.css";

/** Section 10 — Découvrir l'institut. Plan stylisé (illustration, non cartographique). */
export function Visit() {
  const a = ESTABLISHMENT.address.value;
  const phone = PHONES[0];
  return (
    <section className={`section ${styles.section}`} aria-labelledby="visit-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.text}>
          <p className="eyebrow">10 — Notre institut</p>
          <h2 id="visit-title" className="h2">
            Au cœur de la <em className={styles.em}>galerie marchande</em> de l&apos;Hôtel Palm Club.
          </h2>
          <address className={styles.address}>
            {ESTABLISHMENT.name.value}
            <br />
            {a.line} — {a.city}, {a.country}
          </address>
          <div className={styles.ctas}>
            <a href={MAPS_HREF} className={buttonClass("primary")} target="_blank" rel="noopener noreferrer">
              Itinéraire <ArrowIcon />
              <span className="sr-only"> (Google Maps, nouvel onglet)</span>
            </a>
            {phone ? (
              <a href={whatsappHref(phone.e164, "Bonjour, je souhaite venir à l'institut.")} className={buttonClass("secondary")} target="_blank" rel="noopener noreferrer">
                Nous écrire<span className="sr-only"> sur WhatsApp (nouvel onglet)</span>
              </a>
            ) : null}
          </div>
        </Reveal>

        <Reveal className={styles.visual} variant="mask">
          <svg viewBox="0 0 480 520" className={styles.plan} role="img" aria-labelledby="plan-title">
            <title id="plan-title">Illustration : plan stylisé situant l&apos;institut dans la galerie marchande de l&apos;hôtel</title>
            <rect width="480" height="520" fill="#003f3c" />
            {Array.from({ length: 9 }, (_, i) => (
              <ellipse key={i} cx="250" cy="270" rx={40 + i * 28} ry={30 + i * 22} fill="none" stroke="rgb(198 198 198 / 0.22)" strokeWidth="1" />
            ))}
            <path d="M0 420 C120 380 200 460 480 400" fill="none" stroke="#009a96" strokeWidth="2" opacity="0.7" />
            <path d="M0 450 C140 410 230 490 480 432" fill="none" stroke="#009a96" strokeWidth="1" opacity="0.4" />
            <g className={styles.pin}>
              <circle cx="250" cy="270" r="34" fill="#009a96" opacity="0.25" className={styles.pulse} />
              <circle cx="250" cy="270" r="9" fill="#e2c27f" />
            </g>
            <text x="250" y="330" textAnchor="middle" fill="#ffffff" fontFamily="var(--font-sans)" fontSize="11" letterSpacing="3">
              GALERIE MARCHANDE
            </text>
            <text x="250" y="348" textAnchor="middle" fill="rgb(255 255 255 / 0.7)" fontFamily="var(--font-sans)" fontSize="10" letterSpacing="3">
              HÔTEL PALM CLUB
            </text>
          </svg>
          <p className={styles.caption}>
            Illustration — plan non contractuel.
            {IS_DEMO ? " Photographies authentiques de l'institut à produire (voir docs/creative/ASSET_INVENTORY.md)." : ""}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
