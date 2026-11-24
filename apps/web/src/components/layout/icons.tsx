/** Pictogrammes au trait fin, dessinés pour le projet (cohérents avec le filet du monogramme). */
type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const SearchIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);
export const UserIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" />
  </svg>
);
export const BagIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M5 8h14l-1 13H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const MenuIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M3 8h18M3 16h12" />
  </svg>
);
export const CloseIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
);
export const WhatsAppIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1Z" />
    <path d="M9.2 8.6c.2 2.8 2.9 5.6 6 6.1l1.1-1.4-1.9-1-.9.8a5 5 0 0 1-2.6-2.6l.8-.9-1-1.9-1.5 1Z" />
  </svg>
);
export const PinIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const ClockIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
/** Fronde de palme au trait — écho de la palme du monogramme « PI ». */
export const FrondIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
    <path d="M10 58C24 44 34 28 40 6" />
    <path d="M16 51c-2-8-1-15 3-21M21 45c1-9 4-16 9-21M26 38c3-8 7-13 12-17M31 31c4-6 9-10 14-12M35 23c4-4 9-7 14-8M38 15c4-3 8-4 12-4" />
    <path d="M16 51c7-1 14-4 19-9M21 45c8-2 14-6 18-12M26 38c7-3 12-8 15-13" />
  </svg>
);
