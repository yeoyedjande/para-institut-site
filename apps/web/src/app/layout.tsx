import type { Metadata, Viewport } from "next";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-context";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CONTENT_MODE, SITE_URL } from "@/lib/content-mode";
import { buildSearchIndex } from "@/lib/search-index";
import { localBusinessJsonLd } from "@/lib/structured-data";
import "./globals.css";

const description =
  "Para Institut du Palm Club : institut de détente et de beauté et parapharmacie, dans la galerie marchande de l'Hôtel Palm Club à Abidjan.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Para Institut du Palm Club — Institut de beauté & parapharmacie à Abidjan", template: "%s · Para Institut du Palm Club" },
  description,
  applicationName: "Para Institut",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: "Para Institut du Palm Club",
    title: "Para Institut du Palm Club",
    description,
    images: [{ url: "/brand/logo_para.jpg", width: 1418, height: 1072, alt: "Para-Institut Palm Club" }],
  },
  twitter: { card: "summary_large_image", title: "Para Institut du Palm Club", description, images: ["/brand/logo_para.jpg"] },
  // Le prototype n'est jamais indexé ; seule une mise en production explicite l'autorise.
  robots: CONTENT_MODE === "production" ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#009a96",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        {/* Seules les polices du premier écran sont préchargées ; l'italique arrive à la demande. */}
        <link rel="preload" href="/fonts/bodoni-moda-latin-var.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/jost-latin-var.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <CartProvider>
          <SiteHeader searchIndex={buildSearchIndex()} />
          <main id="contenu" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
