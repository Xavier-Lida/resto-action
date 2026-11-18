import type { Metadata } from "next";
import AccueilLancement from "@/components/lancement/AccueilLancement";
import { HERO, NOM_OFFRE } from "@/lib/contenu/grand-lancement.en";
import { EN } from "@/lib/textes/en";
import { ACCUEIL, hreflang } from "@/lib/routes";

/* La mise en service passe de 750 $ à 1 500 $ le 19 déc. à 0 h (heure de Montréal) :
   la page se régénère toutes les 5 minutes, sans redéploiement. */
export const revalidate = 300;

/* La version anglaise de l'accueil du Grand Lancement. Même composant que la
   française; le contenu vient de grand-lancement.en.ts.

   Le titre est donné en entier plutôt que par le gabarit « %s | Resto Action »
   de la mise en page : celui-ci le suffixerait deux fois. */
export const metadata: Metadata = {
  title: { absolute: `Resto Action | ${NOM_OFFRE}: ${HERO.h1}` },
  description: HERO.sousTitre,
  alternates: { canonical: "/en", languages: hreflang(ACCUEIL) },
  openGraph: {
    type: "website",
    locale: EN.meta.ogLocale,
    alternateLocale: "fr_CA",
    url: "/en",
    siteName: "Resto Action",
    title: `${NOM_OFFRE} | Resto Action`,
    description: HERO.sousTitre,
  },
};

export default function HomeEn() {
  return <AccueilLancement t={EN} />;
}
