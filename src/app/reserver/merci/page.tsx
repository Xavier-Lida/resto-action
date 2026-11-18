import type { Metadata } from "next";
import PageMerciFondateur from "@/components/PageMerciFondateur";
import { FR } from "@/lib/textes/fr";

/* La mise en service passe de 750 $ à 1 500 $ le 19 déc. à 0 h (heure de Montréal) :
   la page se régénère toutes les 5 minutes, sans redéploiement. */
export const revalidate = 300;

// Une page de confirmation n'a rien à faire dans Google.
export const metadata: Metadata = {
  title: FR.reservation.merci.metaTitre,
  robots: { index: false, follow: false },
};

export default function Merci() {
  return <PageMerciFondateur t={FR} />;
}
