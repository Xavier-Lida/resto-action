import type { Metadata } from "next";
import CadreCalcul from "@/components/lancement/CadreCalcul";
import Calcul60 from "@/components/lancement/Calcul60";
import { CALCUL_60 } from "@/lib/contenu/grand-lancement";

/* La mise en service passe de 750 $ à 1 500 $ le 19 déc. à 0 h (heure de Montréal) :
   la page se régénère toutes les 5 minutes, sans redéploiement. */
export const revalidate = 300;

/* LE CALCUL 60 SECONDES, SEUL SUR SA PAGE.

   Le même composant que sur l'accueil, sans rien autour : c'est le lien des
   annonces, des textos et des cartes. Pas indexée pour l'instant, et absente
   du plan du site. */
export const metadata: Metadata = {
  title: CALCUL_60.titre,
  description: CALCUL_60.sousTitre,
  robots: { index: false, follow: false },
};

export default function PageCalcul() {
  return (
    <CadreCalcul>
      <Calcul60 ligneMise={CALCUL_60.ligneMise} seul />
    </CadreCalcul>
  );
}
