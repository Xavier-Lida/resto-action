"use client";

import Image from "next/image";
import {
  ArrowRight,
  Bell,
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
} from "lucide-react";
import type { Textes } from "@/lib/textes/fr";

/* LE TÉLÉPHONE DE L'APERÇU D'APP, PARTAGÉ.

   Sorti de GenerateurApp pour servir à deux endroits : la fenêtre « Trouve ton
   resto » du héro, et le formulaire de réservation fondateur (/reserver), où
   il suit en direct le nom et la couleur que le resto choisit. Un seul dessin,
   donc un seul endroit à retoucher. */

export const COULEURS = ["#b03a2e", "#ff3008", "#1f6b45", "#1d4ed8", "#191919"];
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

export default function TelephoneApp({
  g,
  nom,
  couleur,
  chargement = false,
}: {
  g: Textes["hero"]["generateur"];
  nom: string;
  couleur: string;
  /** Un squelette à la place de l'écran, le temps de la « génération ». */
  chargement?: boolean;
}) {
  /* LE TÉLÉPHONE, DESSINÉ COMME L'APP DE BISTRO HABIBI : fond crème,
     logo manuscrit, adresse, bascule livraison / à emporter, bannière
     promo, catégories, populaires, points. La couleur choisie teinte
     tout ce qui est accent. Pendant la génération : un squelette.
     Ensuite, l'écran défile doucement, comme quelqu'un qui scrolle. */
  return (
    <div className="mx-auto w-[17.5rem] rounded-[2.8rem] bg-ink p-2.5 shadow-2xl">
      <div className="relative h-[34rem] overflow-hidden rounded-[2.2rem] bg-[#faf6f1] text-[#2a1712]">
        {chargement ? (
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
                  {nom}
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
  );
}
