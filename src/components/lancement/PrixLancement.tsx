import { Check, ShieldCheck } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import Reveal from "@/components/Reveal";
import { contenuLancement, type Langue } from "@/lib/contenu/lancement";
import { formats } from "@/lib/format";

/* BLOC 5 : LE PRIX, TOUT COMPRIS (16 nov.).

   Une seule carte, blanche, comme un forfait : le 200 $ par mois en gros,
   puis trois lignes (mise en service, cueillette, livraison), la garantie
   sur la mise en service, ce qui est inclus. À côté, les bonus et le bouton.
   La carte « ce que ça rapporte » est partie : le calculateur fait ce travail.
   Le détail complet reste dans /conditions-fondateur. */

const TEXTES = {
  fr: {
    forfait: "Ton forfait",
    parMois: "/ mois",
    abonnement: "Abonnement, tout compris",
    ligneMise: "Mise en service",
    ligneMiseDetail: "Une seule fois",
    montant: (n: string) => `${n} $`,
    garantieMise: "Ta mise en service est remboursée si ton app ne te l'a pas rapportée en 90 jours.",
    parCommande: "Par commande",
    cueillette: "Cueillette",
    livraison: "Livraison",
    frais: (pct: number, fixe: string) => `${pct} % + ${fixe} $`,
    clientPaie: (m: string) => `Ton client paie ${m} $`,
    inclus: ["Pas de dépôt", "Frais de carte inclus", "Imprimante offerte", "Aucun minimum"],
    taxes: "Taxes en sus.",
    bonus: "Les bonus",
    reserve: "Réserve ta place",
    nombre: (n: number) => n.toLocaleString("fr-CA", { minimumFractionDigits: 2 }),
  },
  en: {
    forfait: "Your plan",
    parMois: "/ month",
    abonnement: "Subscription, all in",
    ligneMise: "Setup",
    ligneMiseDetail: "One time",
    montant: (n: string) => `$${n}`,
    garantieMise: "Your setup is refunded if your app hasn't paid it back within 90 days.",
    parCommande: "Per order",
    cueillette: "Pickup",
    livraison: "Delivery",
    frais: (pct: number, fixe: string) => `${pct}% + $${fixe}`,
    clientPaie: (m: string) => `Your customer pays $${m}`,
    inclus: ["No deposit", "Card fees included", "Printer included", "No minimum"],
    taxes: "Plus taxes.",
    bonus: "The bonuses",
    reserve: "Reserve your spot",
    nombre: (n: number) => n.toLocaleString("en-CA", { minimumFractionDigits: 2 }),
  },
};

