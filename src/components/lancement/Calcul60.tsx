"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import CalculateurReleve from "@/components/lancement/CalculateurReleve";
import { BoutonContour } from "@/components/lancement/ui";
import { ANCRES, CALCUL_60 as K, lienAppel, lienReservation } from "@/lib/contenu/grand-lancement";
import {
  CALCUL_60_DEPART,
  COMMANDES_MAX,
  COMMANDES_MIN,
  COMMANDES_PAS,
  TAUX_60,
  borner60,
  calculer60,
  type Taux60,
} from "@/lib/calcul60";
import { argent, entier, fr, pourcent } from "@/lib/format";
import { lireProvenance } from "@/lib/provenance";
import { formaterTelephone } from "@/lib/telephone";

/* LE CALCUL 60 SECONDES, en premier dans la section du calculateur.

   Deux chiffres (les commandes par semaine, le taux de commission), une
   commande moyenne modifiable, et la réponse qui suit les curseurs, sans
   bouton. Ensuite : le dossier par texto (case obligatoire), la suite, la
   ligne de la mise en service, les 2 boutons, et en dernier le lien qui ouvre
   le parcours du relevé (CalculateurReleve, inchangé) pour le chiffre exact.

   Français seulement : /en garde le calculateur du relevé. Textes :
   CALCUL_60 dans src/lib/contenu/grand-lancement.ts. Calcul : src/lib/calcul60.ts.

   `ligneMise` vient du serveur (miseEnService()) : vide dès le 19 décembre,
   et la ligne disparaît. */

const champ =
  "mt-1 w-full rounded-xl border-2 border-bone bg-white px-3.5 py-3 text-base font-bold outline-none transition-colors focus:border-brand";
const etiquette = "block text-sm font-bold text-ink/70";
const carte = "rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-8";

function num(s: string): number {
  return parseFloat(s.replace(/\s/g, "").replace(",", "."));
}

/** 30 → « 30 $ », 27,5 → « 27,50 $ ». */
function dollars(n: number): string {
  return argent(n, Number.isInteger(n) ? 0 : 2);
}

type Lead = { prenom: string; resto: string; ville: string; cellulaire: string };

