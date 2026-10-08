"use client";

import { OUVRIR_PAS_PRET } from "@/lib/evenements";

/* « PAS ENCORE PRÊT? » : un simple lien sous chaque bouton Réserver.

   Il ne porte pas la fenêtre lui-même : il envoie un signal, et la SEULE
   fenêtre de la page (ModalePasPret, montée une fois) s'ouvre. Cinq liens ne
   veulent pas dire cinq copies du dictionnaire et de l'agenda dans la page. */
export default function LienPasPret({
  libelle,
  className = "",
}: {
  libelle: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OUVRIR_PAS_PRET))}
      className={className}
    >
      {libelle}
    </button>
  );
}
