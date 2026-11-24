"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cx } from "./primitives";
import s from "./ui.module.css";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** "modal" : centrée ; "drawer" : panneau latéral droit. */
  variant?: "modal" | "drawer";
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Modale et tiroir accessibles fondés sur l'élément natif <dialog> : piège du focus, fermeture par Échap,
 * restitution du focus à l'élément déclencheur et arrière-plan inerte sont gérés par le navigateur.
 */
export function Sheet({ open, onClose, title, variant = "modal", children, footer }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx(s.dialog, variant === "drawer" && s.drawer)}
      aria-label={title}
      onClose={() => {
        document.documentElement.style.overflow = "";
        onClose();
      }}
      onClick={(event) => {
        // Clic sur l'arrière-plan (la cible est le <dialog> lui-même)
        if (event.target === ref.current) onClose();
      }}
    >
      <div className={s.dialogInner}>
        <header className={s.dialogHeader}>
          <h2 className={s.dialogTitle}>{title}</h2>
          <button type="button" className={s.close} onClick={onClose} aria-label="Fermer">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </header>
        <div className={s.dialogBody}>{children}</div>
        {footer ? <footer className={s.dialogFooter}>{footer}</footer> : null}
      </div>
    </dialog>
  );
}
