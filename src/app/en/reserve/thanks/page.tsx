import type { Metadata } from "next";
import PageMerciFondateur from "@/components/PageMerciFondateur";
import { EN } from "@/lib/textes/en";

/* La mise en service passe de 750 $ à 1 500 $ le 19 déc. à 0 h (heure de Montréal) :
   la page se régénère toutes les 5 minutes, sans redéploiement. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: EN.reservation.merci.metaTitre,
  robots: { index: false, follow: false },
};

export default function Thanks() {
  return <PageMerciFondateur t={EN} />;
}
