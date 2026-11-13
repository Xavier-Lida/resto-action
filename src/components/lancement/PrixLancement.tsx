import { Check } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import Reveal from "@/components/Reveal";
import { Exemple, Surtitre } from "@/components/lancement/ui";
import { contenuLancement, type Langue } from "@/lib/contenu/lancement";
import { formats } from "@/lib/format";

/* BLOC 5 : LE PRIX, EN UN COUP D'ŒIL.

   À gauche, ce que ça coûte, comme une facture : le gros 200 $ par mois,
   puis trois lignes (mise en service, cueillette, livraison) et les
   pastilles en simple liste. À droite,
   ce que ça rapporte : +629 $ et deux lignes simples (les nouvelles
   commandes, moins de commissions), puis le bouton. En dessous, les bonus en bande. Le détail complet reste
   dans /conditions-fondateur. */

const TEXTES = {
  fr: {
    surtitre: "Le prix",
    cout: "Ce que ça coûte",
    parMois: "par mois",
    ligneMise: "Mise en service",
    ligneMiseDetail: (b: string) => `une fois · au lieu de ${b} $`,
    montant: (n: string) => `${n} $`,
    garantieMise: "Remboursée si ton app ne te l'a pas rapportée en 90 jours.",
    cueillette: "Par cueillette",
    livraison: "Par livraison",
    frais: (pct: number, fixe: string) => `${pct} % + ${fixe} $`,
    clientPaie: (m: string) => `ton client paie ${m} $`,
    pastilles: ["Pas de dépôt", "Frais de carte inclus", "Imprimante offerte", "Aucun minimum", "Taxes en sus"],
    bonus: "Les bonus",
    rapporte: "Ce que ça rapporte",
    dePlus: "de plus dans tes poches chaque mois, abonnement payé",
    /* 13 nov. : deux lignes simples au lieu de la barre et des quatre montants. */
    sources: ["40 nouvelles commandes par mois, de clients qu'on va chercher", "Moins de commissions sur ce qui passe à ton app"],
    calcule: "Calcule le tien",
    reserve: "Réserve ta place",
    nombre: (n: number) => n.toLocaleString("fr-CA", { minimumFractionDigits: 2 }),
  },
  en: {
    surtitre: "The price",
    cout: "What it costs",
    parMois: "per month",
    ligneMise: "Setup",
    ligneMiseDetail: (b: string) => `one time · instead of $${b}`,
    montant: (n: string) => `$${n}`,
    garantieMise: "Refunded if your app hasn't paid it back within 90 days.",
    cueillette: "Per pickup",
    livraison: "Per delivery",
    frais: (pct: number, fixe: string) => `${pct}% + $${fixe}`,
    clientPaie: (m: string) => `your customer pays $${m}`,
    pastilles: ["No deposit", "Card fees included", "Printer included", "No minimum", "Plus taxes"],
    bonus: "The bonuses",
    rapporte: "What it brings in",
    dePlus: "more in your pocket every month, after the subscription",
    sources: ["40 new orders a month, from customers we go out and find", "Less commission on what moves to your app"],
    calcule: "Calculate yours",
    reserve: "Reserve your spot",
    nombre: (n: number) => n.toLocaleString("en-CA", { minimumFractionDigits: 2 }),
  },
};

export default function PrixLancement({ langue = "fr" }: { langue?: Langue }) {
  const { ABONNEMENT, ANCRES, BONUS_COURT, BONUS_SECTION, FRAIS, MISE_EN_SERVICE_ACTUELLE, MISE_EN_SERVICE_ENSUITE, PRIX, disponible, lienReservation } =
    contenuLancement(langue);
  const { typo: fr, argentSigne } = formats(langue);
  const T = TEXTES[langue];
  const virgule = T.nombre;
  const bonus = BONUS_COURT.filter(disponible);

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
                {/* Comme une facture : le gros chiffre, puis trois lignes. */}
                <div className="rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10 md:p-9">
                  <p className="text-xs font-black uppercase tracking-widest text-white/50">{T.cout}</p>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-3">
                    <span className="whitespace-nowrap font-display text-5xl font-black tracking-tight md:text-7xl">{fr(T.montant(String(ABONNEMENT)))}</span>
                    <span className="whitespace-nowrap text-lg font-black text-brand">{T.parMois}</span>
                  </p>
                  <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
                    {[
                      [T.ligneMise, fr(T.montant(String(MISE_EN_SERVICE_ACTUELLE))), fr(T.ligneMiseDetail(MISE_EN_SERVICE_ENSUITE.toLocaleString(langue === "en" ? "en-CA" : "fr-CA")))],
                      [T.cueillette, fr(T.frais(FRAIS.cueillettePct * 100, virgule(FRAIS.cueilletteFixe))), ""],
                      [T.livraison, fr(T.frais(FRAIS.livraisonPct * 100, virgule(FRAIS.livraisonFixe))), fr(T.clientPaie(virgule(FRAIS.livraisonClient)))],
                    ].map(([libelle, valeur, detail]) => (
                      <div key={libelle} className="flex items-baseline justify-between gap-4 py-3.5">
                        <dt className="min-w-0">
                          <span className="block font-bold text-white/85">{libelle}</span>
                          {detail && <span className="block text-xs text-white/50">{detail}</span>}
                        </dt>
                        <dd className="shrink-0 whitespace-nowrap font-display text-lg font-black md:text-2xl">{valeur}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-sm text-white/60">{fr(T.garantieMise)}</p>
                  <ul className="mt-5 flex list-none flex-wrap gap-x-4 gap-y-1.5 text-sm font-bold text-white/75">
                    {T.pastilles.map((p) => (
                      <li key={p} className="inline-flex items-center gap-1.5">
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
                            {b.expire && <span className="ml-1.5 text-sm font-semibold text-white/75">({fr(BONUS_SECTION.etiquetteCourte).toLowerCase()})</span>}
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
              <div className="flex h-full flex-col rounded-[2rem] bg-white p-6 text-ink md:p-9">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-widest text-ink/50">{T.rapporte}</p>
                  <Exemple>{PRIX.exempleMention}</Exemple>
                </div>
                <p className="mt-4 whitespace-nowrap font-display text-5xl font-black tracking-tight text-brand md:text-7xl">{argentSigne(PRIX.exempleTotal)}</p>
                <p className="mt-1 text-lg font-black leading-snug">{T.dePlus}</p>
                <ul className="mt-6 grid list-none gap-3">
                  {T.sources.map((l) => (
                    <li key={l} className="flex gap-3 text-ink/75">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {fr(l)}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-ink/50">
                  {fr(PRIX.exempleHypothesesCourt)}{" "}
                  <a href={ANCRES.calculateur} className="font-bold text-ink underline decoration-ciel decoration-2 underline-offset-2 hover:text-brand">
                    {T.calcule}
                  </a>
                </p>
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
