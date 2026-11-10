import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Search, Star } from "lucide-react";
import { Telephone } from "@/components/IllustrationPiece";
import Reveal from "@/components/Reveal";
import { Exemple, PointCiel } from "@/components/lancement/ui";
import { contenuLancement, type Langue } from "@/lib/contenu/lancement";
import { formats } from "@/lib/format";

/* LE SYSTÈME, EN CARTES (à la façon de la page « Restaurant website » d'Owner).

   Une grande carte bleue pour Google, puis des cartes deux par deux : le
   menu qui vend, les clients qui reviennent, la commande qui sort toute
   seule, le texto du proprio. Chaque carte a un vrai visuel (une photo de
   plat, un écran de l'app, un billet, des textos), pas d'icônes. Tous les
   noms et chiffres des maquettes sont des exemples. */

const TEXTES = {
  fr: {
      "eyebrow": "Le Système Nouveaux Clients",
      "titre": "Tout ce qu'il faut pour vendre plus en ligne. Fait pour toi.",
      "recherche": "pizza près de moi",
      "nomResto": "Ton Resto",
      "statut": "Restaurant · Ouvert",
      "commander": "Commander",
      "gSurtitre": "Plus de clients Google",
      "gTitre": "Ton resto sort dans Google, et on va chercher tes premiers clients.",
      "mSurtitre": "Commande en ligne incluse",
      "mTitre": "Un menu qui fait monter la facture.",
      "mDesc": "2 sauces au choix, laitue, tomate, oignons caramélisés.",
      "mPrix": "13,99 $",
      "mExtra": "Ajoute une poutine?",
      "mExtraPrix": "5,49 $",
      "fSurtitre": "Clients fidèles",
      "fTitre": "Tes clients reviennent, tout seuls.",
      "fAlt": "Le compte client avec ses points de fidélité",
      "iSurtitre": "Imprimante offerte",
      "iTitre": "La commande sort toute seule en cuisine.",
      "iResto": "TON RESTO",
      "iNo": "Commande n° 142 · ",
      "iMode": "LIVRAISON · 19 h 42",
      "tSurtitre": "Le Texto du Lundi",
      "tTitre": "Chaque lundi, tes chiffres en un texto.",
      "t1": "Ce soir : 7 commandes directes.",
      "t2": "Cette semaine : 31 commandes, 12 nouveaux clients.",
      "t3": "Ta 100e commande arrive bientôt.",
      "plus": "En savoir plus",
    "ex": "exemple"
  },
  en: {
      "eyebrow": "The New Customer System",
      "titre": "Everything you need to sell more online. Done for you.",
      "recherche": "pizza near me",
      "nomResto": "Your Restaurant",
      "statut": "Restaurant · Open",
      "commander": "Order",
      "gSurtitre": "More Google customers",
      "gTitre": "Your restaurant shows up on Google, and we go get your first customers.",
      "mSurtitre": "Online ordering built in",
      "mTitre": "A menu that grows every order.",
      "mDesc": "Choice of 2 sauces, lettuce, tomato, caramelized onions.",
      "mPrix": "$13.99",
      "mExtra": "Add a poutine?",
      "mExtraPrix": "$5.49",
      "fSurtitre": "Loyal customers",
      "fTitre": "Your customers come back on their own.",
      "fAlt": "The customer account with loyalty points",
      "iSurtitre": "Printer included",
      "iTitre": "Orders print right in your kitchen.",
      "iResto": "YOUR RESTAURANT",
      "iNo": "Order #142 · ",
      "iMode": "DELIVERY · 7:42 PM",
      "tSurtitre": "The Monday Text",
      "tTitre": "Every Monday, your numbers in one text.",
      "t1": "Tonight: 7 direct orders.",
      "t2": "This week: 31 orders, 12 new customers.",
      "t3": "Your 100th order is coming up.",
      "plus": "Learn more",
    "ex": "example"
  },
};

