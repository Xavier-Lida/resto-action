"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Gift,
  House,
  MapPin,
  Plus,
  Search,
  ShoppingBag,
  Truck,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { RESERVATION_URL } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* « TROUVE TON RESTO » → L'APERÇU DE SON APP.

   Le resto tape son nom. Une courte génération (les trois étapes se cochent)
   puis un téléphone montre SON app : son nom, la couleur qu'il choisit, un menu
   et des points d'exemple. Rien n'est envoyé nulle part : tout se passe dans le
   navigateur. Le nom suit ensuite les boutons (paramètre `resto`), pour la
   réservation ou l'appel.

   Version suivante : la note Google et les photos du resto, par l'API Places. */

const COULEURS = ["#b03a2e", "#ff3008", "#1f6b45", "#1d4ed8", "#191919"];
// Les photos s'apparient par rang aux catégories et aux plats du dictionnaire.
const PHOTOS_CATEGORIES = [
  "/resultats-pizza.webp",
  "/resultats-poutine.webp",
  "/resultats-ailes.webp",
  "/resultats-salade.webp",
  "/resultats-pain-ail.webp",
];
const PHOTOS_PLATS = PHOTOS_CATEGORIES;
const ICONES_ONGLETS = [House, UtensilsCrossed, Gift, User];
const GENERATION = 1800;

