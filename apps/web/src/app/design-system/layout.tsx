import { notFound } from "next/navigation";

/** Le design system n'est accessible qu'en développement. */
export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_DESIGN_SYSTEM !== "1") notFound();
  return children;
}

export const metadata = { robots: { index: false, follow: false } };
