"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle, RotateCcw, Star } from "lucide-react";
import Buoy from "@/components/Buoy";
import { RESERVATION_URL } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* LE CALCULATEUR ANIMÉ.

   Le resto règle ses commandes en ligne par mois et sa facture moyenne. Quand
   la section arrive à l'écran, trois petites scènes s'animent, dessinées comme
   de vrais écrans : sa liste de clients qui se remplit (et un graphique qui
   monte), des notifications de commandes qu'il n'aurait jamais eues, puis un
   texto automatique suivi d'avis Google. Dessous, le montant gardé par année
   et le gros bouton.

   LES CHIFFRES suivent les hypothèses écrites sous les cartes — tout
   changement ici doit s'y refléter :
     - plateformes : FRAIS_PLATEFORME de la facture ;
     - nous : ABONNEMENT par mois + COMMISSION de la facture ;
     - ventes en plus, trois leviers : HAUSSE_PANIER sur chaque facture
       (suggestions), PART_RELANCES de commandes en plus (textos, paniers
       récupérés), PART_GOOGLE de commandes en plus (nouveaux clients) ;
     - avis : 1 commande sur 20.
   Les noms, avis et montants qui défilent sont des exemples d'illustration. */

const FRAIS_PLATEFORME = 0.3;
const ABONNEMENT = 200;
const COMMISSION = 0.1;
const HAUSSE_PANIER = 0.05;
const PART_RELANCES = 1 / 20;
const PART_GOOGLE = 1 / 20;
const PART_AVIS = 1 / 20;

const PASTILLES = ["#ffd9cf", "#d7e9ff", "#d9f0e3", "#fff0bf"];
const initiales = (nom: string) =>
  nom
    .split(/\s+/)
    .map((m) => m[0])
    .join("")
    .slice(0, 2);

/* Un nombre qui roule de 0 à sa cible, après `delai` ms. Il repart à chaque
   nouvelle `cle` (rejouer) ou nouvelle cible (curseur). Mouvement réduit : la
   cible tout de suite. */
function useCompte(cible: number, cle: number, delai: number, actif: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!actif) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duree = reduit ? 0 : 1400;
    const debut = performance.now() + (reduit ? 0 : delai);
    let raf = 0;
    const pas = (maintenant: number) => {
      const p =
        duree === 0 ? 1 : Math.min(1, Math.max(0, (maintenant - debut) / duree));
      setV(Math.round(cible * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(pas);
    };
    raf = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(raf);
  }, [cible, cle, delai, actif]);
  return actif ? v : 0;
}

function Etoiles({ className = "size-3.5" }: { className?: string }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((k) => (
        <Star key={k} className={`${className} fill-[#f5b301] text-[#f5b301]`} />
      ))}
    </span>
  );
}

