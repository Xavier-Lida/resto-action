import { Check } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import Reveal from "@/components/Reveal";
import { Exemple, PointCiel, Surtitre } from "@/components/lancement/ui";
import { contenuLancement, type Langue } from "@/lib/contenu/lancement";
import { formats } from "@/lib/format";

/* BLOC 5 : LE PRIX, EN UN COUP D'ŒIL.

   À gauche, ce que ça coûte : un gros 200 $, la mise en service en une
   ligne, les deux frais à la commande côte à côte, les pastilles. À droite,
   ce que ça rapporte : +629 $ avec une barre qui montre d'où vient l'argent,
   et le bouton. En dessous, les bonus en bande. Le détail complet reste
   dans /conditions-fondateur. */

const TEXTES = {
  fr: {
    surtitre: "Le prix",
    cout: "Ce que ça coûte",
    parMois: "par mois",
    miseEnService: (a: number, b: string) => [`${a} $ de mise en service`, ` (puis ${b} $), remboursée si ton app ne te l'a pas rapportée en 90 jours.`],
    cueillette: "Par cueillette",
    livraison: "Par livraison",
    frais: (pct: number, fixe: string) => `${pct} % + ${fixe} $`,
    clientPaie: (m: string) => `ton client paie ${m} $`,
    pastilles: ["Pas de dépôt", "Frais de carte inclus", "Imprimante offerte", "Aucun minimum", "Taxes en sus"],
    bonus: "Les bonus",
    rapporte: "Ce que ça rapporte",
    dePlus: "de plus par mois, abonnement payé",
    ventesApp: (m: string) => `et ${m} de ventes par mois sur ton app`,
    reserve: "Réserve ta place",
    nombre: (n: number) => n.toLocaleString("fr-CA", { minimumFractionDigits: 2 }),
  },
  en: {
    surtitre: "The price",
    cout: "What it costs",
    parMois: "per month",
    miseEnService: (a: number, b: string) => [`$${a} setup fee`, ` (then $${b}), refunded if your app hasn't paid it back within 90 days.`],
    cueillette: "Per pickup",
    livraison: "Per delivery",
    frais: (pct: number, fixe: string) => `${pct}% + $${fixe}`,
    clientPaie: (m: string) => `your customer pays $${m}`,
    pastilles: ["No deposit", "Card fees included", "Printer included", "No minimum", "Plus taxes"],
    bonus: "The bonuses",
    rapporte: "What it brings in",
    dePlus: "more per month, after the subscription",
    ventesApp: (m: string) => `and ${m} in sales per month on your app`,
    reserve: "Reserve your spot",
    nombre: (n: number) => n.toLocaleString("en-CA", { minimumFractionDigits: 2 }),
  },
};

// Les couleurs de la barre « d'où vient l'argent », dans l'ordre des lignes.
const TEINTES = ["bg-brand", "bg-ink", "bg-ciel"];