export default function GenerateurApp({ t }: { t: Textes }) {
  const g = t.hero.generateur;
  const [nom, setNom] = useState("");
  const [etat, setEtat] = useState<"ferme" | "generation" | "apercu">("ferme");
  const [couleur, setCouleur] = useState(COULEURS[0]);
  const fermer = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (etat !== "generation") return;
    const minuterie = setTimeout(() => setEtat("apercu"), GENERATION);
    return () => clearTimeout(minuterie);
  }, [etat]);

  useEffect(() => {
    if (etat === "ferme") return;
    fermer.current?.focus();
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEtat("ferme");
    };
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [etat]);

  const nomPropre = nom.trim();
  const avecNom = (modele: string) => modele.replace("{nom}", nomPropre);
  const parametre = `resto=${encodeURIComponent(nomPropre)}`;
  const base = RESERVATION_URL ?? `${t.racine}/contact`;
  const reserver = `${base}${base.includes("?") ? "&" : "?"}${parametre}`;

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (nomPropre) setEtat("generation");
        }}
        className="animate-hero delay-2 flex max-w-xl flex-wrap gap-2 rounded-2xl bg-white p-2"
      >
        <label htmlFor="hero-resto" className="sr-only">
          {t.hero.recherche.libelle}
        </label>
        <input
          id="hero-resto"
          name="resto"
          type="text"
          autoComplete="organization"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder={t.hero.recherche.exemple}
          className="min-w-0 flex-1 basis-56 bg-transparent px-3 py-3 text-base text-ink outline-none placeholder:text-ink/50"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-black text-white transition hover:bg-ink active:scale-95"
        >
          <Search className="size-4" aria-hidden="true" />
          {t.hero.recherche.bouton}
        </button>
      </form>

      {etat !== "ferme" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm md:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="apercu-titre"
            className="calc-entre relative grid w-full max-w-4xl items-center gap-8 rounded-[2rem] bg-white p-6 text-ink shadow-2xl md:grid-cols-[minmax(0,1fr)_auto] md:p-10"
          >
            <button
              ref={fermer}
              type="button"
              onClick={() => setEtat("ferme")}
              aria-label={g.fermer}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-bone transition hover:bg-ink hover:text-white"
            >
              <X className="size-5" />
            </button>

            {etat === "generation" ? (
              <div>
                <p id="apercu-titre" className="font-display text-2xl font-black md:text-3xl">
                  {avecNom(g.enCours)}
                </p>
                <ul className="mt-6 grid list-none gap-3">
                  {g.etapes.map((etape, i) => (
                    <li
                      key={etape}
                      style={{ animationDelay: `${0.2 + i * 0.5}s` }}
                      className="calc-entre flex items-center gap-3 font-bold"
                    >
                      <span className="grid size-7 place-items-center rounded-full bg-brand text-white">
                        <Check className="size-4" aria-hidden="true" />
                      </span>
                      {etape}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h2 id="apercu-titre" className="font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
                  {avecNom(g.titre)}
                </h2>
                <p className="mt-4 leading-relaxed text-ink/70">{g.texte}</p>

                <p className="mt-6 text-sm font-bold">{g.couleur}</p>
                <div className="mt-2 flex gap-2">
                  {COULEURS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCouleur(c)}
                      aria-label={c}
                      aria-pressed={couleur === c}
                      className={`size-10 rounded-full ring-offset-2 transition ${
                        couleur === c ? "ring-2 ring-ink" : "hover:scale-110"
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    href={reserver}
                    className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                  >
                    {avecNom(g.reserver)}
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </a>
                  <Link
                    href={`${t.racine}/contact?${parametre}`}
                    className="font-bold underline underline-offset-4 hover:text-brand"
                  >
                    {t.hero.pasPret}
                  </Link>
                </div>
                <p className="mt-6 text-xs text-ink/50">{g.note}</p>
              </div>
            )}

            {/* LE TÉLÉPHONE, DESSINÉ COMME L'APP DE BISTRO HABIBI : fond crème,
                logo manuscrit, adresse, bascule livraison / à emporter, bannière
                promo, catégories, populaires, points. La couleur choisie teinte
                tout ce qui est accent. Pendant la génération : un squelette.
                Ensuite, l'écran défile doucement, comme quelqu'un qui scrolle. */}
            <div className="mx-auto w-[17.5rem] rounded-[2.8rem] bg-ink p-2.5 shadow-2xl">
              <div className="relative h-[34rem] overflow-hidden rounded-[2.2rem] bg-[#faf6f1] text-[#2a1712]">
                {etat === "generation" ? (
                  <div className="flex flex-col gap-3 p-4 pt-6">
                    <div className="h-10 w-28 animate-pulse rounded-lg bg-[#efe6dc]" />
                    <div className="h-14 animate-pulse rounded-2xl bg-[#efe6dc]" />
                    <div className="h-10 animate-pulse rounded-full bg-[#efe6dc]" />
                    <div className="h-36 animate-pulse rounded-3xl bg-[#efe6dc]" />
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((k) => (
                        <div key={k} className="size-12 animate-pulse rounded-full bg-[#efe6dc]" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="gen-defile px-3.5 pb-24 pt-5">
                      {/* En-tête : le nom en logo manuscrit, cloche et sac */}
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="max-w-[10rem] truncate font-script text-[1.9rem] font-bold leading-none"
                          style={{ color: "#2a1712" }}
                        >
                          {nomPropre}
                        </p>
                        <span className="flex gap-1.5">
                          <span className="grid size-8 place-items-center rounded-full bg-white shadow-sm">
                            <Bell className="size-3.5" aria-hidden="true" />
                          </span>
                          <span className="grid size-8 place-items-center rounded-full bg-white shadow-sm">
                            <ShoppingBag className="size-3.5" aria-hidden="true" />
                          </span>
                        </span>
                      </div>

                      {/* Adresse */}
                      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm">
                        <MapPin className="size-4 shrink-0" style={{ color: couleur }} aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span
                            className="block text-[0.55rem] font-black uppercase tracking-widest"
                            style={{ color: couleur }}
                          >
                            {g.livrerA}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-black">
                            {g.adresse}
                            <ChevronDown className="size-3" aria-hidden="true" />
                          </span>
                        </span>
                        <span className="grid size-7 place-items-center rounded-full bg-[#efe6dc]">
                          <Search className="size-3.5" aria-hidden="true" />
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[0.6rem]">
                        <span className="flex items-center gap-1 text-[#2a1712]/70">
                          <span className="size-1.5 rounded-full bg-[#3c8c4e]" />
                          {g.ouvert}
                        </span>
                        <span className="font-black uppercase tracking-wide" style={{ color: couleur }}>
                          {g.delai}
                        </span>
                      </div>

                      {/* Livraison / à emporter */}
                      <div className="mt-2.5 flex rounded-full bg-white p-1 ring-1 ring-[#2a1712]/10">
                        <span
                          className="flex flex-1 items-center justify-center gap-1 rounded-full py-1.5 text-[0.7rem] font-black text-white transition-colors duration-500"
                          style={{ background: couleur }}
                        >
                          <Truck className="size-3" aria-hidden="true" />
                          {g.livraison}
                        </span>
                        <span className="flex flex-1 items-center justify-center gap-1 py-1.5 text-[0.7rem] font-black">
                          <ShoppingBag className="size-3" aria-hidden="true" />
                          {g.cueillette}
                        </span>
                      </div>

                      {/* Bannière promo */}
                      <div className="relative mt-3 overflow-hidden rounded-3xl bg-[#2b1a15] p-4 text-white">
                        <Image
                          src="/resultats-poutine.webp"
                          alt=""
                          width={512}
                          height={512}
                          className="absolute -right-10 top-2 size-36 rounded-full object-cover opacity-90"
                        />
                        <div className="relative max-w-[9rem]">
                          <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[0.5rem] font-black uppercase tracking-widest">
                            {g.promo.etiquette}
                          </span>
                          <p className="mt-2 font-display text-lg font-black uppercase leading-[1.05]">
                            {g.promo.titre}
                          </p>
                          <p className="mt-1 text-[0.6rem] leading-snug text-white/75">
                            {g.promo.texte}
                          </p>
                          <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[0.65rem] font-black text-[#2a1712]">
                            {g.promo.bouton}
                            <ArrowRight className="size-3" aria-hidden="true" />
                          </span>
                        </div>
                      </div>

                      {/* Catégories */}
                      <div className="mt-4 flex gap-2.5 overflow-hidden">
                        {g.categories.map((cat, k) => (
                          <span key={cat} className="flex w-12 shrink-0 flex-col items-center gap-1">
                            <span className="size-12 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-[#2a1712]/5">
                              <Image
                                src={PHOTOS_CATEGORIES[k % PHOTOS_CATEGORIES.length]}
                                alt=""
                                width={512}
                                height={512}
                                className="size-full scale-125 object-cover"
                              />
                            </span>
                            <span className="text-[0.55rem] font-bold">{cat}</span>
                          </span>
                        ))}
                      </div>

                      {/* Populaires */}
                      <div className="mt-4 flex items-baseline justify-between">
                        <p className="font-display text-base font-black">{g.populaires}</p>
                        <span className="text-[0.65rem] font-black" style={{ color: couleur }}>
                          {g.toutVoir}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {g.plats.slice(0, 4).map((plat, k) => (
                          <div
                            key={plat.nom}
                            style={{ animationDelay: `${0.1 + k * 0.12}s` }}
                            className="calc-entre overflow-hidden rounded-2xl bg-white shadow-sm"
                          >
                            <Image
                              src={PHOTOS_PLATS[k % PHOTOS_PLATS.length]}
                              alt=""
                              width={512}
                              height={512}
                              className="h-20 w-full object-cover"
                            />
                            <div className="p-2">
                              <p className="truncate text-[0.65rem] font-black">{plat.nom}</p>
                              <div className="mt-1 flex items-center justify-between">
                                <span className="text-[0.7rem] font-black" style={{ color: couleur }}>
                                  {plat.prix}
                                </span>
                                <span
                                  className="grid size-5 place-items-center rounded-full text-white transition-colors duration-500"
                                  style={{ background: couleur }}
                                >
                                  <Plus className="size-3" aria-hidden="true" />
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Points */}
                      <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
                        <p className="flex items-center gap-1.5 text-xs font-black">
                          <Gift className="size-3.5" style={{ color: couleur }} aria-hidden="true" />
                          {g.points}
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#efe6dc]">
                          <div
                            className="h-full w-4/5 rounded-full transition-colors duration-500"
                            style={{ background: couleur }}
                          />
                        </div>
                        <p className="mt-1.5 text-[0.6rem] text-[#2a1712]/60">{g.pointsDetail}</p>
                      </div>
                    </div>

                    {/* Barre d'onglets, fixe en bas de l'écran */}
                    <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-[#2a1712]/5 bg-white/95 px-2 pb-4 pt-2.5 backdrop-blur">
                      {g.onglets.map((o, k) => {
                        const Icone = ICONES_ONGLETS[k % ICONES_ONGLETS.length];
                        return (
                          <span
                            key={o}
                            className="flex flex-col items-center gap-0.5 text-[0.55rem] font-bold"
                            style={{ color: k === 0 ? couleur : "#2a171299" }}
                          >
                            <Icone className="size-4" aria-hidden="true" />
                            {o}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
