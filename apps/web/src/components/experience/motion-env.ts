/**
 * Environnement d'animation partagé. L'expérience enrichie (défilement fluide, scènes épinglées, 3D voyageuse)
 * n'est activée que si l'utilisateur n'a pas demandé moins d'animations.
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

export function isDesktop(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches;
}

/** Événements internes (découplage entre sections et scène 3D). */
export const EVENTS = {
  velocity: "para:velocity",
  texture: "para:texture",
  introDone: "para:intro-done",
} as const;

export type LenisLike = { scrollTo: (target: number | string | HTMLElement, options?: { offset?: number; duration?: number; immediate?: boolean }) => void };

export function getLenis(): LenisLike | undefined {
  return (window as Window & { __lenis?: LenisLike }).__lenis;
}

/** Défile vers une position absolue (Lenis si actif, sinon défilement natif). */
export function scrollToY(y: number) {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