function Carte({
  surtitre,
  titre,
  href,
  className = "",
  sombre = false,
  plus,
  children,
}: {
  surtitre: string;
  titre: string;
  href?: string;
  className?: string;
  sombre?: boolean;
  plus: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`group relative flex h-full min-h-[26rem] flex-col overflow-hidden rounded-[2rem] ${className}`}>
      <div className="relative z-10 p-7 md:p-8">
        <p className={`text-xs font-bold ${sombre ? "text-white/70" : "text-ink/55"}`}>{surtitre}</p>
        <h3 className="mt-2 max-w-sm font-display text-xl font-black leading-tight tracking-tight md:text-2xl">{titre}</h3>
        {href && (
          <Link
            href={href}
            className={`mt-3 inline-flex items-center gap-1.5 text-sm font-black ${sombre ? "text-white/80 hover:text-white" : "text-ink/60 hover:text-brand"}`}
          >
            {plus}
            <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="relative flex flex-1 items-end justify-center">{children}</div>
    </div>
  );
}

export default function SystemeBento({ langue = "fr" }: { langue?: Langue }) {
  const { MOTEURS, PROBLEME } = contenuLancement(langue);
  const { typo: fr } = formats(langue);
  const T = TEXTES[langue];
  return (
    <section id="systeme" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <Reveal>
          <p className="max-w-3xl font-display text-xl font-black leading-snug text-ink/45 md:text-2xl">{fr(PROBLEME)}</p>
          <p className="mt-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ink/50">
            <PointCiel />
            {T.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {T.titre}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {/* 1. GOOGLE : la grande carte bleue */}
          <Reveal className="md:col-span-2">
            <div className="relative grid overflow-hidden rounded-[2rem] bg-gradient-to-br from-ciel via-[#3d8bf0] to-[#5b5ff0] text-white md:min-h-[24rem] md:grid-cols-2">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(60%_80%_at_20%_100%,#ffffff55,transparent)]" />
              <div className="relative order-2 px-6 pb-0 pt-2 md:order-1 md:px-10 md:pt-10">
                {/* La maquette : une recherche Google, ta fiche en premier. */}
                <div className="mx-auto max-w-sm rounded-t-[1.75rem] bg-white/25 p-3 pb-0 ring-1 ring-white/40 backdrop-blur md:mx-0">
                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm text-ink/60 shadow-sm">
                    <Search className="size-4" aria-hidden="true" />
                    {T.recherche}
                  </div>
                  <div className="relative mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 text-ink shadow-lg shadow-ink/10">
                    <span className="absolute -top-2.5 right-3 rounded-full bg-white">
                      <Exemple>{T.ex}</Exemple>
                    </span>
                    <Image src="/resultats-pizza.webp" alt="" width={56} height={56} className="size-14 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black">{T.nomResto}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs font-bold">
                        4,8
                        {Array.from({ length: 5 }).map((_, k) => (
                          <Star key={k} className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                        ))}
                      </p>
                      <p className="text-xs text-ink/55">{T.statut}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-xs font-black text-white">{T.commander}</span>
                  </div>
                  {[0, 1].map((k) => (
                    <div key={k} className={`mt-3 flex items-center gap-3 rounded-2xl bg-white/60 p-3 ${k === 1 ? "opacity-70" : ""}`} aria-hidden="true">
                      <span className="size-14 rounded-xl bg-white/70" />
                      <span className="flex-1 space-y-2">
                        <span className="block h-2.5 w-2/3 rounded-full bg-white" />
                        <span className="block h-2 w-1/2 rounded-full bg-white/80" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative order-1 flex flex-col justify-center p-7 md:order-2 md:p-10">
                <p className="text-xs font-black uppercase tracking-widest text-white/80">{T.gSurtitre}</p>
                <h3 className="mt-3 max-w-md font-display text-2xl font-black leading-tight tracking-tight md:text-4xl">
                  {T.gTitre}
                </h3>
                <Link href={langue === "en" ? "/en/platform/google-visibility" : "/plateforme/referencement-google"} className="mt-5 inline-flex items-center gap-1.5 text-sm font-black text-white/85 hover:text-white">
                  {T.plus}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* 2. LE MENU QUI VEND */}
          <Reveal className="h-full">
            <Carte plus={T.plus} surtitre={fr(T.mSurtitre)} titre={fr(T.mTitre)} href={langue === "en" ? "/en/platform/menu-that-sells" : "/plateforme/menu-qui-vend"} className="bg-[#efe9e1]">
              <div className="relative mb-[-1rem] w-[82%] max-w-sm">
                <div className="absolute -top-8 left-6 right-6 h-16 rounded-2xl bg-white/50" aria-hidden="true" />
                <div className="absolute -top-4 left-3 right-3 h-16 rounded-2xl bg-white/75" aria-hidden="true" />
                <div className="relative rounded-2xl bg-white p-4 shadow-xl shadow-ink/10">
                  <div className="flex gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-black">Panuozzo Al Tonno</p>
                      <p className="mt-1 text-xs leading-snug text-ink/55">{T.mDesc}</p>
                      <p className="mt-2 text-sm font-black">{T.mPrix}</p>
                    </div>
                    <Image src="/resultats-gotham.webp" alt="" width={80} height={80} className="size-20 rounded-xl object-cover" />
                  </div>
                  {/* L'extra proposé au bon moment */}
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-bone p-2.5">
                    <Image src="/resultats-poutine.webp" alt="" width={40} height={40} className="size-10 rounded-lg object-cover" />
                    <p className="flex-1 text-xs font-bold">{T.mExtra}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-xs font-black text-white">
                      <Plus className="size-3" aria-hidden="true" />
                      {T.mExtraPrix}
                    </span>
                  </div>
                </div>
                <div className="h-8" />
              </div>
            </Carte>
          </Reveal>

          {/* 3. ILS REVIENNENT */}
          <Reveal delay={1} className="h-full">
            <Carte plus={T.plus} surtitre={fr(T.fSurtitre)} titre={fr(T.fTitre)} href={langue === "en" ? "/en/platform/points-rewards" : "/plateforme/points-recompenses"} className="bg-bone">
              <div className="absolute inset-x-6 bottom-0 h-[55%] rounded-t-[1.75rem] bg-brand" aria-hidden="true" />
              <div className="relative mb-[-5rem] w-44 -rotate-12 drop-shadow-[0_30px_30px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:-translate-y-2 md:w-48">
                <Telephone ecran={{ src: "/demo-app/client/compte.webp", alt: T.fAlt }} />
              </div>
            </Carte>
          </Reveal>

          {/* 4. LA COMMANDE SORT TOUTE SEULE */}
          <Reveal className="h-full">
            <Carte plus={T.plus} surtitre={fr(T.iSurtitre)} titre={fr(T.iTitre)} href={langue === "en" ? "/en/platform/kitchen-printer" : "/plateforme/imprimante-cuisine"} className="bg-ink text-white" sombre>
              <div className="relative mb-[-0.5rem] w-72 max-w-[85%] rotate-2 rounded-t-lg bg-white px-5 pb-10 pt-5 font-mono text-[0.78rem] text-ink shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                <p className="text-center font-black tracking-widest">{T.iResto}</p>
                <p className="mt-1 text-center text-[0.65rem] text-ink/50">
                  {T.iNo}<Exemple>{T.ex}</Exemple>
                </p>
                <p className="mt-3 border-y border-dashed border-ink/30 py-1.5 text-center font-black">{T.iMode}</p>
                <div className="mt-3 space-y-1.5">
                  {[
                    ["1 × Panuozzo Al Tonno", "13,99"],
                    ["1 × Poutine classique", "11,49"],
                    ["2 × Pizza 12 po", "26,52"],
                  ].map(([l, v]) => (
                    <p key={l} className="flex justify-between gap-3">
                      <span>{l}</span>
                      <span>{v}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3 flex justify-between border-t border-dashed border-ink/30 pt-2 font-black">
                  <span>TOTAL</span>
                  <span>52,00 $</span>
                </p>
              </div>
            </Carte>
          </Reveal>

          {/* 5. LE TEXTO DU PROPRIO */}
          <Reveal delay={1} className="h-full">
            <Carte plus={T.plus} surtitre={fr(T.tSurtitre)} titre={fr(T.tTitre)} href={langue === "en" ? "/en/platform/monday-text" : "/plateforme/texto-du-lundi"} className="bg-gradient-to-br from-[#e6f9fd] to-[#d7ecff]">
              <div className="mb-8 w-[85%] max-w-sm space-y-3">
                <div className="flex justify-between text-[0.65rem] font-black uppercase tracking-widest text-ink/40">
                  <span>Resto Action</span>
                  <Exemple>{T.ex}</Exemple>
                </div>
                <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm shadow-sm">{T.t1}</p>
                <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/30">
                  {T.t2}
                </p>
                <p className="w-fit rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm shadow-sm">{T.t3}</p>
              </div>
            </Carte>
          </Reveal>
        </div>

        <p className="mt-8 max-w-2xl text-ink/60">{fr(MOTEURS.effort)}</p>
      </div>
    </section>
  );
}
