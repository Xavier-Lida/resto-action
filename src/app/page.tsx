import type { Metadata } from "next";
import Accueil from "@/components/Accueil";
import { FR } from "@/lib/textes/fr";
import { ACCUEIL, hreflang } from "@/lib/routes";

/* Le canonique et l'Open Graph vivent ICI et non dans la mise en page : posés
   là-haut, ils seraient hérités par /en, qui se déclarerait alors comme une
   copie de la page française — Google l'ignorerait. */
export const metadata: Metadata = {
  title: FR.meta.titre,
  description: FR.meta.description,
  alternates: { canonical: "/", languages: hreflang(ACCUEIL) },
  openGraph: {
    type: "website",
    locale: FR.meta.ogLocale,
    alternateLocale: "en_CA",
    url: "/",
    siteName: "Resto Action",
    title: FR.meta.ogTitre,
    description: FR.meta.ogDescription,
  },
};

export default function Home() {
  return <Accueil t={FR} />;
}
