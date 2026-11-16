import { Check, Clock, ShieldCheck } from "lucide-react";
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
    ligneMiseDetail: "Une seule fois. Prix du Grand Lancement.",
    moitie: "Moitié prix",
    montant: (n: string) => `${n} $`,
    garantieMise: "Remboursée si ton app ne te l'a pas rapportée en 90 jours.",
    parCommande: "Par commande",
    cueillette: "Cueillette",
    livraison: "Livraison",
    frais: (pct: number, fixe: string) => `${pct} % + ${fixe} $`,
    clientPaie: (m: string) => `Ton client paie ${m} $`,
    inclus: ["Pas de dépôt", "Frais de carte inclus", "Imprimante offerte", "Aucun minimum"],
    taxes: "Taxes en sus.",
    bonus: "Les bonus",
    /* Les 5 bonus en court : le nom, et un détail de 2 à 4 mots. [À RELIRE] */
    bonusCourts: {
      equipement: ["Ton imprimante de cuisine", "valeur 495 $"],
      "boite-lancement": ["Ta Boîte de lancement", "plaques, cartons, affiche"],
      "formation-privee": ["Ta formation privée", "1 h en personne"],
      "credit-sortie": ["Ton Crédit de sortie", "jusqu'à 400 $"],
      "prix-gele": ["Ton Prix gelé", "200 $ / mois, 24 mois"],
    } as Record<string, [string, string]>,
    offerts: "Offerts",
    avantLe: "Si tu signes avant le 18 déc.",
    reserve: "Réserve ta place",
    nombre: (n: number) => n.toLocaleString("fr-CA", { minimumFractionDigits: 2 }),
  },
  en: {
    forfait: "Your plan",
    parMois: "/ month",
    abonnement: "Subscription, all in",
    ligneMise: "Setup",
    ligneMiseDetail: "One time. Big Launch price.",
    moitie: "Half price",
    montant: (n: string) => `$${n}`,
    garantieMise: "Refunded if your app hasn't paid it back within 90 days.",
    parCommande: "Per order",
    cueillette: "Pickup",
    livraison: "Delivery",
    frais: (pct: number, fixe: string) => `${pct}% + $${fixe}`,
    clientPaie: (m: string) => `Your customer pays $${m}`,
    inclus: ["No deposit", "Card fees included", "Printer included", "No minimum"],
    taxes: "Plus taxes.",
    bonus: "The bonuses",
    bonusCourts: {
      equipement: ["Your kitchen printer", "$495 value"],
      "boite-lancement": ["Your Launch Box", "signs, inserts, poster"],
      "formation-privee": ["Your private training", "1 hour in person"],
      "credit-sortie": ["Your Exit Credit", "up to $400"],
      "prix-gele": ["Your Price Lock", "$200 / month, 24 months"],
    } as Record<string, [string, string]>,
    offerts: "Included",
    avantLe: "If you sign by Dec. 18",
    reserve: "Reserve your spot",
    nombre: (n: number) => n.toLocaleString("en-CA", { minimumFractionDigits: 2 }),
  },
};

