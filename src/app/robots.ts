import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// On laisse tout passer, y compris les robots d'IA (GPTBot, ClaudeBot,
// PerplexityBot…) : être cité par les moteurs génératifs fait partie de la
// stratégie d'acquisition.
//
// Sauf /tableau, le tableau de bord privé : il répond 401 à qui n'a pas le mot
// de passe, donc rien n'y est indexable de toute façon — l'exclure ici évite
// juste qu'un robot vienne cogner à la porte. Les liens courts /yt et /li
// restent ouverts : ils redirigent vers l'accueil, il n'y a rien à cacher.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/tableau" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
