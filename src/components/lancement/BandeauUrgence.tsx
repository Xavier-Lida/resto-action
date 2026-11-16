"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* LE BANDEAU ROUGE TOUT EN HAUT (16 nov.) : le compte à rebours jusqu'à la
   fin du Grand Lancement. Une vraie date (FIN_LANCEMENT_ISO), rien d'inventé :
   pas de « places restantes » tant qu'on ne les compte pas pour vrai.

   Avant que la page soit montée, on affiche des tirets (l'heure du serveur
   et celle du visiteur ne sont pas les mêmes). Après la date, il disparaît. */
const TEXTES = {
  fr: { avant: "Grand Lancement d'hiver", fin: "Fin dans", j: "j", h: "h", min: "min", s: "s", places: (n: number) => `${n} places par mois`, bouton: "Réserve ta place" },
  en: { avant: "Winter Grand Launch", fin: "Ends in", j: "d", h: "h", min: "min", s: "s", places: (n: number) => `${n} spots a month`, bouton: "Reserve your spot" },
};

function morceaux(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return { j: Math.floor(t / 86_400), h: Math.floor((t % 86_400) / 3_600), min: Math.floor((t % 3_600) / 60), s: t % 60 };
}

function Case({ v, u, cacheCell }: { v: string; u: string; cacheCell?: boolean }) {
  return (
    <span className={`items-baseline gap-0.5 rounded-md bg-white/15 px-1.5 py-0.5 tabular-nums ${cacheCell ? "hidden sm:inline-flex" : "inline-flex"}`}>
      <span className="font-black">{v}</span>
      <span className="text-[0.7em] font-bold text-white/75">{u}</span>
    </span>
  );
}

export default function BandeauUrgence({
  fin,
  places,
  href,
  langue = "fr",
}: {
  fin: string;
  places: number;
  href: string;
  langue?: "fr" | "en";
}) {
  const T = TEXTES[langue];
  const finMs = new Date(fin).getTime();
  const [maintenant, setMaintenant] = useState<number | null>(null);

  useEffect(() => {
    const tic = () => setMaintenant(Date.now());
    const premier = setTimeout(tic, 0);
    const minuteur = setInterval(tic, 1000);
    return () => {
      clearTimeout(premier);
      clearInterval(minuteur);
    };
  }, []);

  if (maintenant !== null && maintenant >= finMs) return null;
  const m = maintenant === null ? null : morceaux(finMs - maintenant);
  const deux = (n: number) => String(n).padStart(2, "0");

  return (
    <Link
      href={href}
      className="group relative z-[51] flex items-center justify-center gap-2 bg-brand px-3 py-2 text-[0.8rem] font-bold text-white sm:gap-3 sm:text-sm"
    >
      <span className="hidden font-black lg:inline">{T.avant}</span>
      <span className="hidden text-white/50 lg:inline" aria-hidden="true">·</span>
      <span className="whitespace-nowrap">{T.fin}</span>
      <span className="flex items-center gap-1" aria-live="off">
        <Case v={m ? String(m.j) : "--"} u={T.j} />
        <Case v={m ? deux(m.h) : "--"} u={T.h} />
        <Case v={m ? deux(m.min) : "--"} u={T.min} />
        <Case v={m ? deux(m.s) : "--"} u={T.s} />
      </span>
      <span className="hidden text-white/50 sm:inline" aria-hidden="true">·</span>
      <span className="hidden whitespace-nowrap sm:inline">{T.places(places)}</span>
      <span className="ml-1 hidden items-center gap-1 whitespace-nowrap font-black underline-offset-4 group-hover:underline md:inline-flex">
        {T.bouton}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
      <ArrowRight className="size-4 shrink-0 md:hidden" aria-hidden="true" />
    </Link>
  );
}
