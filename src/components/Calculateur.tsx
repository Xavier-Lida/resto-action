"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageSquare, RotateCcw, Star, UserPlus } from "lucide-react";
import { RESERVATION_URL } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* LE CALCULATEUR ANIMÉ.

   Le resto entre ses commandes en ligne par mois et sa facture moyenne. Quand
   la section arrive à l'écran, trois cartes s'animent : sa liste de clients qui
   grossit nom par nom, des ventes qu'il n'aurait jamais eues qui apparaissent,
   et des avis Google qui entrent après un texto. Dessous, le montant gardé par
   année, puis le gros bouton.

   LES CHIFFRES. Les mêmes hypothèses que la mention affichée sous les cartes —
   tout changement ici doit s'y refléter :
     - plateformes : FRAIS_PLATEFORME de la facture ;
     - nous : ABONNEMENT par mois + COMMISSION de la facture ;
     - ventes en plus : 1 commande sur 20 (rappel texto, panier récupéré) ;
     - avis : 1 commande sur 20.
   Les noms, montants et avis qui défilent sont des exemples d'illustration. */

const FRAIS_PLATEFORME = 0.3;
const ABONNEMENT = 200;
const COMMISSION = 0.1;
const PART_VENTES_EN_PLUS = 1 / 20;
const PART_AVIS = 1 / 20;

/* Un nombre qui roule de 0 à sa cible, sur `duree` ms, après `delai` ms. Il
   repart de 0 à chaque nouvelle `cle` (rejouer) ou nouvelle cible (curseur).
   Mouvement réduit : la cible tout de suite. */
function useCompte(cible: number, cle: number, delai: number, actif: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!actif) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duree = reduit ? 0 : 1400;
    const debut = performance.now() + (reduit ? 0 : delai);
    let raf = 0;
    const pas = (maintenant: number) => {
      const p = duree === 0 ? 1 : Math.min(1, Math.max(0, (maintenant - debut) / duree));
      setV(Math.round(cible * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(pas);
    };
    raf = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(raf);
  }, [cible, cle, delai, actif]);
  return actif ? v : 0;
}