export default function PrixLancement({ langue = "fr" }: { langue?: Langue }) {
  const { ABONNEMENT, ANCRES, BONUS, FRAIS, MISE_EN_SERVICE_ACTUELLE, MISE_EN_SERVICE_ENSUITE, PRIX, lienReservation } =
    contenuLancement(langue);
  const { typo: fr } = formats(langue);
  const T = TEXTES[langue];
  const virgule = T.nombre;
  const bonus = BONUS.filter((b) => b.disponible && T.bonusCourts[b.id]);
  const groupes: [string, typeof bonus, boolean][] = [
    [T.offerts, bonus.filter((b) => !b.expire), false],
    [T.avantLe, bonus.filter((b) => b.expire), true],
  ];
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

                {/* LA MISE EN SERVICE, MISE EN VALEUR : 750 $ au lieu de 1 500 $,
                    la moitié du prix, et la garantie collée dessus. */}
                <div className="relative mt-7 overflow-hidden rounded-[1.5rem] bg-ink p-5 text-white md:p-6">
                  <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-brand/40 blur-2xl" />
                  <div className="relative flex flex-wrap items-center justify-between gap-2">
                    <p className="font-black">{T.ligneMise}</p>
                    <span className="rounded-full bg-brand px-3 py-1 text-xs font-black">{T.moitie}</span>
                  </div>
                  <div className="relative mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="whitespace-nowrap font-display text-5xl font-black tracking-tight text-brand md:text-6xl">{fr(T.montant(String(MISE_EN_SERVICE_ACTUELLE)))}</span>
                    <span className="whitespace-nowrap font-display text-2xl font-black text-white/40 line-through decoration-brand decoration-[3px] md:text-3xl">{fr(ensuite)}</span>
                  </div>
                  <p className="relative mt-1 text-sm text-white/60">{T.ligneMiseDetail}</p>
                  <p className="relative mt-4 flex gap-2.5 border-t border-white/10 pt-4 text-sm font-bold text-white/90">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ciel" aria-hidden="true" />
                    {fr(T.garantieMise)}
                  </p>
                </div>

                {/* PAR COMMANDE : utile, mais secondaire. Deux lignes sobres. */}
                <dl className="mt-6 grid gap-2 text-sm">
                  {[
                    [`${T.parCommande}, ${T.cueillette.toLowerCase()}`, fr(T.frais(FRAIS.cueillettePct * 100, virgule(FRAIS.cueilletteFixe))), ""],
                    [`${T.parCommande}, ${T.livraison.toLowerCase()}`, fr(T.frais(FRAIS.livraisonPct * 100, virgule(FRAIS.livraisonFixe))), fr(T.clientPaie(virgule(FRAIS.livraisonClient)))],
                  ].map(([libelle, valeur, note]) => (
                    <div key={libelle} className="flex items-baseline justify-between gap-3">
                      <dt className="min-w-0 text-ink/60">
                        {libelle}
                        {note && <span className="text-ink/40"> · {note}</span>}
                      </dt>
                      <dd className="shrink-0 whitespace-nowrap font-black">{valeur}</dd>
                    </div>
                  ))}
                </dl>

                {/* Ce qui est inclus, en petit */}
                <ul className="mt-5 flex list-none flex-wrap gap-x-4 gap-y-1.5 border-t border-bone pt-4 text-sm font-bold text-ink/70">
                  {T.inclus.map((p) => (
                    <li key={p} className="inline-flex items-center gap-1.5">
                      <Check className="size-3.5 text-[#0a7f93]" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-ink/45">{T.taxes}</p>
              </div>
            </Reveal>

            {/* LES BONUS ET LE BOUTON, dans une seule carte rouge qui suit la
                hauteur du forfait : plus de trou noir entre les deux. */}
            <Reveal delay={1} className="h-full">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#ff5a36] via-brand to-[#d93212] p-6 shadow-2xl shadow-brand/30 md:p-8">
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/15 blur-2xl" />
                <p className="relative font-display text-2xl font-black md:text-3xl">{T.bonus}</p>
                {/* Deux groupes, une ligne par bonus : le nom à gauche, le détail à droite. */}
                <div className="relative mt-5 grid gap-5">
                  {groupes.map(([titre, liste, expire]) =>
                    liste.length === 0 ? null : (
                      <div key={titre}>
                        <p className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-white/80">
                          {expire && <Clock className="size-3.5" aria-hidden="true" />}
                          {titre}
                        </p>
                        <ul className="mt-2 list-none divide-y divide-white/15 rounded-2xl bg-white/[0.12] px-4 ring-1 ring-white/15">
                          {liste.map((b) => {
                            const [nom, detail] = T.bonusCourts[b.id];
                            return (
                              <li key={b.id} className="flex items-center gap-3 py-3">
                                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-brand">
                                  <Check className="size-3" aria-hidden="true" />
                                </span>
                                {/* Au cellulaire, le détail passe sous le nom. */}
                                <span className="min-w-0 flex-1">
                                  <span className="block font-bold leading-tight">{fr(nom)}</span>
                                  <span className="mt-0.5 block text-xs font-semibold text-white/75 sm:hidden">{fr(detail)}</span>
                                </span>
                                <span className="hidden shrink-0 text-right text-sm font-semibold text-white/80 sm:block">{fr(detail)}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
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
