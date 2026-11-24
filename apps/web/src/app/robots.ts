import type { MetadataRoute } from "next";
import { CONTENT_MODE, SITE_URL } from "@/lib/content-mode";

export default function robots(): MetadataRoute.Robots {
  if (CONTENT_MODE !== "production") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/compte", "/design-system"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