export default function Calculateur({ t }: { t: Textes }) {
  const c = t.calcul;
  const [commandes, setCommandes] = useState(100);
  const [facture, setFacture] = useState(30);
  const [cle, setCle] = useState(0);
  const [actif, setActif] = useState(false);
  const boite = useRef<HTMLDivElement>(null);

  // L'animation part la première fois que les cartes arrivent à l'écran.
  useEffect(() => {
    const el = boite.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setActif(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const volume = commandes * facture;
  const garde = Math.max(
    0,
    12 * (volume * FRAIS_PLATEFORME - (ABONNEMENT + volume * COMMISSION)),
  );
  const commandesAn = commandes * 12;
  const ventesEnPlus = commandesAn * PART_VENTES_EN_PLUS * facture;
  const avisAn = Math.round(commandesAn * PART_AVIS);

  const argent = new Intl.NumberFormat(t.htmlLang, {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });
  const nombre = new Intl.NumberFormat(t.htmlLang);

  const vListe = useCompte(commandesAn, cle, 300, actif);
  const vVentes = useCompte(ventesEnPlus, cle, 1300, actif);
  const vAvis = useCompte(avisAn, cle, 2300, actif);
  const vGarde = useCompte(garde, cle, 3200, actif);

  const reserver = RESERVATION_URL ?? `${t.racine}/contact`;
  // Un délai d'apparition, en secondes, seulement une fois l'animation partie.
  const d = (s: number) => ({ animationDelay: `${s}s` });

  return (
    <section id="calcul" className="bg-bone">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <h2 className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
          {c.titre}
        </h2>
        <p className="mt-3 text-lg text-ink/70">{c.sousTitre}</p>

        {/* Les deux curseurs */}
        <div className="mt-10 grid gap-8 rounded-[2rem] bg-white p-6 md:grid-cols-2 md:p-8">
          <label className="flex flex-col gap-3">
            <span className="flex items-baseline justify-between gap-4 font-bold">
              {c.commandes}
              <span className="font-display text-2xl font-black text-brand">
                {nombre.format(commandes)}
              </span>
            </span>
            <input
              type="range"
              min={20}
              max={400}
              step={5}
              value={commandes}
              onChange={(e) => setCommandes(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </label>
          <label className="flex flex-col gap-3">
            <span className="flex items-baseline justify-between gap-4 font-bold">
              {c.facture}
              <span className="font-display text-2xl font-black text-brand">
                {argent.format(facture)}
              </span>
            </span>
            <input
              type="range"
              min={12}
              max={60}
              step={1}
              value={facture}
              onChange={(e) => setFacture(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </label>
        </div>

        {/* Les trois cartes animées. La `key` les remonte pour rejouer. */}
        <div ref={boite} key={cle} className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* 1. La liste de clients */}
          <div className="flex flex-col rounded-[2rem] bg-ink p-7 text-white">
            <p className="text-xs font-black uppercase tracking-widest text-white/50">
              {c.liste.titre}
            </p>
            <p className="mt-3 font-display text-5xl font-black tabular-nums">
              {nombre.format(vListe)}
            </p>
            <p className="mt-1 text-sm text-white/60">{c.liste.unite}</p>
            <ul className="mt-6 grid list-none gap-2">
              {actif &&
                c.liste.noms.map((nom, i) => (
                  <li
                    key={nom}
                    style={d(0.3 + i * 0.35)}
                    className="calc-entre flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2 text-sm"
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-brand">
                      <UserPlus className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="font-bold">{nom}</span>
                    <span className="text-white/60">{c.liste.ajoute}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* 2. Les ventes en plus */}
          <div className="flex flex-col rounded-[2rem] bg-white p-7">
            <p className="text-xs font-black uppercase tracking-widest text-ink/50">
              {c.ventes.titre}
            </p>
            <p className="mt-3 font-display text-5xl font-black tabular-nums text-[#1f6b45]">
              {argent.format(vVentes)}
            </p>
            <p className="mt-1 text-sm text-ink/60">{c.ventes.unite}</p>
            <ul className="mt-6 grid list-none gap-2">
              {actif &&
                c.ventes.evenements.map(({ texte, montant }, i) => (
                  <li
                    key={texte}
                    style={d(1.3 + i * 0.45)}
                    className="calc-entre flex items-center justify-between gap-3 rounded-xl bg-bone px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="size-4 text-brand" aria-hidden="true" />
                      {texte}
                    </span>
                    <span className="font-black text-[#1f6b45]">{montant}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* 3. Les avis Google */}
          <div className="flex flex-col rounded-[2rem] bg-white p-7">
            <p className="text-xs font-black uppercase tracking-widest text-ink/50">
              {c.avis.titre}
            </p>
            <p className="mt-3 flex items-center gap-2 font-display text-5xl font-black tabular-nums">
              {nombre.format(vAvis)}
              <Star className="size-8 fill-[#f5b301] text-[#f5b301]" aria-hidden="true" />
            </p>
            <p className="mt-1 text-sm text-ink/60">{c.avis.unite}</p>
            {actif && (
              <div className="mt-6 grid gap-2">
                <p
                  style={d(2.3)}
                  className="calc-entre max-w-[90%] rounded-2xl rounded-bl-sm bg-bone px-3 py-2 text-sm"
                >
                  {c.avis.sms}
                </p>
                {c.avis.extraits.map((extrait, i) => (
                  <div
                    key={extrait}
                    style={d(2.8 + i * 0.4)}
                    className="calc-entre rounded-xl border border-ink/10 px-3 py-2 text-sm"
                  >
                    <span className="flex gap-0.5" aria-label="5/5">
                      {[0, 1, 2, 3, 4].map((k) => (
                        <Star
                          key={k}
                          className="size-3.5 fill-[#f5b301] text-[#f5b301]"
                          aria-hidden="true"
                        />
                      ))}
                    </span>
                    <span className="mt-1 block font-semibold">« {extrait} »</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Le résultat et le bouton */}
        <div className="mt-5 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-hero p-8 text-white md:flex-row md:items-center md:p-10">
          <div>
            <p className="font-display text-4xl font-black tabular-nums md:text-6xl">
              {argent.format(vGarde)}
            </p>
            <p className="mt-2 font-semibold text-white/85">{c.garde}</p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <a
              href={reserver}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-black text-ink shadow-[0_5px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none md:text-xl"
            >
              {c.reserver}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              onClick={() => {
                setActif(true);
                setCle((k) => k + 1);
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-white/85 underline underline-offset-4 hover:text-white"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              {c.rejouer}
            </button>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-ink/55">
          {c.hypotheses}
        </p>
      </div>
    </section>
  );
}
