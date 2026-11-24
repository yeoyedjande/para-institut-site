import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Back-office · Para Institut", template: "%s · Back-office Para Institut" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <div className="shell">
          <aside className="sidebar">
            <Link href="/" className="brand" aria-label="Back-office Para Institut — tableau de bord">
              <Image src="/brand/logo_para.jpg" alt="Para-Institut Palm Club" width={1418} height={1072} style={{ width: 72, height: "auto" }} priority />
              <span>Back-office</span>
            </Link>
            <AdminNav />
          </aside>
          <main id="contenu" className="main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
