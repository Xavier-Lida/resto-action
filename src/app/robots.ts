import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// On laisse tout passer, y compris les robots d'IA (GPTBot, ClaudeBot,
// PerplexityBot…) : être cité par les moteurs génératifs fait partie de la
// stratégie d'acquisition.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