export default function PrixLancement({ langue = "fr" }: { langue?: Langue }) {
  const { ABONNEMENT, ANCRES, BONUS_COURT, BONUS_SECTION, FRAIS, MISE_EN_SERVICE_ACTUELLE, MISE_EN_SERVICE_ENSUITE, PRIX, disponible, lienReservation } =
    contenuLancement(langue);
  const { typo: fr, argent, argentSigne } = formats(langue);
  const T = TEXTES[langue];
  const virgule = T.nombre;
  const [mesA, mesB] = T.miseEnService(MISE_EN_SERVICE_ACTUELLE, MISE_EN_SERVICE_ENSUITE.toLocaleString(langue === "en" ? "en-CA" : "fr-CA"));
  const bonus = BONUS_COURT.filter(disponible);
  const gains = PRIX.exempleCourt.filter(([, v]) => v > 0);
  const sommeGains = gains.reduce((n, [, v]) => n + v, 0);
  const couts = PRIX.exempleCourt.filter(([, v]) => v < 0);

  return (
    <section id={ANCRES.prix.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-brand/25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
          <Reveal>
            <Surtitre ton="sombre">{T.surtitre}</Surtitre>
            <h2 className="mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">{PRIX.titre}</h2>
          </Reveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="flex flex-col gap-4">
              {/* CE QUE ÇA COÛTE */}
              <Reveal>
                <div className="rounded-[2rem] bg-white/[0.06] p-7 ring-1 ring-white/10 md:p-9">
                  <p className="text-xs font-black uppercase tracking-widest text-white/50">{T.cout}</p>
                  <p className="mt-4 flex items-baseline gap-3">
                    <span className="font-display text-6xl font-black tracking-tight md:text-7xl">{langue === "en" ? `$${ABONNEMENT}` : `${ABONNEMENT} $`}</span>
                    <span className="text-lg font-black text-brand">{T.parMois}</span>
                  </p>
                  <p className="mt-4 max-w-md leading-relaxed text-white/70">
                    <strong className="text-white">{fr(mesA)}</strong>
                    {fr(mesB)}
                  </p>
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/[0.06] p-4">
                      <p className="text-xs font-bold text-white/55">{T.cueillette}</p>
                      <p className="mt-1 whitespace-nowrap font-display text-xl font-black md:text-2xl">
                        {fr(T.frais(FRAIS.cueillettePct * 100, virgule(FRAIS.cueilletteFixe)))}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.06] p-4">
                      <p className="text-xs font-bold text-white/55">{T.livraison}</p>
                      <p className="mt-1 whitespace-nowrap font-display text-xl font-black md:text-2xl">
                        {fr(T.frais(FRAIS.livraisonPct * 100, virgule(FRAIS.livraisonFixe)))}
                      </p>
                      <p className="mt-1 text-xs text-white/50">{fr(T.clientPaie(virgule(FRAIS.livraisonClient)))}</p>
                    </div>
                  </div>
                  <ul className="mt-6 flex list-none flex-wrap gap-2">
                    {T.pastilles.map((p) => (
                      <li key={p} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-sm font-bold text-white/85">
                        <Check className="size-3.5 text-ciel" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* LES BONUS, sous le prix */}
              {bonus.length > 0 && (
                <Reveal delay={1}>
                  <div className="rounded-[2rem] bg-brand p-6 md:p-7">
                    <p className="text-xs font-black uppercase tracking-widest text-white/80">{T.bonus}</p>
                    <ul className="mt-4 grid list-none gap-3">
                      {bonus.map((b) => (
                        <li key={b.texte} className="flex gap-3">
                          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white text-brand">
                            <Check className="size-3.5" aria-hidden="true" />
                          </span>
                          <span className="font-bold leading-snug">
                            {fr(b.texte)}
                            {b.expire && (
                              <span className="ml-2 inline-block rounded-full bg-white/20 px-2 py-0.5 align-middle text-[0.65rem] font-black uppercase tracking-widest">
                                {fr(BONUS_SECTION.etiquetteCourte)}
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>

            {/* CE QUE ÇA RAPPORTE */}
            <Reveal delay={1} className="h-full">
              <div className="flex h-full flex-col rounded-[2rem] bg-white p-7 text-ink md:p-9">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-widest text-ink/50">{T.rapporte}</p>
                  <Exemple>{PRIX.exempleMention}</Exemple>
                </div>
                <p className="mt-4 font-display text-6xl font-black tracking-tight text-brand md:text-7xl">{argentSigne(PRIX.exempleTotal)}</p>
                <p className="font-black">{T.dePlus}</p>
                <p className="mt-1 inline-flex items-center gap-2 text-sm text-ink/60">
                  <PointCiel />
                  {fr(T.ventesApp(argent(PRIX.exempleVentesApp)))}
                </p>

                {/* D'où vient l'argent : une barre, puis la légende. */}
                <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-bone" aria-hidden="true">
                  {gains.map(([l, v], k) => (
                    <span key={l} className={TEINTES[k % TEINTES.length]} style={{ width: `${(v / sommeGains) * 100}%` }} />
                  ))}
                </div>
                <ul className="mt-4 grid list-none gap-2 text-sm">
                  {gains.map(([l, v], k) => (
                    <li key={l} className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-ink/70">
                        <span className={`size-2.5 shrink-0 rounded-full ${TEINTES[k % TEINTES.length]}`} aria-hidden="true" />
                        {fr(l)}
                      </span>
                      <span className="font-bold tabular-nums">{argentSigne(v)}</span>
                    </li>
                  ))}
                  {couts.map(([l, v]) => (
                    <li key={l} className="flex items-center justify-between gap-3 border-t border-bone pt-2">
                      <span className="pl-[1.125rem] text-ink/70">{fr(l)}</span>
                      <span className="font-bold tabular-nums text-ink/50">{argentSigne(v)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-ink/45">{fr(PRIX.exempleHypothesesCourt)}</p>
                <div className="mt-auto pt-6">
                  <BoutonReserver href={lienReservation()} libelle={T.reserve} pleineLargeur sous={fr(PRIX.sousBouton)} className="text-ink" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
