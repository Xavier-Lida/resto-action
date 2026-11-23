"use client";

import { useState } from "react";

/* L'AVANT ET L'APRÈS, AVEC UN CURSEUR POUR COMPARER.

   L'après est dessous, l'avant est posé dessus et découpé à la position du
   curseur. Le curseur est un vrai `<input type="range">`, transparent, étendu
   sur toute l'image : il marche au doigt, à la souris et au clavier, et un
   lecteur d'écran l'annonce. Les 2 images sont des aperçus de taille réduite. */
export default function CurseurAvantApres({
  avant,
  apres,
  libelles,
}: {
  avant: string;
  apres: string;
  libelles: { avant: string; apres: string; curseur: string };
}) {
  const [position, setPosition] = useState(50);
  return (
    <div className="relative mx-auto min-h-48 w-full max-w-md select-none overflow-hidden rounded-[1.5rem] bg-white/60">
      {/* Des images privées, servies par nos routes avec le jeton du visiteur : pas d'optimiseur d'images ici. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={apres} alt={libelles.apres} className="block h-auto w-full" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avant}
        alt={libelles.avant}
        className="absolute inset-0 size-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        draggable={false}
      />
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-black text-white">
        {libelles.avant}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-black text-white">
        {libelles.apres}
      </span>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${position}%` }}>
        <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-lg">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={libelles.curseur}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
