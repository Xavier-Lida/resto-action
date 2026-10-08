"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Search, X } from "lucide-react";
import { RESERVATION_URL } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* « TROUVE TON RESTO » → L'APERÇU DE SON APP.

   Le resto tape son nom. Une courte génération (les trois étapes se cochent)
   puis un téléphone montre SON app : son nom, la couleur qu'il choisit, un menu
   et des points d'exemple. Rien n'est envoyé nulle part : tout se passe dans le
   navigateur. Le nom suit ensuite les boutons (paramètre `resto`), pour la
   réservation ou l'appel.

   Version suivante : la note Google et les photos du resto, par l'API Places. */

const COULEURS = ["#ff3008", "#1f6b45", "#1d4ed8", "#191919"];
const GENERATION = 1800;

export default function GenerateurApp({ t }: { t: Textes }) {
  const g = t.hero.generateur;
  const [nom, setNom] = useState("");
  const [etat, setEtat] = useState<"ferme" | "generation" | "apercu">("ferme");
  const [couleur, setCouleur] = useState(COULEURS[0]);
  const fermer = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (etat !== "generation") return;
    const minuterie = setTimeout(() => setEtat("apercu"), GENERATION);
    return () => clearTimeout(minuterie);
  }, [etat]);

  useEffect(() => {
    if (etat === "ferme") return;
    fermer.current?.focus();
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEtat("ferme");
    };
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [etat]);

  const nomPropre = nom.trim();
  const avecNom = (modele: string) => modele.replace("{nom}", nomPropre);
  const parametre = `resto=${encodeURIComponent(nomPropre)}`;
  const base = RESERVATION_URL ?? `${t.racine}/contact`;
  const reserver = `${base}${base.includes("?") ? "&" : "?"}${parametre}`;

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (nomPropre) setEtat("generation");
        }}
        className="animate-hero delay-2 flex max-w-xl flex-wrap gap-2 rounded-2xl bg-white p-2"
      >
        <label htmlFor="hero-resto" className="sr-only">
          {t.hero.recherche.libelle}
        </label>
        <input
          id="hero-resto"
          name="resto"
          type="text"
          autoComplete="organization"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder={t.hero.recherche.exemple}
          className="min-w-0 flex-1 basis-56 bg-transparent px-3 py-3 text-base text-ink outline-none placeholder:text-ink/50"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-black text-white transition hover:bg-ink active:scale-95"
        >
          <Search className="size-4" aria-hidden="true" />
          {t.hero.recherche.bouton}
        </button>
      </form>

      {etat !== "ferme" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm md:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="apercu-titre"
            className="calc-entre relative grid w-full max-w-4xl items-center gap-8 rounded-[2rem] bg-white p-6 text-ink shadow-2xl md:grid-cols-[minmax(0,1fr)_auto] md:p-10"
          >
            <button
              ref={fermer}
              type="button"
              onClick={() => setEtat("ferme")}
              aria-label={g.fermer}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-bone transition hover:bg-ink hover:text-white"
            >
              <X className="size-5" />
            </button>

            {etat === "generation" ? (
              <div>
                <p id="apercu-titre" className="font-display text-2xl font-black md:text-3xl">
                  {avecNom(g.enCours)}
                </p>
                <ul className="mt-6 grid list-none gap-3">
                  {g.etapes.map((etape, i) => (
                    <li
                      key={etape}
                      style={{ animationDelay: `${0.2 + i * 0.5}s` }}
                      className="calc-entre flex items-center gap-3 font-bold"
                    >
                      <span className="grid size-7 place-items-center rounded-full bg-brand text-white">
                        <Check className="size-4" aria-hidden="true" />
                      </span>
                      {etape}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h2 id="apercu-titre" className="font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
                  {avecNom(g.titre)}
                </h2>
                <p className="mt-4 leading-relaxed text-ink/70">{g.texte}</p>

                <p className="mt-6 text-sm font-bold">{g.couleur}</p>
                <div className="mt-2 flex gap-2">
                  {COULEURS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCouleur(c)}
                      aria-label={c}
                      aria-pressed={couleur === c}
                      className={`size-10 rounded-full ring-offset-2 transition ${
                        couleur === c ? "ring-2 ring-ink" : "hover:scale-110"
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    href={reserver}
                    className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                  >
                    {avecNom(g.reserver)}
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </a>
                  <Link
                    href={`${t.racine}/contact?${parametre}`}
                    className="font-bold underline underline-offset-4 hover:text-brand"
                  >
                    {t.hero.pasPret}
                  </Link>
                </div>
                <p className="mt-6 text-xs text-ink/50">{g.note}</p>
              </div>
            )}

            {/* Le téléphone : squelette pendant la génération, l'app ensuite. */}
            <div className="mx-auto w-[16rem] rounded-[2.6rem] bg-ink p-2.5 shadow-2xl">
              <div className="flex h-[30rem] flex-col overflow-hidden rounded-[2rem] bg-white">
                {etat === "generation" ? (
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="h-24 animate-pulse rounded-2xl bg-bone" />
                    <div className="h-8 animate-pulse rounded-full bg-bone" />
                    <div className="h-14 animate-pulse rounded-xl bg-bone" />
                    <div className="h-14 animate-pulse rounded-xl bg-bone" />
                    <div className="h-14 animate-pulse rounded-xl bg-bone" />
                  </div>
                ) : (
                  <>
                    <div
                      className="px-4 pb-4 pt-8 text-white transition-colors duration-500"
                      style={{ background: couleur }}
                    >
                      <p className="text-xs font-bold opacity-85">{g.bienvenue}</p>
                      <p className="font-display text-xl font-black leading-tight">
                        {nomPropre}
                      </p>
                    </div>
                    <div className="flex gap-1.5 px-3 pt-3">
                      <span className="flex-1 rounded-full bg-ink py-2 text-center text-xs font-bold text-white">
                        {g.livraison}
                      </span>
                      <span className="flex-1 rounded-full bg-bone py-2 text-center text-xs font-bold">
                        {g.cueillette}
                      </span>
                    </div>
                    <p
                      className="mx-3 mt-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors duration-500"
                      style={{ background: `${couleur}1a`, color: couleur }}
                    >
                      {g.points}
                    </p>
                    <ul className="mt-3 grid list-none gap-2.5 px-3">
                      {g.plats.map((plat, i) => (
                        <li
                          key={plat.nom}
                          style={{ animationDelay: `${0.15 + i * 0.15}s` }}
                          className="calc-entre flex items-center gap-2.5"
                        >
                          <span className="size-12 shrink-0 rounded-lg bg-bone" />
                          <span className="flex-1">
                            <span className="block text-xs font-black">{plat.nom}</span>
                            <span className="block text-xs text-ink/55">{plat.prix}</span>
                          </span>
                          <span
                            className="grid size-7 place-items-center rounded-full font-black text-white transition-colors duration-500"
                            style={{ background: couleur }}
                          >
                            +
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex justify-around bg-ink px-2 pb-4 pt-3 text-[0.65rem] font-bold text-white">
                      {g.onglets.map((o) => (
                        <span key={o}>{o}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
