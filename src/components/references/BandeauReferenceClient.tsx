"use client";

import { useState, useSyncExternalStore } from "react";
import { TEMOIN_BANDEAU } from "@/lib/provenance";

type Lu = { type: string; nom: string } | null;

/* Le témoin se lit comme un « magasin externe » : pas de setState dans un
   effet, et rien au rendu serveur (le bandeau apparaît à l'hydratation). */
const sAbonner = () => () => {};

function lireBrut(): string {
  try {
    const paire = document.cookie.split("; ").find((c) => c.startsWith(`${TEMOIN_BANDEAU}=`));
    return paire ? paire.slice(TEMOIN_BANDEAU.length + 1) : "";
  } catch {
    return "";
  }
}

function decoder(brut: string): Lu {
  if (!brut) return null;
  try {
    const v = JSON.parse(decodeURIComponent(brut)) as { t?: unknown; n?: unknown };
    if (typeof v.n !== "string" || typeof v.t !== "string" || !v.n.trim()) return null;
    return { type: v.t, nom: v.n.trim().slice(0, 80) };
  } catch {
    return null;
  }
}

export default function BandeauReferenceClient({ bandeau, bonus, fermer }: { bandeau: string; bonus: string; fermer: string }) {
  const brut = useSyncExternalStore(sAbonner, lireBrut, () => "");
  const [ferme, setFerme] = useState(false);
  const lu = decoder(brut);
  if (!lu || ferme) return null;

  const remplir = (t: string) => t.replace("{referent}", lu.nom);

  return (
    <div className="relative z-[60] bg-ink text-white" role="status">
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-2.5 sm:items-center sm:px-6">
        <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ciel sm:mt-0" />
        <p className="flex-1 text-sm leading-snug">
          <span className="font-black">{remplir(bandeau)}</span>
          {lu.type === "client" ? (
            <>
              <span className="hidden text-white/50 sm:inline"> · </span>
              <span className="block text-white/75 sm:inline">{remplir(bonus)}</span>
            </>
          ) : null}
        </p>
        <button
          type="button"
          onClick={() => {
            setFerme(true);
            try {
              document.cookie = `${TEMOIN_BANDEAU}=; Max-Age=0; Path=/; SameSite=Lax`;
            } catch {
              // Rien à faire : le bandeau est fermé pour cette page.
            }
          }}
          className="-mr-1 shrink-0 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label={fermer}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
