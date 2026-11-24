import { Fragment, type CSSProperties, type ReactNode } from "react";

/**
 * Découpe un texte en lettres animables, rendues côté serveur (aucun clignotement à l'hydratation).
 * Les mots restent insécables ; le texte complet est porté par l'élément parent (aria-label).
 */
export function SplitChars({ text, start = 0, className }: { text: string; start?: number; className?: string }): ReactNode {
  let index = start;
  // L'espace reste hors du mot insécable (sinon il est absorbé par le bloc en ligne)
  return text.split(" ").map((word, w, words) => (
    <Fragment key={w}>
      <span className="split-word" aria-hidden="true">
        {Array.from(word).map((char, c) => (
          <span key={c} className={className} style={{ "--c": index++ } as CSSProperties}>
            {char}
          </span>
        ))}
      </span>
      {w < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

/** Découpe en mots (révélation mot à mot au défilement). */
export function SplitWords({ text, className }: { text: string; className?: string }): ReactNode {
  return text.split(" ").map((word, i) => (
    <span key={i} className={className} aria-hidden="true">
      {word}{" "}
    </span>
  ));
}
