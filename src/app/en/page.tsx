import type { Metadata } from "next";
import Accueil from "@/components/Accueil";
import { EN } from "@/lib/textes/en";
import { LIENS_ALTERNES } from "@/lib/textes/alternances";

/* La version anglaise de la page d'accueil. Elle partage tout avec la
   française sauf son dictionnaire — voir src/components/Accueil.tsx.

   Le titre est donné en entier plutôt que par le gabarit « %s | Resto Action »
   de la mise en page : celui-ci le suffixerait deux fois. */
export const metadata: Metadata = {
  title: { absolute: EN.meta.titre },
  description: EN.meta.description,
  alternates: { canonical: "/en", languages: LIENS_ALTERNES },
  openGraph: {
    type: "website",
    locale: EN.meta.ogLocale,
    alternateLocale: "fr_CA",
    url: "/en",
    siteName: "Resto Action",
    title: EN.meta.ogTitre,
    description: EN.meta.ogDescription,
  },
};

export default function HomeEn() {
  return <Accueil t={EN} />;
}
