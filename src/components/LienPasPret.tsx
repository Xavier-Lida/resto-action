"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Agenda from "@/components/Agenda";
import type { Textes } from "@/lib/textes/fr";

/* « PAS ENCORE PRÊT ? » : L'AGENDA, SUR PLACE.

   On n'affiche plus « appel gratuit » à côté du bouton Réserver : ça faisait
   concurrence au bouton et ça donnait au visiteur une porte de sortie avant
   même qu'il hésite. Le lien dit seulement « Pas encore prêt ? ». Celui qui
   clique, lui, hésite pour vrai : on lui ouvre l'agenda de Guillaume dans une
   fenêtre (le même composant que /contact), sans changer de page.

   L'agenda ne se charge qu'à l'ouverture : rien n'est demandé à Google tant
   que personne ne clique. */
export default function LienPasPret({
  t,
  libelle,
  className = "",
}: {
  t: Textes;
  libelle: string;
  className?: string;
}) {
  const [ouvert, setOuvert] = useState(false);
  const fermer = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    fermer.current?.focus();
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    window.addEventListener("keydown", echap);
    // La page derrière ne défile plus pendant que la fenêtre est ouverte.
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", echap);
      document.body.style.overflow = avant;
    };
  }, [ouvert]);

  return (
    <>
      <button type="button" onClick={() => setOuvert(true)} className={className}>
        {libelle}
      </button>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm md:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOuvert(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="appel-titre"
            className="calc-entre relative w-full max-w-3xl rounded-[2rem] bg-white p-6 text-left text-ink shadow-2xl md:p-10"
          >
            <button
              ref={fermer}
              type="button"
              onClick={() => setOuvert(false)}
              aria-label={t.hero.appel.fermer}
              className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-bone transition hover:bg-ink hover:text-white"
            >
              <X className="size-5" />
            </button>
            <h2 id="appel-titre" className="pr-12 font-display text-2xl font-black leading-tight tracking-tight md:text-4xl">
              {t.hero.appel.titre}
            </h2>
            <p className="mt-3 text-lg text-ink/70">{t.hero.appel.texte}</p>
            <div className="mt-8">
              <Agenda t={t} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