export default function Calcul60({ ligneMise }: { ligneMise: string }) {
  const id = useId();
  // Le chiffre retenu et ce qui est écrit dans la case : pendant qu'on tape,
  // la case peut être vide ou hors limites sans que la réponse saute.
  const [commandes, setCommandes] = useState<number>(CALCUL_60_DEPART.commandes);
  const [commandesTexte, setCommandesTexte] = useState(String(CALCUL_60_DEPART.commandes));
  const [panier, setPanier] = useState<number>(CALCUL_60_DEPART.panier);
  const [panierTexte, setPanierTexte] = useState(String(CALCUL_60_DEPART.panier));
  const [taux, setTaux] = useState<Taux60>(CALCUL_60_DEPART.taux);

  const [lead, setLead] = useState<Lead>({ prenom: "", resto: "", ville: "", cellulaire: "" });
  const [textos, setTextos] = useState(false);
  const [piege, setPiege] = useState("");
  const [envoi, setEnvoi] = useState<"idle" | "envoi" | "fait" | "erreur">("idle");

  const [releveOuvert, setReleveOuvert] = useState(false);
  const ancreReleve = useRef<HTMLDivElement>(null);

  const reponse = useMemo(() => calculer60({ commandes, panier, taux }), [commandes, panier, taux]);
  const parAnnee = argent(reponse.parAnnee);
  const [avantX, apresX] = K.reponse.split("{x}");

  function saisirCommandes(texte: string) {
    setCommandesTexte(texte);
    const n = num(texte);
    if (Number.isFinite(n)) setCommandes(borner60({ commandes: n, panier, taux }).commandes);
  }

  function saisirPanier(texte: string) {
    setPanierTexte(texte);
    const n = num(texte);
    if (Number.isFinite(n)) setPanier(borner60({ commandes, panier: n, taux }).panier);
  }

  function allerAuReleve() {
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ancreReleve.current?.scrollIntoView({ behavior: doux ? "smooth" : "auto", block: "start" });
  }

  // Le relevé vient de s'ouvrir : on y descend.
  useEffect(() => {
    if (releveOuvert) allerAuReleve();
  }, [releveOuvert]);

  async function envoyer(e: FormEvent) {
    e.preventDefault();
    if (!textos || envoi === "envoi") return;
    setEnvoi("envoi");
    try {
      const r = await fetch("/api/calcul-60", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          consentementTextos: textos,
          commandes,
          panier,
          taux,
          piege,
          provenance: lireProvenance() ?? undefined,
        }),
        keepalive: true,
      });
      setEnvoi(r.ok ? "fait" : "erreur");
    } catch {
      setEnvoi("erreur");
    }
  }

  return (
    <section id={ANCRES.calculateur.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="rounded-[2rem] bg-bone lg:rounded-[3rem]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">{fr(K.titre)}</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink/65">{fr(K.sousTitre)}</p>

          {/* A. LES 2 CHIFFRES À GAUCHE, LA RÉPONSE À DROITE (dessous au cellulaire). */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-stretch">
            <div className={carte}>
              <label htmlFor={`${id}-commandes`} className="block font-display text-lg font-black md:text-xl">
                {K.question1}
              </label>
              <div className="mt-4 flex items-center gap-4">
                <input
                  id={`${id}-commandes`}
                  type="range"
                  min={COMMANDES_MIN}
                  max={COMMANDES_MAX}
                  step={COMMANDES_PAS}
                  value={commandes}
                  onChange={(e) => {
                    setCommandes(Number(e.target.value));
                    setCommandesTexte(e.target.value);
                  }}
                  className="h-11 w-full min-w-0 cursor-pointer accent-brand"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label={K.question1}
                  value={commandesTexte}
                  onChange={(e) => saisirCommandes(e.target.value)}
                  onBlur={() => setCommandesTexte(String(commandes))}
                  className="w-24 shrink-0 rounded-xl border-2 border-bone bg-white px-3 py-3 text-center text-xl font-black tabular-nums outline-none transition-colors focus:border-brand"
                />
              </div>

              <p id={`${id}-taux`} className="mt-8 font-display text-lg font-black md:text-xl">
                {K.question2}
              </p>
              <div role="group" aria-labelledby={`${id}-taux`} className="mt-4 flex gap-2">
                {TAUX_60.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTaux(t)}
                    aria-pressed={taux === t}
                    className={`flex-1 rounded-full px-4 py-3 text-lg font-black tabular-nums transition ${taux === t ? "bg-brand text-white" : "bg-bone text-ink hover:bg-ink hover:text-white"}`}
                  >
                    {pourcent(t)}
                  </button>
                ))}
              </div>

              <label className="mt-8 flex flex-wrap items-center gap-2 text-sm text-ink/60">
                {fr(K.panier)}
                <input
                  type="text"
                  inputMode="decimal"
                  value={panierTexte}
                  onChange={(e) => saisirPanier(e.target.value)}
                  onBlur={() => setPanierTexte(String(panier).replace(".", ","))}
                  className="w-16 rounded-lg border-2 border-bone bg-white px-2 py-1.5 text-center text-base font-bold text-ink tabular-nums outline-none transition-colors focus:border-brand"
                />
                $
              </label>
            </div>

            {/* LA RÉPONSE : elle suit les curseurs, sans bouton. */}
            <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-ink p-7 text-white md:p-9">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/30 blur-3xl" />
              <p className="relative" aria-live="polite">
                <span className="block text-lg font-bold text-white/75">{avantX.trim()}</span>
                <span className={`mt-1 block font-display font-black tabular-nums ${parAnnee.length > 9 ? "text-4xl md:text-5xl" : "text-5xl md:text-6xl"}`}>
                  {parAnnee}
                </span>
                <span className="mt-1 block text-lg font-bold text-white/75">{apresX.trim()}</span>
              </p>
              <p className="relative mt-5 font-display text-xl font-black">
                {fr(K.parSemaine.replace("{y}", dollars(reponse.parSemaine)))}
              </p>
              <p className="relative mt-1 text-sm tabular-nums text-white/60">
                {fr(
                  K.formule
                    .replace("{commandes}", entier(commandes))
                    .replace("{panier}", dollars(panier))
                    .replace("{taux}", pourcent(taux)),
                )}
              </p>
              {taux === 0.2 && (
                <p className="relative mt-5 border-l-4 border-brand pl-4 text-base font-bold">{fr(K.franc20)}</p>
              )}
              <p className="relative mt-auto pt-6 text-xs leading-relaxed text-white/60">{fr(K.avertissement)}</p>
            </div>
          </div>

          {/* B. APRÈS LA RÉPONSE : le dossier par texto, puis la suite. */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
            <div className={carte}>
              <h3 className="font-display text-xl font-black md:text-2xl">{K.formulaireTitre}</h3>
              {envoi === "fait" ? (
                <p role="status" className="mt-5 rounded-2xl bg-bone px-5 py-4 font-display text-lg font-black">
                  {fr(K.apresEnvoi.replace("{prenom}", lead.prenom.trim()))}
                </p>
              ) : (
                <form onSubmit={envoyer} className="relative mt-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["prenom", K.champs.prenom, "text", "given-name"],
                        ["resto", K.champs.resto, "text", "organization"],
                        ["ville", K.champs.ville, "text", "address-level2"],
                        ["cellulaire", K.champs.cellulaire, "tel", "tel"],
                      ] as [keyof Lead, string, string, string][]
                    ).map(([k, l, type, auto]) => (
                      <label key={k} className={etiquette}>
                        {l}
                        <input
                          className={champ}
                          type={type}
                          required
                          autoComplete={auto}
                          value={lead[k]}
                          onChange={(e) => setLead({ ...lead, [k]: k === "cellulaire" ? formaterTelephone(e.target.value) : e.target.value })}
                        />
                      </label>
                    ))}
                  </div>
                  <input type="text" name="site" value={piege} onChange={(e) => setPiege(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" className="absolute left-[-9999px] size-px opacity-0" />
                  {/* La case est obligatoire : sans elle, le formulaire ne part pas. */}
                  <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                    <input type="checkbox" required checked={textos} onChange={(e) => setTextos(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-brand" />
                    <span>{fr(K.consentement)}</span>
                  </label>
                  <p className="mt-2 pl-8 text-sm">
                    <Link href={K.lienConfidentialite.href} className="font-bold text-ink/70 underline underline-offset-4 hover:text-brand">
                      {K.lienConfidentialite.label}
                    </Link>
                  </p>
                  {envoi === "erreur" && (
                    <p role="alert" className="mt-4 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
                      {fr(K.erreur)}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!textos || envoi === "envoi"}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:shadow-none sm:w-auto"
                  >
                    {K.boutonEnvoyer}
                  </button>
                </form>
              )}
            </div>

            <div className={carte}>
              <p className="font-display text-xl font-black leading-snug md:text-2xl">{fr(K.suite)}</p>
              {taux !== 0.2 && <p className="mt-3 text-ink/70">{fr(K.suiteCommission)}</p>}
              {ligneMise && (
                <p className="mt-5 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-black text-brand">{fr(ligneMise)}</p>
              )}
              <div className="mt-6 flex flex-col gap-4">
                <BoutonReserver href={lienReservation()} libelle={K.boutonReserver} taille="md" className="w-full text-ink [&>a]:w-full [&>a>span:first-child]:text-center" />
                <BoutonContour href={lienAppel()} className="w-full">
                  <Phone className="size-4" aria-hidden="true" />
                  {K.boutonAppel}
                </BoutonContour>
              </div>
            </div>
          </div>

          {/* EN DERNIER : le chiffre exact, par le relevé. Le parcours qui s'ouvre
              est celui qui existait déjà, tel quel. */}
          <p className="mt-10 text-center">
            <button
              type="button"
              aria-expanded={releveOuvert}
              onClick={() => (releveOuvert ? allerAuReleve() : setReleveOuvert(true))}
              className="font-bold text-ink underline underline-offset-4 hover:text-brand"
            >
              {fr(K.lienReleve)}
            </button>
          </p>
          <div ref={ancreReleve} className="scroll-mt-24">
            {releveOuvert && (
              <div className="mt-10 border-t border-ink/10 pt-10">
                <CalculateurReleve integre />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
