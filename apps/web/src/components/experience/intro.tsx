import { BrandLogo } from "@/components/layout/brand-logo";
import styles from "./intro.module.css";

/**
 * Rideau d'ouverture (une fois par session, ≈ 1,9 s). Entièrement en CSS : un script en ligne décide avant le premier
 * affichage, l'animation se termine seule (même sans JavaScript hydraté), le contenu est déjà peint dessous (le
 * LCP n'attend pas) et le rideau ne bloque aucun clic. Jamais affiché si l'on préfère moins d'animations.
 */
const decide = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('para.intro')){document.documentElement.setAttribute('data-intro','');sessionStorage.setItem('para.intro','1')}}catch(e){}`;

export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: decide }} />
      <div className={styles.curtain} aria-hidden="true">
        <div className={styles.center}>
          <div className={styles.logo}>
            <BrandLogo width={200} priority />
          </div>
          <span className={styles.line} />
          <p className={styles.caption}>Abidjan · Galerie marchande de l&apos;Hôtel Palm Club</p>
        </div>
      </div>
    </>
  );
}
