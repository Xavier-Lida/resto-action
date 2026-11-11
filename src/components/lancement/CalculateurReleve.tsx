"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Camera, Check, ChevronDown, FileText, Phone, Sparkles, Upload } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import ScoreResto, { FRAIS_PLANCHER, scoreDepuisFrais } from "@/components/lancement/ScoreResto";
import { BoutonContour, PointCiel, Surtitre } from "@/components/lancement/ui";
import { contenuLancement, type ContenuLancement, type Langue } from "@/lib/contenu/lancement";
import {
  HAUSSE_PRIX,
  HYPOTHESES_DEFAUT,
  PLATEFORMES,
  TAUX_CUEILLETTE_UBER_AJUSTE,
  calculer,
  encoderDossier,
  releveDepuisExtraction,
  releveManuel,
  type Extraction,
  type Hypotheses,
  type Plateforme,
  type Releve,
} from "@/lib/calcul";
import { formats } from "@/lib/format";
import { lireProvenance } from "@/lib/provenance";
import { formaterTelephone } from "@/lib/telephone";

/* LE CALCULATEUR « TON RELEVÉ, TON ESTIMATION ».

   Il remplace la maquette faite à la main en 48 h. Quatre étapes :
   téléverser le relevé (consentement obligatoire), lecture par l'IA
   (/api/releve), vérification des chiffres extraits, résultat. Si la lecture
   échoue, le formulaire manuel s'ouvre. Le calcul (src/lib/calcul.ts) est
   pur et testé. Après le résultat : Le Dossier pour ton associé, puis la
   réservation ou l'appel. */

type Etape = "televerser" | "lecture" | "verifier" | "manuel" | "resultat";

const champ =
  "mt-1 w-full rounded-xl border-2 border-bone bg-white px-3.5 py-3 text-base font-bold outline-none transition-colors focus:border-brand";
const etiquette = "block text-sm font-bold text-ink/70";

type F = ReturnType<typeof formats>;

/* Les petits textes écrits dans ce composant, dans les deux langues. */
const TEXTES = {
  fr: {
    photo: "Photo",
    parMois: "par mois",
    ventesMois: "(par mois)",
    commandesMois: "Commandes par mois",
    tauxPlateforme: "Taux de la plateforme (%)",
    televerser: "Téléverser un relevé",
    panierReleve: (m: string) => `Panier moyen de ton relevé : ${m}.`,
    exempleAria: "Exemple de résultat",
    releve: "Relevé de plateforme",
    jours: "30 jours",
    lignesExemple: [["Ventes", "5 000,00 $"], ["Commandes", "167"], ["Commissions", "−1 250,00 $"]],
    details: (r: DetailsCalcul) => [
      `Tout est ramené sur 30 jours. Panier moyen (B) : ${r.panier}, ${r.nb} commandes par mois.`,
      `Ce que la plateforme prend : ${r.pris} (commissions et frais du relevé). Chez nous, les mêmes commandes : ${r.chezNous} (${r.liv} par livraison, ${r.cue} par cueillette, frais de carte inclus).`,
      `${r.recupere} = (${r.pris} − ${r.chezNous}) × ${r.partApp} = ${r.recupereM}.`,
      `${r.ajustes} = +${r.hausse} de prix sur ce qui reste sur la plateforme, à volume égal, après sa commission (${r.taux}).${r.uber ? ` Sur Uber Eats, la cueillette passe alors à ${r.uber}.` : ""}`,
      `${r.nouvelles} = ${r.n} × (B × (1 − ${r.aliments}) − (${r.livPct} de B + ${r.livFixe})) = ${r.n} × ${r.profit} = ${r.nouvellesM}.`,
      `Moins l'abonnement de ${r.abonnement}.`,
    ],
    detailsScore: (titre: string, pct: string, plancher: string, score: number) =>
      `${titre} : la plateforme prend ${pct} de tes ventes. Sur une échelle où 0 % de frais = 100 et ${plancher} ou plus = 0, ça donne ${score}.`,
  },
  en: {
    photo: "Photo",
    parMois: "per month",
    ventesMois: "(per month)",
    commandesMois: "Orders per month",
    tauxPlateforme: "Platform rate (%)",
    televerser: "Upload a statement",
    panierReleve: (m: string) => `Average order on your statement: ${m}.`,
    exempleAria: "Example result",
    releve: "Platform statement",
    jours: "30 days",
    lignesExemple: [["Sales", "$5,000.00"], ["Orders", "167"], ["Commissions", "−$1,250.00"]],
    details: (r: DetailsCalcul) => [
      `Everything is brought back to 30 days. Average order (B): ${r.panier}, ${r.nb} orders per month.`,
      `What the platform takes: ${r.pris} (commissions and fees on the statement). With us, the same orders: ${r.chezNous} (${r.liv} per delivery, ${r.cue} per pickup, card fees included).`,
      `${r.recupere} = (${r.pris} − ${r.chezNous}) × ${r.partApp} = ${r.recupereM}.`,
      `${r.ajustes} = +${r.hausse} on prices for what stays on the platform, same volume, after its commission (${r.taux}).${r.uber ? ` On Uber Eats, pickup then goes to ${r.uber}.` : ""}`,
      `${r.nouvelles} = ${r.n} × (B × (1 − ${r.aliments}) − (${r.livPct} of B + ${r.livFixe})) = ${r.n} × ${r.profit} = ${r.nouvellesM}.`,
      `Minus the ${r.abonnement} subscription.`,
    ],
    detailsScore: (titre: string, pct: string, plancher: string, score: number) =>
      `${titre}: the platform takes ${pct} of your sales. On a scale where 0% fees = 100 and ${plancher} or more = 0, that's ${score}.`,
  },
};

