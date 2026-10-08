"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Phone, Sparkles } from "lucide-react";
import Agenda from "@/components/Agenda";
import FormulaireMaquette from "@/components/FormulaireMaquette";
import Modale from "@/components/Modale";
import { OUVRIR_PAS_PRET } from "@/lib/evenements";
import type { Textes } from "@/lib/textes/fr";

/* LA FENÊTRE « PAS ENCORE PRÊT? ».

   Elle attrape ceux qui allaient partir, SANS faire concurrence au bouton
   Réserver : elle n'existe qu'au clic sur « Pas encore prêt? ». Deux portes :
     la maquette gratuite (on la livre, et c'est en la livrant qu'on close) ;
     un appel avec Guillaume, qui choisit son heure dans l'agenda.

   Montée UNE fois par page. Les liens LienPasPret l'ouvrent par un événement. */

export default function ModalePasPret({ t }: { t: Textes }) {
  const h = t.hero.hesite;
  const [ouvert, setOuvert] = useState(false);
  const [choix, setChoix] = useState<"maquette" | "appel" | null>(null);

  useEffect(() => {
    const ouvrir = () => {
      setChoix(null);
      setOuvert(true);
    };
    window.addEventListener(OUVRIR_PAS_PRET, ouvrir);
    return () => window.removeEventListener(OUVRIR_PAS_PRET, ouvrir);
  }, []);

  return (
    <Modale ouvert={ouvert} onFermer={() => setOuvert(false)} etiquetteFermer={h.fermer} titreId="pas-pret-titre">
      {choix !== null && (
        <button
          type="button"
          onClick={() => setChoix(null)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-ink/60 hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {h.retour}
        </button>
      )}

      {choix === null && (
        <>
          <h2 id="pas-pret-titre" className="pr-12 font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
            {h.titre}
          </h2>
          <p className="mt-3 text-lg text-ink/70">{h.texte}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Porte icone={<Sparkles className="size-6" />} titre={h.maquette.titre} texte={h.maquette.texte} onClick={() => setChoix("maquette")} accent />
            <Porte icone={<Phone className="size-6" />} titre={h.appel.titre} texte={h.appel.texte} onClick={() => setChoix("appel")} />
          </div>
        </>
      )}

      {choix === "maquette" && <FormulaireMaquette t={t} demanderRestaurant titreId="pas-pret-titre" />}

      {choix === "appel" && (
        <>
          <h2 id="pas-pret-titre" className="pr-12 font-display text-2xl font-black leading-tight tracking-tight md:text-3xl">
            {h.appelTitre}
          </h2>
          <div className="mt-6">
            <Agenda t={t} />
          </div>
        </>
      )}
    </Modale>
  );
}

function Porte({
  icone,
  titre,
  texte,
  onClick,
  accent = false,
}: {
  icone: React.ReactNode;
  titre: string;
  texte: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-start gap-4 rounded-3xl p-6 text-left transition hover:-translate-y-1 ${
        accent ? "bg-brand text-white" : "bg-bone text-ink"
      }`}
    >
      <span className={`grid size-12 place-items-center rounded-full ${accent ? "bg-white text-brand" : "bg-white text-ink"}`}>
        {icone}
      </span>
      <span className="font-display text-xl font-black leading-tight">{titre}</span>
      <span className={accent ? "text-white/85" : "text-ink/65"}>{texte}</span>
      <ArrowRight className="mt-auto size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </button>
  );
}
