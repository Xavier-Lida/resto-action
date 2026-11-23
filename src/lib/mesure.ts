import { sendGAEvent } from "@next/third-parties/google";
import { track } from "@vercel/analytics";

/* LA MESURE DU CALCUL 60 SECONDES : un seul point d'envoi.

   Les deux outils du site reçoivent le même événement :
     - Vercel Analytics, sans témoins, pour tout le monde ;
     - Google Analytics 4, seulement si le visiteur a accepté les témoins
       (gtag.js n'est dans la page qu'après « Accepter », voir BanniereTemoins).

   AUCUNE DONNÉE PERSONNELLE ICI : ni prénom, ni cellulaire, ni nom de resto.
   Les propriétés sont limitées par le type à la source de l'envoi.

   Ne lève jamais : une mesure bloquée ne doit rien casser. */
export type EvenementMesure =
  | "calcul_vu"
  | "calcul_touche"
  | "calcul_formulaire_commence"
  | "dossier_demande"
  | "calcul_envoi_echec"
  | "calcul_clic_reserver"
  | "calcul_clic_appel";

export type ProprietesMesure = { source?: "calcul-60" };

export function mesurer(nom: EvenementMesure, proprietes: ProprietesMesure = {}): void {
  if (typeof window === "undefined") return;
  try {
    track(nom, proprietes);
  } catch {
    // Vercel Analytics bloqué : on continue.
  }
  try {
    // Sans accord pour les témoins, gtag.js n'est pas là : on n'appelle rien.
    if (Array.isArray((window as unknown as { dataLayer?: unknown }).dataLayer)) {
      sendGAEvent("event", nom, proprietes);
    }
  } catch {
    // Google Analytics bloqué : on continue.
  }
}
