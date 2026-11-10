"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import Reveal from "@/components/Reveal";
import { Surtitre } from "@/components/lancement/ui";
import type { Piece } from "@/lib/contenu/grand-lancement";
import { contenuLancement, type Langue } from "@/lib/contenu/lancement";
import { formats } from "@/lib/format";

/* TOUT CE QUI EST INCLUS, ÉTAPE PAR ÉTAPE (bloc 6, avec qui on est et la
   rareté).

   Avant, c'était 19 noms de pièces dans des accordéons, et une frise à part :
   trop compliqué. Maintenant, une seule chose : les 5 moments du lancement.
   On en voit un à la fois. Pour chacun : ce qui se passe, ce que TOI tu fais
   (presque rien, c'est le message), et les pièces que tu reçois à ce
   moment-là, en une phrase claire. Le nom de la pièce passe en petit, avec
   un lien vers sa page quand elle en a une. */

function etapesDe(langue: Langue) {
  const { ETAPES_INCLUS, bonusDisponibles, piecesDisponibles } = contenuLancement(langue);
  const toutes: Record<string, Piece> = Object.fromEntries(
    [...piecesDisponibles().flatMap((g) => g.pieces), ...bonusDisponibles()].map((p) => [p.id, p]),
  );
  return ETAPES_INCLUS.etapes.map((e) => ({
    ...e,
    pieces: e.pieces.map((id) => toutes[id]).filter((p): p is Piece => Boolean(p)),
  }));
}

const TEXTES = {
  fr: { surtitre: "Comment ça marche", aria: "Les étapes du lancement", etape: (i: number, n: number) => `Étape ${i} sur ${n}`, toi: "Ce que tu fais, toi", nous: "Ce qu'on fait pour toi", retour: "Retour", suivante: "Étape suivante :", reserve: "Réserve ta place" },
  en: { surtitre: "How it works", aria: "The launch steps", etape: (i: number, n: number) => `Step ${i} of ${n}`, toi: "What you do", nous: "What we do for you", retour: "Back", suivante: "Next step:", reserve: "Reserve your spot" },
};

export default function EtapesInclus({ langue = "fr" }: { langue?: Langue }) {
  const { ANCRES, ETAPES_INCLUS, PAGE_DE_PIECE, lienReservation } = contenuLancement(langue);
  const { typo: fr } = formats(langue);
  const T = TEXTES[langue];
  const ETAPES = etapesDe(langue);
  const TOTAL = ETAPES.reduce((n, e) => n + e.pieces.length, 0);
  const [i, setI_] = useState(0);
  const haut = useRef<HTMLOListElement>(null);
  // En changeant d'étape depuis le bas du panneau (au cellulaire), on remonte
  // au début de l'étape pour ne pas tomber au milieu de la liste.
  const setI = (k: number) => {
    setI_(k);
    const el = haut.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const e = ETAPES[i];
  const derniere = i === ETAPES.length - 1;

  return (
    <section id={ANCRES.commentCaMarche.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="rounded-[2rem] bg-bone lg:rounded-[3rem]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <Reveal>
            <Surtitre>{T.surtitre}</Surtitre>
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
              {fr(ETAPES_INCLUS.titre)}
            </h2>
            <p className="mt-3 text-lg text-ink/65">{fr(ETAPES_INCLUS.sousTitre.replace("{n}", String(TOTAL)))}</p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-8">
            {/* Les 5 moments. Au cellulaire, une rangée qui défile; à l'ordi, une colonne. */}
            <ol
              ref={haut}
              role="tablist"
              aria-label={T.aria}
              className="grid scroll-mt-28 list-none grid-cols-5 gap-2 lg:flex lg:flex-col"
            >
              {ETAPES.map((etape, k) => {
                const actif = k === i;
                const fait = k < i;
                return (
                  <li key={etape.quand}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={actif}
                      onClick={() => setI(k)}
                      aria-label={etape.quand}
                      className={`flex w-full items-center justify-center gap-3 rounded-2xl px-2 py-3 text-left transition-colors lg:justify-start lg:px-5 lg:py-4 ${
                        actif ? "bg-ink text-white" : "bg-white hover:bg-white/70"
                      }`}
                    >
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full font-display text-sm font-black ${
                          actif ? "bg-brand text-white" : fait ? "bg-ciel text-white" : "bg-bone text-ink"
                        }`}
                      >
                        {fait ? <Check className="size-4" aria-hidden="true" /> : k + 1}
                      </span>
                      {/* Au cellulaire, seulement le numéro : le nom de l'étape est dans le panneau. */}
                      <span className="hidden font-black lg:inline">{fr(etape.quand)}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Le moment choisi. La clé relance l'apparition à chaque étape. */}
            <div key={i} role="tabpanel" className="calc-entre rounded-[2rem] bg-white p-6 md:p-9">
              <p className="text-sm font-black uppercase tracking-widest text-brand">
                {T.etape(i + 1, ETAPES.length)} · {fr(e.quand)}
              </p>
              <h3 className="mt-3 font-display text-2xl font-black leading-tight tracking-tight md:text-4xl">{fr(e.titre)}</h3>

              <div className="mt-6 rounded-2xl bg-bone p-4 md:p-5">
                <p className="text-xs font-black uppercase tracking-widest text-ink/50">{T.toi}</p>
                <p className="mt-1 font-bold leading-relaxed">{fr(e.toi)}</p>
              </div>

              <p className="mt-7 text-xs font-black uppercase tracking-widest text-ink/50">{T.nous}</p>
              <ul className="mt-3 grid list-none gap-3">
                {e.pieces.map((p) => {
                  const page = PAGE_DE_PIECE[p.id];
                  return (
                    <li key={p.id} className="flex gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ciel text-white">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="leading-relaxed text-ink/85">{fr(p.ligne)}</p>
                        {page ? (
                          <Link href={page} className="mt-0.5 inline-flex items-center gap-1 text-sm font-black text-ink/50 hover:text-brand">
                            {fr(p.nom)}
                            <ArrowRight className="size-3.5" aria-hidden="true" />
                          </Link>
                        ) : (
                          <p className="mt-0.5 text-sm font-black text-ink/50">{fr(p.nom)}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-bone pt-6">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => setI(i - 1)}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 font-black text-ink/60 transition hover:bg-bone hover:text-ink"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    {T.retour}
                  </button>
                )}
                {derniere ? (
                  <BoutonReserver href={lienReservation()} libelle={T.reserve} />
                ) : (
                  <button
                    type="button"
                    onClick={() => setI(i + 1)}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-black text-white transition hover:bg-brand"
                  >
                    {T.suivante} {fr(ETAPES[i + 1].quand)}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
