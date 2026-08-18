import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* Chaque page bilingue est déclarée deux fois, et les deux entrées annoncent la
   même paire : `alternates.languages` est ce qui dit à Google que ce ne sont
   pas deux pages concurrentes mais la même dans deux langues. */
const langues = (cheminFr: string, cheminEn: string) => ({
  "fr-CA": `${SITE_URL}${cheminFr}`,
  "en-CA": `${SITE_URL}${cheminEn}`,
});

const ACCUEIL = langues("", "/en");
const CONTACT = langues("/contact", "/en/contact");

export default function sitemap(): MetadataRoute.Sitemap {
  const maintenant = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: maintenant,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: ACCUEIL },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: maintenant,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: ACCUEIL },
    },
    /* /contact vient juste après l'accueil : c'est là que mènent tous les
       boutons d'action du site, donc la page qu'on veut voir indexée en
       deuxième. */
    {
      url: `${SITE_URL}/contact`,
      lastModified: maintenant,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: CONTACT },
    },
    {
      url: `${SITE_URL}/en/contact`,
      lastModified: maintenant,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages: CONTACT },
    },
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified: maintenant,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
