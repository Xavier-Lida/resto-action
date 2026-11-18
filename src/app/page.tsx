import type { Metadata } from "next";
import AccueilLancement from "@/components/lancement/AccueilLancement";
import { HERO, NOM_OFFRE } from "@/lib/contenu/grand-lancement";
import { FR } from "@/lib/textes/fr";
import { ACCUEIL, hreflang } from "@/lib/routes";

/* La mise en service passe de 750 $ à 1 500 $ le 19 déc. à 0 h (heure de Montréal) :
   la page se régénère toutes les 5 minutes, sans redéploiement. */
export const revalidate = 300;

/* L'accueil français : le Grand Lancement d'hiver. Le canonique et l'Open
   Graph vivent ICI et non dans la mise en page : posés là-haut, ils seraient
   hérités par /en. */
export const metadata: Metadata = {
  title: `Resto Action | ${NOM_OFFRE} : ${HERO.h1}`,
  description: HERO.sousTitre,
  alternates: { canonical: "/", languages: hreflang(ACCUEIL) },
  openGraph: {
    type: "website",
    locale: FR.meta.ogLocale,
    alternateLocale: "en_CA",
    url: "/",
    siteName: "Resto Action",
    title: `${NOM_OFFRE} | Resto Action`,
    description: HERO.sousTitre,
  },
};

export default function Home() {
  return <AccueilLancement t={FR} />;
}
