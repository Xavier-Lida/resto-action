"use client";

import { sendGAEvent } from "@next/third-parties/google";
import IconeYoutube from "@/components/IconeYoutube";
import { YOUTUBE_ABONNEMENT_URL } from "@/lib/site";

/* Le bouton de la section YouTube. Il n'est client QUE pour compter ses clics :
   la section existe pour amener des abonnés, et une fois le visiteur parti sur
   YouTube, plus rien ne nous dit qu'il est venu d'ici. Le clic est la dernière
   chose qu'on voit.

   Le lien reste un vrai lien : sans JavaScript, ou si la mesure est bloquée,
   il mène à la chaîne exactement pareil. */
export default function BoutonAbonnement({ libelle }: { libelle: string }) {
  return (
    <a
      href={YOUTUBE_ABONNEMENT_URL}
      target="_blank"
      rel="noopener"
      onClick={() => {
        try {
          sendGAEvent("event", "youtube_abonnement_clic");
        } catch {
          // Mesure bloquée : le lien s'ouvre quand même.
        }
      }}
      className="inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 text-lg font-black text-white transition hover:bg-ink active:scale-95"
    >
      <IconeYoutube className="size-6" />
      {libelle}
    </a>
  );
}
