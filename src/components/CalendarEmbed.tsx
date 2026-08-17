"use client";

import { useState } from "react";
import Buoy from "@/components/Buoy";
import { BOOKING_EMBED_URL } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

export default function CalendarEmbed({ t }: { t: Textes }) {
  const [loaded, setLoaded] = useState(false);

  return (
    // L'en-tête Google (avatar, titre, meta) est rogné : l'iframe est plus
    // haute que la fenêtre et remontée, seule la carte de sélection se voit.
    <div className="relative h-[520px] overflow-hidden rounded-3xl bg-white shadow-xl">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white">
          <Buoy className="w-16 animate-[spin_3s_linear_infinite]" />
          <p className="text-sm font-bold text-ink/60">{t.agenda.chargement}</p>
        </div>
      )}
      <iframe
        src={BOOKING_EMBED_URL}
        title={t.agenda.titreIframe}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="-mt-[212px] h-[760px] w-full border-0"
      />
    </div>
  );
}