export default function PrixLancement({ langue = "fr" }: { langue?: Langue }) {
  const { ABONNEMENT, ANCRES, BONUS_COURT, BONUS_SECTION, FRAIS, MISE_EN_SERVICE_ACTUELLE, MISE_EN_SERVICE_ENSUITE, PRIX, disponible, lienReservation } =
    contenuLancement(langue);
  const { typo: fr } = formats(langue);
  const T = TEXTES[langue];
  const virgule = T.nombre;
  const bonus = BONUS_COURT.filter(disponible);
  const ensuite = T.montant(MISE_EN_SERVICE_ENSUITE.toLocaleString(langue === "en" ? "en-CA" : "fr-CA"));

  return (
    <section id={ANCRES.prix.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-brand/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-ciel/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-14 md:py-24">
          <Reveal>
            <h2 className="font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">{PRIX.titre}</h2>
          </Reveal>

          <div className="mt-8 grid gap-4 md:mt-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-5">
            {/* LE FORFAIT */}
            <Reveal>
              <div className="rounded-[2rem] bg-white p-6 text-ink shadow-2xl shadow-black/30 md:p-9">
                <p className="text-xs font-black uppercase tracking-widest text-ink/45">{T.forfait}</p>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-3">
                  <span className="whitespace-nowrap font-display text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">{fr(T.montant(String(ABONNEMENT)))}</span>
                  <span className="whitespace-nowrap text-xl font-black text-ink/40">{T.parMois}</span>
                </div>
                <p className="mt-1 font-bold text-ink/60">{T.abonnement}</p>

                {/* La mise en service, une ligne */}
                <div className="mt-7 flex items-center justify-between gap-4 rounded-2xl bg-bone px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-black">{T.ligneMise}</p>
                    <p className="text-sm text-ink/55">{T.ligneMiseDetail}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="whitespace-nowrap font-display text-2xl font-black md:text-3xl">{fr(T.montant(String(MISE_EN_SERVICE_ACTUELLE)))}</p>
                    <p className="whitespace-nowrap text-sm font-bold text-ink/40 line-through">{fr(ensuite)}</p>
                  </div>
                </div>

                {/* Par commande : deux tuiles côte à côte */}
                <p className="mt-6 text-xs font-black uppercase tracking-widest text-ink/45">{T.parCommande}</p>
                {/* Au cellulaire : deux lignes (libellé à gauche, montant à droite). À l'ordi : deux tuiles. */}
                <div className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-3">
                  {[
                    [T.cueillette, fr(T.frais(FRAIS.cueillettePct * 100, virgule(FRAIS.cueilletteFixe))), ""],
                    [T.livraison, fr(T.frais(FRAIS.livraisonPct * 100, virgule(FRAIS.livraisonFixe))), fr(T.clientPaie(virgule(FRAIS.livraisonClient)))],
                  ].map(([libelle, valeur, note]) => (
                    <div key={libelle} className="flex items-center justify-between gap-3 rounded-2xl bg-bone px-4 py-3.5 sm:block sm:py-4">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink/55">{libelle}</p>
                        {note && <p className="text-xs text-ink/50 sm:hidden">{note}</p>}
                      </div>
                      <p className="shrink-0 whitespace-nowrap font-display text-lg font-black sm:mt-1 sm:text-2xl">{valeur}</p>
                      {note && <p className="mt-0.5 hidden text-xs text-ink/50 sm:block">{note}</p>}
                    </div>
                  ))}
                </div>

                {/* Ce qui est inclus */}
                <ul className="mt-6 grid list-none gap-x-4 gap-y-2 text-sm font-bold sm:grid-cols-2">
                  {T.inclus.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ciel/20 text-[#0a7f93]">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                {/* La garantie */}
                <p className="mt-6 flex gap-3 rounded-2xl border border-ciel/40 bg-ciel/[0.08] px-4 py-3 text-sm font-bold text-ink/80">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#0a7f93]" aria-hidden="true" />
                  {fr(T.garantieMise)}
                </p>
                <p className="mt-3 text-xs text-ink/45">{T.taxes}</p>
              </div>
            </Reveal>

            {/* LES BONUS ET LE BOUTON, dans une seule carte rouge qui suit la
                hauteur du forfait : plus de trou noir entre les deux. */}
            <Reveal delay={1} className="h-full">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#ff5a36] via-brand to-[#d93212] p-6 shadow-2xl shadow-brand/30 md:p-8">
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/15 blur-2xl" />
                <p className="relative font-display text-2xl font-black md:text-3xl">{T.bonus}</p>
                <ul className="relative mt-5 grid list-none gap-3">
                  {bonus.map((b) => (
                    <li key={b.texte} className="flex gap-3 rounded-2xl bg-white/[0.12] p-4 ring-1 ring-white/15">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white text-brand">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold leading-snug">{fr(b.texte)}</span>
                        {b.expire && (
                          <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-black text-white/85">
                            <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
                            {fr(BONUS_SECTION.etiquetteCourte)}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="relative mt-6 pt-2 lg:mt-auto">
                  <BoutonReserver href={lienReservation()} libelle={T.reserve} pleineLargeur sous={fr(PRIX.sousBouton)} ton="blanc" className="text-white" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
