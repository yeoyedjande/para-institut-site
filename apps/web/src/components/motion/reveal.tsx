"use client";

import { type CSSProperties, type ElementType, type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Révélation à l'entrée dans l'écran (IntersectionObserver). Le contenu est présent et lisible sans
 * JavaScript : l'état masqué n'est appliqué qu'une fois le script hydraté (attribut data-reveal), et
 * jamais si l'utilisateur préfère réduire les animations (voir globals.css).
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  variant = "rise",
  once = true,
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "rise" | "fade" | "mask" | "line";
  once?: boolean;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Déjà visible au chargement : pas d'état masqué (évite un clignotement et ne retarde pas le LCP)
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setState("shown");
      if (once) return;
    } else {
      setState("hidden");
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("shown");
          if (once) observer.disconnect();
        } else if (!once) {
          setState("hidden");
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={variant}
      data-state={state}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