type DetailsCalcul = {
  panier: string; nb: string; pris: string; chezNous: string; liv: string; cue: string; recupere: string; partApp: string; recupereM: string;
  ajustes: string; hausse: string; taux: string; uber: string; nouvelles: string; n: number; aliments: string; livPct: string; livFixe: string;
  profit: string; nouvellesM: string; abonnement: string;
};

function num(s: string): number {
  const n = parseFloat(String(s).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

type Brouillon = Record<keyof Omit<Releve, "plateforme">, string> & { plateforme: Plateforme };

function versBrouillon(r: Releve): Brouillon {
  return {
    plateforme: r.plateforme,
    periodeJours: String(r.periodeJours),
    nbLivraison: String(Math.round(r.nbLivraison)),
    nbCueillette: String(Math.round(r.nbCueillette)),
    ventes: String(Math.round(r.ventes * 100) / 100),
    commissions: String(Math.round(r.commissions * 100) / 100),
    autresFrais: String(Math.round(r.autresFrais * 100) / 100),
  };
}

function depuisBrouillon(b: Brouillon): Releve {
  return {
    plateforme: b.plateforme,
    periodeJours: num(b.periodeJours) || 30,
    nbLivraison: num(b.nbLivraison),
    nbCueillette: num(b.nbCueillette),
    ventes: num(b.ventes),
    commissions: num(b.commissions),
    autresFrais: num(b.autresFrais),
  };
}

export default function CalculateurReleve({ langue = "fr" }: { langue?: Langue }) {
  const G = contenuLancement(langue);
  const { ABONNEMENT, ANCRES, CALCULATEUR: C, FRAIS, lienAppel, lienReservation } = G;
  const formatsLangue = formats(langue);
  const { typo: fr, argent, argentSigne, entier, pourcent } = formatsLangue;
  const T = TEXTES[langue];
  const [etape, setEtape] = useState<Etape>("televerser");
  const [fichier, setFichier] = useState<File | null>(null);
  const [consentement, setConsentement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [brouillon, setBrouillon] = useState<Brouillon | null>(null);
  const [manuel, setManuel] = useState({ plateforme: "doordash" as Plateforme, ventes: "", nbCommandes: "", partLivraison: "100", taux: "" });
  const [releve, setReleve] = useState<Releve | null>(null);
  // On ouvre sur un scénario de nouvelles commandes (le même que l'exemple du
  // prix) : on vend des ventes d'abord. Le resto le change en un clic.
  const [hyp, setHyp] = useState<Hypotheses>({ ...HYPOTHESES_DEFAUT, partApp: 0.6, nouvellesCommandes: 40 });
  const [glisse, setGlisse] = useState(false);
  const [lead, setLead] = useState({ prenom: "", resto: "", ville: "", cellulaire: "", courriel: "", textos: false });
  const [piege, setPiege] = useState("");
  const [envoi, setEnvoi] = useState<"idle" | "envoi" | "fait">("idle");

  const resultat = useMemo(() => (releve ? calculer(releve, hyp) : null), [releve, hyp]);

  async function analyser(e: FormEvent) {
    e.preventDefault();
    if (!fichier || !consentement) return;
    setErreur(null);
    setEtape("lecture");
    try {
      const fd = new FormData();
      fd.set("fichier", fichier);
      fd.set("consentement", "oui");
      const r = await fetch("/api/releve", { method: "POST", body: fd });
      const json = (await r.json()) as { ok: boolean; extraction?: Extraction };
      const lu = json.ok ? releveDepuisExtraction(json.extraction) : null;
      if (lu) {
        setBrouillon(versBrouillon(lu));
        setEtape("verifier");
      } else {
        setErreur(C.lectureEchec);
        setEtape("manuel");
      }
    } catch {
      setErreur(C.lectureEchec);
      setEtape("manuel");
    }
  }

  function calculerDepuisBrouillon(e: FormEvent) {
    e.preventDefault();
    if (!brouillon) return;
    setReleve(depuisBrouillon(brouillon));
    setEtape("resultat");
  }

  function calculerManuel(e: FormEvent) {
    e.preventDefault();
    setReleve(
      releveManuel({
        plateforme: manuel.plateforme,
        ventes: num(manuel.ventes),
        nbCommandes: num(manuel.nbCommandes),
        partLivraison: Math.min(1, Math.max(0, num(manuel.partLivraison) / 100)),
        taux: Math.min(1, Math.max(0, num(manuel.taux) / 100)),
      }),
    );
    setEtape("resultat");
  }

  const lienDossier = releve
    ? `/dossier-associe?d=${encoderDossier({ releve, hypotheses: hyp, prenom: lead.prenom, resto: lead.resto, ville: lead.ville })}`
    : "#";

  async function envoyerDossier(e: FormEvent) {
    e.preventDefault();
    if (!releve) return;
    setEnvoi("envoi");
    try {
      await fetch("/api/dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: lead.prenom,
          resto: lead.resto,
          ville: lead.ville,
          cellulaire: lead.cellulaire,
          courriel: lead.courriel,
          consentementTextos: lead.textos,
          dossier: { releve, hypotheses: hyp },
          piege,
          provenance: lireProvenance() ?? undefined,
        }),
        keepalive: true,
      });
    } catch {
      /* le dossier s'ouvre quand même */
    }
    setEnvoi("fait");
  }

  const indexEtape = { televerser: 0, lecture: 1, verifier: 2, manuel: 2, resultat: 3 }[etape];

  return (
    <section id={ANCRES.calculateur.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="rounded-[2rem] bg-bone lg:rounded-[3rem]">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <Surtitre>
          {C.surtitre} · {langue === "en" ? "AI" : "IA"}
          <Sparkles className="size-3.5 text-ciel" aria-hidden="true" />
        </Surtitre>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">{C.titre}</h2>
        <p className="mt-3 max-w-2xl text-lg text-ink/65">{fr(C.sousTitre)}</p>

        <ol className="mt-8 flex flex-wrap gap-2 text-[0.7rem] font-black uppercase tracking-widest">
          {C.etapes.map((t, i) => (
            <li
              key={t}
              className={`rounded-full px-3 py-1.5 ${i === indexEtape ? "bg-brand text-white" : i < indexEtape ? "bg-ink text-white" : "bg-white text-ink/60"}`}
            >
              {i + 1}. {t}
            </li>
          ))}
        </ol>

        {/* Avant le résultat, le formulaire seul; au résultat, le détail à gauche
            et le dossier à droite. */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
          <div className="min-w-0">
            {etape === "televerser" && (
              <form onSubmit={analyser} className="rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-8">
                <h3 className="font-display text-xl font-black md:text-2xl">{C.televerserTitre}</h3>
                <p className="mt-2 text-ink/70">{fr(C.televerserAide)}</p>
                {/* LA ZONE DE DÉPÔT : on glisse le fichier, ou on clique. Une fois
                    choisi, le fichier s'affiche comme une carte. */}
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setGlisse(true);
                  }}
                  onDragLeave={() => setGlisse(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setGlisse(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) setFichier(f);
                  }}
                  className={`group relative mt-6 flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border-2 border-dashed px-5 py-10 text-center transition-all duration-300 md:py-12 ${
                    glisse
                      ? "scale-[1.01] border-ciel bg-ciel/10"
                      : fichier
                        ? "border-transparent bg-bone"
                        : "border-ink/15 bg-bone/70 hover:border-ciel hover:bg-ciel/[0.06]"
                  }`}
                >
                  {fichier ? (
                    <span className="flex w-full max-w-md items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-lg shadow-ink/5">
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink text-white">
                        <FileText className="size-6" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-black">{fichier.name}</span>
                        <span className="text-xs text-ink/55">
                          {fichier.size < 1024 * 1024
                            ? `${Math.max(1, Math.round(fichier.size / 1024))} Ko`
                            : `${(fichier.size / 1024 / 1024).toLocaleString("fr-CA", { maximumFractionDigits: 1 })} Mo`}{" "}
                          · {C.deposerChanger}
                        </span>
                      </span>
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ciel text-white">
                        <Check className="size-4" aria-hidden="true" />
                      </span>
                    </span>
                  ) : (
                    <>
                      <span className={`grid size-16 place-items-center rounded-2xl bg-white shadow-lg shadow-ink/10 transition-transform duration-300 group-hover:-translate-y-1 ${glisse ? "-translate-y-1" : ""}`}>
                        <Upload className="size-7 text-ink" aria-hidden="true" />
                      </span>
                      <span className="mt-5 font-display text-lg font-black md:text-xl">{C.deposerTitre}</span>
                      <span className="mt-1 max-w-xs text-sm text-ink/60">{C.deposerAide}</span>
                      <span className="mt-5 flex flex-wrap items-center justify-center gap-2">
                        {C.plateformes.map((n) => (
                          <span key={n} className="rounded-full bg-white px-3 py-1 text-xs font-black text-ink/70 ring-1 ring-ink/10">
                            {n}
                          </span>
                        ))}
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-ink/70 ring-1 ring-ink/10">
                          <Camera className="size-3.5" aria-hidden="true" />
                          {T.photo}
                        </span>
                      </span>
                      <span className="mt-4 text-[0.7rem] font-bold uppercase tracking-widest text-ink/40">{C.deposerFormats}</span>
                    </>
                  )}
                  <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => setFichier(e.target.files?.[0] ?? null)} />
                </label>
                <label className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-ink/60">
                  <input type="checkbox" required checked={consentement} onChange={(e) => setConsentement(e.target.checked)} className="mt-1 size-5 shrink-0 accent-brand" />
                  <span>{fr(C.consentement)}</span>
                </label>
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <button
                    type="submit"
                    disabled={!fichier || !consentement}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:shadow-none"
                  >
                    {C.boutonAnalyser}
                  </button>
                  <button type="button" onClick={() => setEtape("manuel")} className="font-bold text-ink underline underline-offset-4 hover:text-brand">
                    {C.boutonManuel}
                  </button>
                </div>
              </form>
            )}

            {etape === "lecture" && (
              <div className="rounded-[2rem] bg-white p-10 text-center" role="status" aria-live="polite">
                <div className="mx-auto size-10 animate-spin rounded-full border-4 border-white border-t-brand" />
                <p className="mt-4 font-display font-black">{C.lectureEnCours}</p>
              </div>
            )}

            {etape === "verifier" && brouillon && (
              <form onSubmit={calculerDepuisBrouillon} className="rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-8">
                <h3 className="font-display text-xl font-black md:text-2xl">{C.verifierTitre}</h3>
                <p className="mt-2 text-ink/70">{C.verifierAide}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className={etiquette}>
                    {C.champs.plateforme}
                    <select className={champ} value={brouillon.plateforme} onChange={(e) => setBrouillon({ ...brouillon, plateforme: e.target.value as Plateforme })}>
                      {PLATEFORMES.map((p) => (
                        <option key={p.id} value={p.id}>{p.nom}</option>
                      ))}
                    </select>
                  </label>
                  {(
                    [
                      ["periodeJours", C.champs.periodeJours],
                      ["nbLivraison", C.champs.nbLivraison],
                      ["nbCueillette", C.champs.nbCueillette],
                      ["ventes", C.champs.ventes],
                      ["commissions", C.champs.commissions],
                      ["autresFrais", C.champs.autresFrais],
                    ] as [keyof Omit<Brouillon, "plateforme">, string][]
                  ).map(([k, l]) => (
                    <label key={k} className={etiquette}>
                      {fr(l)}
                      <input className={champ} inputMode="decimal" value={brouillon[k]} onChange={(e) => setBrouillon({ ...brouillon, [k]: e.target.value })} />
                    </label>
                  ))}
                </div>
                <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
                  {C.boutonCalculer}
                </button>
              </form>
            )}

            {etape === "manuel" && (
              <form onSubmit={calculerManuel} className="rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-8">
                {erreur && <p role="alert" className="mb-5 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-bold text-brand">{fr(erreur)}</p>}
                <h3 className="font-display text-xl font-black md:text-2xl">{C.boutonManuel}</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className={etiquette}>
                    {C.champs.plateforme}
                    <select className={champ} value={manuel.plateforme} onChange={(e) => setManuel({ ...manuel, plateforme: e.target.value as Plateforme })}>
                      {PLATEFORMES.map((p) => (
                        <option key={p.id} value={p.id}>{p.nom}</option>
                      ))}
                    </select>
                  </label>
                  <label className={etiquette}>
                    {fr(C.champs.ventes)} {T.ventesMois}
                    <input className={champ} inputMode="decimal" required placeholder="5 000" value={manuel.ventes} onChange={(e) => setManuel({ ...manuel, ventes: e.target.value })} />
                  </label>
                  <label className={etiquette}>
                    {T.commandesMois}
                    <input className={champ} inputMode="numeric" required placeholder="160" value={manuel.nbCommandes} onChange={(e) => setManuel({ ...manuel, nbCommandes: e.target.value })} />
                  </label>
                  <label className={etiquette}>
                    {C.champs.partLivraison} (%)
                    <input className={champ} inputMode="numeric" required value={manuel.partLivraison} onChange={(e) => setManuel({ ...manuel, partLivraison: e.target.value })} />
                  </label>
                  <label className={etiquette}>
                    {T.tauxPlateforme}
                    <input className={champ} inputMode="decimal" required placeholder="25" value={manuel.taux} onChange={(e) => setManuel({ ...manuel, taux: e.target.value })} />
                  </label>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
                    {C.boutonCalculer}
                  </button>
                  <button type="button" onClick={() => { setErreur(null); setEtape("televerser"); }} className="font-bold text-ink underline underline-offset-4 hover:text-brand">
                    {T.televerser}
                  </button>
                </div>
              </form>
            )}

            {etape === "resultat" && releve && resultat && (
              <div className="space-y-5">
                {/* LES VENTES D'ABORD : ce que l'app peut aller chercher. Ce qu'il
                    reste en plus et le score viennent ensuite. */}
                <div className="relative overflow-hidden rounded-[2rem] bg-ink p-7 text-white md:p-9">
                  <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/30 blur-3xl" />
                  <p className="relative inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60">
                    <PointCiel />
                    {C.ventesTitre}
                  </p>
                  <p className="relative mt-3 font-display text-5xl font-black tabular-nums md:text-7xl">
                    {argent(Math.round(resultat.mois.ventes * hyp.partApp + (hyp.nouvellesCommandes ?? 0) * resultat.panier))}
                  </p>
                  <p className="relative mt-1 text-lg font-bold text-white/75">
                    {C.ventesSuffixe},{" "}
                    <span className="text-white">{fr(C.ventesDont.replace("{n}", argentSigne(Math.round((hyp.nouvellesCommandes ?? 0) * resultat.panier))))}</span>
                  </p>
                  <p className="relative mt-2 text-sm text-white/50">
                    {fr(C.scenarioNote.replace("{n}", String(hyp.nouvellesCommandes ?? 0)))} {fr(T.panierReleve(argent(resultat.panier, 2)))}
                  </p>
                  <div className="relative mt-7 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="rounded-2xl bg-white/[0.07] p-5">
                      <p className="text-xs font-bold text-white/60">{C.resteTitre}</p>
                      <p className={`mt-1 font-display text-3xl font-black tabular-nums ${resultat.total < 0 ? "text-white/60" : "text-white"}`}>
                        {argentSigne(Math.round(resultat.total))}
                      </p>
                      <p className="text-xs text-white/50">{C.resultatSuffixe}</p>
                      {resultat.economieNegative && <p className="mt-3 text-sm font-bold text-white/80">{fr(C.economieNegative)}</p>}
                    </div>
                    {resultat.mois.ventes > 0 && (
                      <div className="rounded-2xl bg-white/[0.07] px-6 py-5 sm:w-48">
                        <p className="text-center text-xs font-bold text-white/60">{C.scoreTitre}</p>
                        <ScoreResto frais={resultat.mois.prisParPlateforme / resultat.mois.ventes} className="mt-2" langue={langue} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-8">
                  <dl className="divide-y divide-ink/10">
                    <Ligne f={formatsLangue} libelle={C.moteurs.nouvelles} valeur={resultat.nouvelles}>
                      <p className={etiquette}>{C.scenario}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {C.scenarios.map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setHyp((h) => ({ ...h, nouvellesCommandes: n }))}
                            aria-pressed={hyp.nouvellesCommandes === n}
                            className={`rounded-full px-5 py-2 text-sm font-black transition ${hyp.nouvellesCommandes === n ? "bg-brand text-white" : "bg-white hover:bg-ink hover:text-white"}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <label className={`${etiquette} mt-3`}>
                        {C.aliments} (%)
                        <input className={`${champ} max-w-[8rem]`} inputMode="decimal" value={Math.round(hyp.aliments * 100)} onChange={(e) => setHyp((h) => ({ ...h, aliments: Math.min(0.9, Math.max(0, num(e.target.value) / 100)) }))} />
                      </label>
                      {Number.isFinite(resultat.seuil) && (
                        <p className="mt-3 text-sm text-ink/70">
                          {C.seuilPrefixe} <strong className="text-ink">{entier(resultat.seuil)}</strong> {C.seuilSuffixe}
                        </p>
                      )}
                    </Ligne>
                    <Ligne f={formatsLangue} libelle={C.moteurs.recupere} valeur={resultat.recupere}>
                      <label className={etiquette}>
                        {C.partApp} : <strong className="text-ink">{pourcent(hyp.partApp)}</strong>
                        <input type="range" min={25} max={75} step={5} value={Math.round(hyp.partApp * 100)} onChange={(e) => setHyp((h) => ({ ...h, partApp: Number(e.target.value) / 100 }))} className="mt-2 w-full accent-brand" />
                      </label>
                    </Ligne>
                    <Ligne f={formatsLangue} libelle={C.moteurs.ajustes} valeur={resultat.ajustes}>
                      <label className="flex items-start gap-3 text-sm font-bold text-ink/70">
                        <input type="checkbox" checked={hyp.prixAjustes} onChange={(e) => setHyp((h) => ({ ...h, prixAjustes: e.target.checked }))} className="mt-0.5 size-5 accent-brand" />
                        <span>
                          {fr(C.prixAjustes)} <em className="font-normal">({C.siEntente})</em>
                        </span>
                      </label>
                    </Ligne>
                    <Ligne f={formatsLangue} libelle={C.moteurs.abonnement} valeur={-resultat.abonnement} />
                  </dl>
                  <p className="mt-6 text-xs leading-relaxed text-ink/55">{fr(C.avertissement)}</p>
                  <details className="group mt-4">
                    <summary className="flex cursor-pointer list-none items-center gap-2 font-bold hover:text-brand [&::-webkit-details-marker]:hidden">
                      {C.commentOnCalcule}
                      <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink/75">
                      {T.details({
                        panier: argent(resultat.panier, 2),
                        nb: entier(resultat.mois.nbLivraison + resultat.mois.nbCueillette),
                        pris: argent(resultat.mois.prisParPlateforme),
                        chezNous: argent(resultat.mois.coutChezNous),
                        liv: `${pourcent(FRAIS.livraisonPct)} + ${argent(FRAIS.livraisonFixe, 2)}`,
                        cue: `${pourcent(FRAIS.cueillettePct)} + ${argent(FRAIS.cueilletteFixe, 2)}`,
                        recupere: C.moteurs.recupere,
                        partApp: pourcent(hyp.partApp),
                        recupereM: argent(resultat.recupere),
                        ajustes: C.moteurs.ajustes,
                        hausse: pourcent(HAUSSE_PRIX),
                        taux: pourcent(resultat.tauxEffectif, 1),
                        uber: releve.plateforme === "ubereats" ? pourcent(TAUX_CUEILLETTE_UBER_AJUSTE) : "",
                        nouvelles: C.moteurs.nouvelles,
                        n: hyp.nouvellesCommandes ?? 0,
                        aliments: pourcent(hyp.aliments),
                        livPct: pourcent(FRAIS.livraisonPct),
                        livFixe: argent(FRAIS.livraisonFixe, 2),
                        profit: argent(resultat.profitParNouvelleCommande, 2),
                        nouvellesM: argent(resultat.nouvelles),
                        abonnement: argent(ABONNEMENT),
                      }).map((l) => (
                        <p key={l.slice(0, 24)}>{fr(l)}</p>
                      ))}
                      {resultat.mois.ventes > 0 && (
                        <p>
                          {fr(
                            T.detailsScore(
                              C.scoreTitre,
                              pourcent(resultat.mois.prisParPlateforme / resultat.mois.ventes, 1),
                              pourcent(FRAIS_PLANCHER),
                              scoreDepuisFrais(resultat.mois.prisParPlateforme / resultat.mois.ventes),
                            ),
                          )}
                        </p>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            )}
          </div>

          {/* LE DOSSIER POUR TON ASSOCIÉ ET LES DEUX BOUTONS, à droite du résultat. */}
          {/* Avant le résultat : l'aperçu animé de ce que l'IA va te sortir. */}
          {etape !== "resultat" && <ApercuCalcul C={C} T={T} f={formatsLangue} langue={langue} />}
          {etape === "resultat" && releve && (
            <div className="rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-ink/10 md:p-8">
              <h3 className="font-display text-xl font-black md:text-2xl">{C.dossierTitre}</h3>
              <p className="mt-2 text-sm text-ink/70">{fr(C.dossierAide)}</p>
              {envoi !== "fait" ? (
                <form noValidate onSubmit={envoyerDossier} className="relative mt-5">
                  <div className="grid gap-3">
                    {(
                      [
                        ["prenom", C.champs.prenom, "text", "given-name"],
                        ["resto", C.champs.resto, "text", "organization"],
                        ["ville", C.champs.ville, "text", "address-level2"],
                        ["cellulaire", C.champs.cellulaire, "tel", "tel"],
                        ["courriel", C.champs.courriel, "email", "email"],
                      ] as ["prenom" | "resto" | "ville" | "cellulaire" | "courriel", string, string, string][]
                    ).map(([k, l, type, auto]) => (
                      <label key={k} className={etiquette}>
                        {l}
                        <input
                          className={champ}
                          type={type}
                          required={k === "prenom" || k === "resto" || k === "cellulaire"}
                          autoComplete={auto}
                          value={lead[k]}
                          onChange={(e) => setLead({ ...lead, [k]: k === "cellulaire" ? formaterTelephone(e.target.value) : e.target.value })}
                        />
                      </label>
                    ))}
                  </div>
                  <input type="text" name="site" value={piege} onChange={(e) => setPiege(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" className="absolute left-[-9999px] size-px opacity-0" />
                  <label className="mt-4 flex items-start gap-3 text-sm text-ink/80">
                    <input type="checkbox" checked={lead.textos} onChange={(e) => setLead({ ...lead, textos: e.target.checked })} className="mt-0.5 size-5 accent-brand" />
                    {C.consentementTextos}
                  </label>
                  <button type="submit" disabled={envoi === "envoi"} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60">
                    {C.dossierBouton}
                  </button>
                </form>
              ) : (
                <a href={lienDossier} target="_blank" rel="noopener" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-lg font-black text-white transition hover:bg-brand">
                  {C.dossierBouton}
                </a>
              )}
              <div className="mt-7 flex flex-col gap-4 border-t border-bone pt-6">
                <BoutonReserver href={lienReservation()} libelle={fr(C.boutonReserver)} taille="md" className="w-full text-ink [&>a]:w-full [&>a>span:first-child]:text-center" />
                <BoutonContour href={lienAppel()} className="w-full">
                  <Phone className="size-4" aria-hidden="true" />
                  {C.boutonAppel}
                </BoutonContour>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}

function Ligne({ libelle, valeur, children, f }: { libelle: string; valeur: number; children?: React.ReactNode; f: F }) {
  const { argentSigne } = f;
  return (
    <div className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:gap-8">
      <div>
        <dt className="font-display text-base font-black md:text-lg">{libelle}</dt>
        {children && <dd className="mt-3">{children}</dd>}
      </div>
      <dd className={`font-display text-2xl font-black tabular-nums sm:text-right ${valeur < 0 ? "text-ink/50" : "text-brand"}`}>
        {argentSigne(Math.round(valeur))}
      </dd>
    </div>
  );
}

/* L'APERÇU, à droite du formulaire : un relevé que l'IA « lit » (une ligne
   qui balaie), puis ce que le resto va voir. Chiffres d'exemple, marqués
   comme tels, les mêmes que l'exemple du prix (+629 $ par mois). */
// L'exemple passe par le MÊME calcul que le vrai résultat : un resto qui
// entre ces chiffres-là voit exactement ce que l'aperçu promet.
// C'est l'exemple de la GSO et de la section Prix : 5 000 $ à 25 %, panier
// de 30 $, 3 000 $ qui passent à l'app, 40 nouvelles commandes, prix +10 %.
const EXEMPLE_RELEVE: Releve = { plateforme: "doordash", periodeJours: 30, nbLivraison: 5000 / 30, nbCueillette: 0, ventes: 5000, commissions: 1250, autresFrais: 0 };
const EXEMPLE_HYP: Hypotheses = { ...HYPOTHESES_DEFAUT, partApp: 0.6, prixAjustes: true, nouvellesCommandes: 40 };
const EXEMPLE = calculer(EXEMPLE_RELEVE, EXEMPLE_HYP);
const EXEMPLE_NOUVEAUX = (EXEMPLE_HYP.nouvellesCommandes ?? 0) * EXEMPLE.panier;
const EXEMPLE_VENTES_APP = EXEMPLE.mois.ventes * EXEMPLE_HYP.partApp + EXEMPLE_NOUVEAUX;

function ApercuCalcul({ C, T, f, langue }: { C: ContenuLancement["CALCULATEUR"]; T: (typeof TEXTES)["fr"]; f: F; langue: Langue }) {
  const { typo: fr, argent, argentSigne } = f;
  /* Les chiffres entrent UNE fois, quand l'aperçu arrive à l'écran, puis
     restent là. On pose un attribut sur le DOM (pas d'état React) : le CSS
     fait le reste (globals.css, .calc-apparait). */
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entree]) => {
        if (entree?.isIntersecting) {
          el.dataset.vu = "1";
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <aside ref={ref} className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-white md:p-8" aria-label={T.exempleAria}>
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-brand/30 blur-3xl" />
      <p className="relative inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-widest">
        <Sparkles className="size-3.5 text-ciel" aria-hidden="true" />
        {C.apercuBadge}
      </p>
      {/* Le relevé lu par l'IA */}
      <div className="relative mt-6 overflow-hidden rounded-2xl bg-white p-4 text-ink" aria-hidden="true">
        <div className="flex items-center justify-between text-[0.65rem] font-black uppercase tracking-widest text-ink/50">
          <span>{T.releve}</span>
          <span>{T.jours}</span>
        </div>
        {T.lignesExemple.map(([l, v]) => (
          <div key={l} className="mt-2 flex justify-between border-b border-bone pb-1.5 text-sm">
            <span className="text-ink/70">{l}</span>
            <span className="font-bold tabular-nums">{v}</span>
          </div>
        ))}
        <span className="calc-balaye pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-ciel/30 to-transparent" />
      </div>
      {/* Les ventes d'abord */}
      <div className="calc-apparait relative mt-6" style={{ animationDelay: "0.4s" }}>
        <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60">
          <PointCiel />
          {C.ventesTitre}
        </p>
        <p className="mt-2 font-display text-4xl font-black tabular-nums md:text-5xl">{argent(Math.round(EXEMPLE_VENTES_APP))}</p>
        <p className="text-sm font-bold text-white/70">
          {C.ventesSuffixe}, <span className="text-white">{fr(C.ventesDont.replace("{n}", argentSigne(Math.round(EXEMPLE_NOUVEAUX))))}</span>
        </p>
      </div>
      <div className="relative mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-3">
        <div className="calc-apparait rounded-2xl bg-brand p-4" style={{ animationDelay: "0.9s" }}>
          <p className="text-xs font-bold text-white/85">{C.resteTitre}</p>
          <p className="mt-1 font-display text-2xl font-black tabular-nums">{argentSigne(Math.round(EXEMPLE.total))}</p>
          <p className="text-xs text-white/80">{T.parMois}</p>
        </div>
        <div className="calc-apparait w-32 rounded-2xl bg-white/[0.07] px-3 py-3" style={{ animationDelay: "1.2s" }}>
          <p className="text-center text-[0.7rem] font-bold text-white/60">{C.scoreTitre}</p>
          <ScoreResto frais={EXEMPLE.mois.prisParPlateforme / EXEMPLE.mois.ventes} className="mt-1" langue={langue} />
        </div>
      </div>
      <p className="relative mt-4 text-xs text-white/50">{fr(C.apercuNote)}</p>
    </aside>
  );
}
