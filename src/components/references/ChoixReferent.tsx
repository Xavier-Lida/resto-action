"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";

/* LE CHOIX DU PROFIL de /refere-un-resto : deux grandes cartes côte à côte.
   On en choisit une, et sa partie de la page s'ouvre en dessous.

   Les cartes portent les ancres #resto et #partenaires : un lien vers
   /refere-un-resto#partenaires (le menu « Partenaires ») ouvre directement la
   bonne partie. L'adresse est lue comme un magasin externe (pas de setState
   dans un effet) ; un clic, lui, garde son propre état. */

type Choix = "resto" | "pro";

const sAbonner = (f: () => void) => {
  window.addEventListener("hashchange", f);
  return () => window.removeEventListener("hashchange", f);
};
const lireHash = () => window.location.hash;

export type Carte = {
  etiquette: string;
  qui?: string;
  montant: string;
  sousMontant: string;
  texte: string;
};

export default function ChoixReferent({
  titre,
  resto,
  pro,
  contenuResto,
  contenuPro,
  choisir,
  choisi,
}: {
  titre: string;
  resto: Carte;
  pro: Carte;
  contenuResto: ReactNode;
  contenuPro: ReactNode;
  choisir: string;
  choisi: string;
}) {
  const hash = useSyncExternalStore(sAbonner, lireHash, () => "");
  const [clic, setClic] = useState<Choix | null>(null);
  const deHash: Choix | null = hash === "#partenaires" ? "pro" : hash === "#resto" || hash === "#mon-lien" || hash === "#presente" ? "resto" : null;
  const choix = clic ?? deHash;
  const suite = useRef<HTMLDivElement>(null);

  function choisirCarte(c: Choix) {
    setClic(c);
    // La partie choisie s'ouvre juste dessous : on y glisse, doucement.
    requestAnimationFrame(() => suite.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const carte = (c: Choix, d: Carte) => {
    const actif = choix === c;
    const sombre = c === "pro";
    return (
      <button
        id={c === "resto" ? "resto" : "partenaires"}
        type="button"
        aria-pressed={actif}
        onClick={() => choisirCarte(c)}
        className={`group relative flex scroll-mt-28 flex-col overflow-hidden rounded-[2rem] p-7 text-left transition duration-300 md:p-9 ${
          sombre ? "bg-[#0a0e16] text-white" : "bg-bone text-ink"
        } ${actif ? (sombre ? "ring-4 ring-ciel" : "ring-4 ring-brand") : "ring-1 ring-ink/10 hover:-translate-y-1"} ${
          choix && !actif ? "opacity-60 hover:opacity-100" : ""
        }`}
      >
        {sombre && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_70%_at_100%_0%,black,transparent)]"
          />
        )}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-3xl ${sombre ? "bg-ciel/25" : "bg-brand/20"}`}
        />
        <span className="relative font-display text-2xl font-black">{d.etiquette}</span>
        {d.qui && <span className={`relative mt-1 text-sm ${sombre ? "text-white/60" : "text-ink/60"}`}>{d.qui}</span>}
        <span
          className={`relative mt-8 font-display text-6xl font-black leading-none tracking-tight md:text-7xl ${
            sombre ? "bg-gradient-to-r from-ciel to-[#8b8ff8] bg-clip-text text-transparent" : "text-brand"
          }`}
        >
          {d.montant}
        </span>
        <span className="relative mt-2 text-lg font-black">{d.sousMontant}</span>
        <span className={`relative mt-3 max-w-sm ${sombre ? "text-white/65" : "text-ink/65"}`}>{d.texte}</span>
        <span
          className={`relative mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 font-black transition ${
            actif ? (sombre ? "bg-ciel text-ink" : "bg-brand text-white") : sombre ? "bg-white text-ink" : "bg-ink text-white"
          }`}
        >
          {actif ? (
            <>
              <Check className="size-4" aria-hidden="true" />
              {choisi}
            </>
          ) : (
            <>
              {choisir}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </>
          )}
        </span>
      </button>
    );
  };

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <h2 className="text-center font-display text-3xl font-black tracking-tight md:text-4xl">{titre}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
            {carte("resto", resto)}
            {carte("pro", pro)}
          </div>
        </div>
      </section>
      <div ref={suite} className="scroll-mt-24">
        <div hidden={choix !== "resto"}>{contenuResto}</div>
        <div hidden={choix !== "pro"}>{contenuPro}</div>
      </div>
    </>
  );
}