export default function Calculateur({ t }: { t: Textes }) {
  const c = t.calcul;
  const [commandes, setCommandes] = useState(100);
  const [facture, setFacture] = useState(30);
  const [cle, setCle] = useState(0);
  const [actif, setActif] = useState(false);
  const boite = useRef<HTMLDivElement>(null);

  // L'animation part la première fois que les scènes arrivent à l'écran.
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
  const ventesApp = commandesAn * facture;
  const leviers = [
    ventesApp * HAUSSE_PANIER,
    ventesApp * PART_RELANCES,
    ventesApp * PART_GOOGLE,
  ];
  const ventesEnPlus = leviers.reduce((a, b) => a + b, 0);
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
  const d = (s: number) => ({ animationDelay: `${s}s` });

  return (
    <section id="calcul" className="bg-bone">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <h2 className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
          {c.titre}
        </h2>
        <p className="mt-3 text-lg text-ink/70">{c.sousTitre}</p>

        {/* Les deux curseurs */}
        <div className="mt-10 grid gap-8 rounded-[2rem] bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
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

        {/* Les trois scènes. La `key` les remonte pour rejouer. */}
        <div ref={boite} key={cle} className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* 1. LA LISTE DE CLIENTS — un petit tableau de bord */}
          <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-ink p-7 text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand/25 blur-3xl"
            />
            <p className="text-xs font-black uppercase tracking-widest text-white/50">
              {c.liste.titre}
            </p>
            <p className="mt-3 font-display text-5xl font-black tabular-nums">
              {nombre.format(vListe)}
            </p>
            <p className="mt-1 text-sm text-white/60">{c.liste.unite}</p>

            <div className="mt-6 rounded-2xl bg-white/[0.07] p-3 ring-1 ring-white/10">
              <ul className="grid list-none gap-1.5">
                {actif &&
                  c.liste.noms.map((nom, i) => (
                    <li
                      key={nom}
                      style={d(0.3 + i * 0.35)}
                      className="calc-entre flex items-center gap-3 rounded-xl px-2 py-1.5"
                    >
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-black text-ink"
                        style={{ background: PASTILLES[i % PASTILLES.length] }}
                      >
                        {initiales(nom)}
                      </span>
                      <span className="flex-1 text-sm font-bold">{nom}</span>
                      <span className="rounded-full bg-brand/90 px-2 py-0.5 text-[0.7rem] font-black">
                        {c.liste.ajoute}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            <p className="mt-6 text-xs font-bold text-white/50">{c.liste.mois}</p>
            <div aria-hidden="true" className="mt-2 flex h-20 items-end gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <span
                  key={i}
                  style={{ height: `${((i + 1) / 12) * 100}%`, ...d(0.4 + i * 0.07) }}
                  className={`flex-1 rounded-t-md ${
                    i === 11 ? "bg-brand" : "bg-white/25"
                  } ${actif ? "calc-barre" : "scale-y-0"}`}
                />
              ))}
            </div>
          </div>

          {/* 2. LES VENTES EN PLUS — des notifications de commande */}
          <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-ink/50">
              {c.ventes.titre}
            </p>
            <p className="mt-3 font-display text-5xl font-black tabular-nums text-[#1f6b45]">
              {argent.format(vVentes)}
            </p>
            <p className="mt-1 text-sm text-ink/60">{c.ventes.unite}</p>

            <div className="mt-6 grid gap-2.5 rounded-[1.75rem] bg-gradient-to-b from-[#f4efe9] to-[#ece4da] p-3">
              {actif &&
                c.ventes.leviers.map(({ titre, detail }, k) => (
                  <div
                    key={titre}
                    style={d(1.3 + k * 0.5)}
                    className="calc-entre flex items-start gap-3 rounded-2xl bg-white/90 p-3 shadow-[0_6px_18px_-8px_rgb(25_25_25/0.35)] backdrop-blur"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-ink/10">
                      <Buoy className="w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-black">{titre}</span>
                        <span className="whitespace-nowrap text-sm font-black text-[#1f6b45]">
                          +{argent.format(leviers[k] ?? 0)} {c.ventes.parAn}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-ink/65">
                        {detail}
                      </span>
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* 3. LES AVIS GOOGLE — un texto, puis les avis qui entrent */}
          <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-ink/50">
              {c.avis.titre}
            </p>
            <p className="mt-3 flex items-center gap-3 font-display text-5xl font-black tabular-nums">
              +{nombre.format(vAvis)}
              <Etoiles className="size-5" />
            </p>
            <p className="mt-1 text-sm text-ink/60">{c.avis.unite}</p>

            {actif && (
              <div className="mt-6 grid gap-2.5">
                <div style={d(2.3)} className="calc-entre">
                  <p className="mb-1 flex items-center gap-1.5 text-[0.7rem] font-bold text-ink/45">
                    <MessageCircle className="size-3" aria-hidden="true" />
                    {c.avis.texto}
                  </p>
                  <p className="max-w-[92%] rounded-2xl rounded-bl-md bg-[#e9e9eb] px-3.5 py-2 text-sm leading-snug">
                    {c.avis.sms}
                  </p>
                </div>
                {c.avis.extraits.map((extrait, i) => {
                  const auteur = c.avis.auteurs[i] ?? "";
                  return (
                    <div
                      key={extrait}
                      style={d(2.9 + i * 0.45)}
                      className="calc-entre flex gap-3 rounded-2xl border border-ink/10 p-3"
                    >
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-black"
                        style={{ background: PASTILLES[(i + 1) % PASTILLES.length] }}
                      >
                        {initiales(auteur)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black">{auteur}</span>
                          <span className="text-[0.7rem] text-ink/45">{c.avis.quand}</span>
                        </span>
                        <span className="mt-0.5 block">
                          <Etoiles className="size-3" />
                        </span>
                        <span className="mt-1 block text-sm">{extrait}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Le résultat et le bouton */}
        <div className="relative mt-5 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] bg-hero p-8 text-white md:flex-row md:items-center md:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-10 size-72 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative">
            <p className="font-display text-5xl font-black tabular-nums md:text-7xl">
              {argent.format(vGarde)}
            </p>
            <p className="mt-2 font-semibold text-white/85">{c.garde}</p>
          </div>
          <div className="relative flex flex-col items-start gap-3">
            <a
              href={reserver}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-9 py-5 text-xl font-black text-ink shadow-[0_5px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
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
