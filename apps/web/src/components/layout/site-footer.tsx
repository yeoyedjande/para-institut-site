import Link from "next/link";
import { publishable } from "@para/contracts";
import { ProvenanceBadge } from "@para/ui";
import { CONTENT_MODE, IS_DEMO } from "@/lib/content-mode";
import { ESTABLISHMENT, HOURS, MAPS_HREF, PHONES, SOCIALS, telHref, whatsappHref } from "@/content/establishment";
import { Reveal } from "@/components/motion/reveal";
import { SplitChars } from "@/components/home/split";
import { BrandLogo } from "./brand-logo";
import { ClockIcon, PinIcon, WhatsAppIcon } from "./icons";
import { NAV_ITEMS } from "./nav-items";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  const hours = publishable(HOURS, CONTENT_MODE);
  const socials = publishable(SOCIALS, CONTENT_MODE);
  const address = ESTABLISHMENT.address.value;
  return (
    <footer className={`${styles.footer} grain`} data-theme="inverse" id="contact-footer" data-stage="finale" data-mood="abyss">
      <div className={`container ${styles.top}`}>
        <p className="eyebrow">11 — Contact</p>
        <Reveal as="h2" className={styles.statement} variant="fade" aria-label="Parlons de votre peau.">
          <SplitChars text="Parlons de" className="reveal-char" /> <em>
            <SplitChars text="votre peau." start={11} className="reveal-char" />
          </em>
        </Reveal>
        <p className={styles.intro}>Une question sur un soin, un produit ou une commande ? Notre équipe vous répond sur WhatsApp.</p>
        <ul role="list" className={styles.phones}>
          {PHONES.map((phone) => (
            <li key={phone.e164}>
              <a className={styles.phone} href={whatsappHref(phone.e164, "Bonjour Para Institut, j'ai une question.")} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className={styles.phoneIcon} />
                <span>
                  <span className={styles.phoneLabel}>WhatsApp</span>
                  {phone.display}
                </span>
                <span className="sr-only">(nouvel onglet)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={`container ${styles.grid}`}>
        <section aria-labelledby="f-adresse">
          <h3 id="f-adresse" className={styles.colTitle}>
            <PinIcon className={styles.colIcon} /> Adresse
          </h3>
          <address className={styles.address}>
            {ESTABLISHMENT.name.value}
            <br />
            {address.line}
            <br />
            {address.city}, {address.country}
          </address>
          <a className={styles.link} href={MAPS_HREF} target="_blank" rel="noopener noreferrer">
            Ouvrir dans Google Maps<span className="sr-only"> (nouvel onglet)</span>
          </a>
        </section>

        <section aria-labelledby="f-horaires">
          <h3 id="f-horaires" className={styles.colTitle}>
            <ClockIcon className={styles.colIcon} /> Horaires
          </h3>
          {hours.length ? (
            <ul role="list" className={styles.list}>
              {hours.map((h) => (
                <li key={h.days + h.hours}>
                  {h.days} · {h.hours} {IS_DEMO ? <ProvenanceBadge status={h.status} /> : null}
                </li>
              ))}
            </ul>
          ) : null}
          <p className={styles.muted}>
            {hours.length ? "Affectation aux activités en cours de confirmation." : "Horaires communiqués sur WhatsApp, en attente de validation."}
          </p>
        </section>

        <nav aria-labelledby="f-nav">
          <h3 id="f-nav" className={styles.colTitle}>
            Navigation
          </h3>
          <ul role="list" className={styles.list}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/soins/reservation" className={styles.link}>
                Demander un rendez-vous
              </Link>
            </li>
          </ul>
        </nav>

        <section aria-labelledby="f-infos">
          <h3 id="f-infos" className={styles.colTitle}>
            Informations
          </h3>
          <ul role="list" className={styles.list}>
            <li>
              <Link href="/mentions-legales" className={styles.link}>
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className={styles.link}>
                Données personnelles
              </Link>
            </li>
            <li>
              <Link href="/compte" className={styles.link}>
                Suivi de commande
              </Link>
            </li>
            {socials.map((s) => (
              <li key={s.network}>
                <a href={s.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                  {s.network}
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>{" "}
                {IS_DEMO ? <ProvenanceBadge status={s.status} /> : null}
              </li>
            ))}
            {PHONES.map((p) => (
              <li key={p.e164}>
                <a href={telHref(p.e164)} className={styles.link}>
                  Appeler le {p.display}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={`container ${styles.bottom}`}>
        <div className={styles.plaque}>
          <BrandLogo width={112} />
        </div>
        <p className={styles.copy}>
          © {new Date().getFullYear()} {ESTABLISHMENT.name.value}
          {IS_DEMO ? <span className={styles.demo}> · Prototype — contenus de démonstration signalés</span> : null}
        </p>
      </div>
    </footer>
  );
}
