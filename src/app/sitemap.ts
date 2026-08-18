import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PAIRES, type Paire } from "@/lib/routes";

/* Le plan du site, DÉDUIT du registre des routes.

   Il tenait sa propre liste de chemins, en double avec celle des balises
   hreflang : ajouter une page demandait de penser aux deux endroits, et
   oublier celui-ci ne casse rien de visible — la page manque simplement au
   plan, et personne ne s'en aperçoit avant des mois. Une paire ajoutée à
   src/lib/routes.ts apparaît maintenant ici toute seule.

   Chaque page bilingue produit DEUX entrées annonçant la même table de
   langues : c'est `alternates.languages` qui dit à Google que ce ne sont pas
   deux pages concurrentes mais la même dans deux langues. */

/* La racine s'écrit « / » dans le registre (une balise hreflang exige un
   chemin), mais l'URL du site s'écrit sans barre finale — c'est la forme que
   déclare la canonique, et le plan du site doit dire exactement la même chose
   qu'elle. */
const absolu = (chemin: string) =>
  `${SITE_URL}${chemin === "/" ? "" : chemin}`;

const absolus = ({ fr, en }: Paire) => ({
  "fr-CA": absolu(fr),
  "en-CA": absolu(en),
});

export default function sitemap(): MetadataRoute.Sitemap {
  const maintenant = new Date();

  return PAIRES.flatMap((paire) => {
    const languages = absolus(paire);
    const commun = {
      lastModified: maintenant,
      changeFrequency: paire.frequence,
      priority: paire.priorite,
      alternates: { languages },
    };
    return [
      { url: absolu(paire.fr), ...commun },
      { url: absolu(paire.en), ...commun },
    ];
  });
}
