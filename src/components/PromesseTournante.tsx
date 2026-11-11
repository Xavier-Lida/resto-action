"use client";

import { useEffect, useState } from "react";

/* « Commence à vendre plus en ligne / avoir plus de clients / sauver sur
   chaque commande. » Une partie fixe, une partie qui roule, et trois petites
   barres qui disent laquelle on lit.

   Les trois variantes sont empilées dans la même case de grille : la case
   prend la hauteur de la plus longue, donc rien ne saute quand ça tourne. Le
   serveur rend la première ; sans JavaScript ou en mouvement réduit, elle
   reste. */

const POSE = 2600;

export default function PromesseTournante({ fixe, variantes }: { fixe: string; variantes: string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((k) => (k + 1) % variantes.length), POSE);
    return () => clearInterval(t);
  }, [variantes.length]);

  return (
    <div>
      <p className="font-display text-4xl font-black leading-[1.05] tracking-tight xl:text-6xl">
        <span className="block">{fixe}</span>
        <span className="grid" aria-live="polite">
          {variantes.map((v, k) => (
            <span
              key={v}
              aria-hidden={k !== i}
              className={`[grid-area:1/1] bg-gradient-to-r from-brand via-[#ff6a3d] to-[#ffb36b] bg-clip-text pb-1 text-transparent transition-all duration-500 ease-out motion-reduce:transition-none ${
                k === i ? "translate-y-0 opacity-100 blur-0" : k === (i + variantes.length - 1) % variantes.length ? "-translate-y-6 opacity-0 blur-sm" : "translate-y-6 opacity-0 blur-sm"
              }`}
            >
              {v}
            </span>
          ))}
        </span>
      </p>
      <div className="mt-7 flex gap-2" aria-hidden="true">
        {variantes.map((v, k) => (
          <span key={v} className="relative h-1 w-14 overflow-hidden rounded-full bg-white/15">
            <span
              className={`absolute inset-y-0 left-0 rounded-full bg-ciel shadow-[0_0_10px_rgba(25,211,240,0.8)] ${k === i ? "w-full transition-[width] ease-linear" : "w-0"}`}
              style={k === i ? { transitionDuration: `${POSE}ms` } : undefined}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
