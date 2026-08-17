import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* Les deux versions de l'accueil sont déclarées, et chacune annonce l'autre :
   `alternates.languages` est ce qui dit à Google que ce ne sont pas deux pages
   concurrentes mais la même dans deux langues. */
const LANGUES = {
  "fr-CA": SITE_URL,
  "en-CA": `${SITE_URL}/en`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: LANGUES },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: LANGUES },
    },
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
