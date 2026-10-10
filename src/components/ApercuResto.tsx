/* eslint-disable @next/next/no-img-element -- les photos viennent de notre
   relais /api/places/photo, déjà redimensionnées par Google : next/image n'y
   ajouterait qu'une deuxième passe. */
import { Bell, Gift, House, MapPin, ShoppingBag, Star, User, UtensilsCrossed } from "lucide-react";
import type { LieuResto } from "@/lib/places";
import type { Textes } from "@/lib/textes/fr";

/* L'APERÇU AUTOMATIQUE DE L'APP D'UN RESTO, AVEC SA VRAIE FICHE GOOGLE.

   Son nom en logo, son adresse, sa note, ses photos. Rien d'inventé : pas de
   plats ni de prix (on ne connaît pas encore son menu), seulement ce que sa
   fiche Google dit déjà. L'étiquette « Aperçu automatique » est toujours
   visible : la vraie maquette, faite à la main avec son menu, suit en 48 h. */

export const COULEURS = ["#b03a2e", "#ff3008", "#1f6b45", "#1d4ed8", "#191919"];
const ONGLETS = [House, UtensilsCrossed, Gift, User];

export function urlPhoto(nom: string, largeur = 600): string {
  return `/api/places/photo?nom=${encodeURIComponent(nom)}&l=${largeur}`;
}

export default function ApercuResto({
  t,
  lieu,
  couleur,
}: {
  t: Textes;
  lieu: LieuResto;
  couleur: string;
}) {
  const a = t.hero.apercu;
  const [principale, ...autres] = lieu.photos;
  const note = lieu.note?.toLocaleString(t.htmlLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <div className="relative mx-auto w-[16rem] rounded-[2.6rem] bg-ink p-2.5 shadow-2xl md:w-[17rem]">
      <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest text-white shadow">
        {a.etiquette}
      </span>
      <div className="relative h-[32rem] overflow-hidden rounded-[2.1rem] bg-[#faf6f1] text-[#2a1712]">
        <div className="gen-defile px-3.5 pb-24 pt-5">
          {/* En-tête : son nom en logo */}
          <div className="flex items-center justify-between gap-2">
            <p className="max-w-[10rem] truncate font-script text-[1.7rem] font-bold leading-none">{lieu.nom}</p>
            <span className="flex gap-1.5">
              <span className="grid size-8 place-items-center rounded-full bg-white shadow-sm">
                <Bell className="size-3.5" aria-hidden="true" />
              </span>
              <span className="grid size-8 place-items-center rounded-full bg-white shadow-sm">
                <ShoppingBag className="size-3.5" aria-hidden="true" />
              </span>
            </span>
          </div>

          {/* Son adresse et sa note Google */}
          <div className="mt-3 rounded-2xl bg-white p-2.5 shadow-sm">
            <p className="flex items-start gap-1.5 text-[0.62rem] font-bold leading-snug">
              <MapPin className="mt-px size-3 shrink-0" style={{ color: couleur }} aria-hidden="true" />
              <span className="line-clamp-2">{lieu.adresse}</span>
            </p>
            {note && (
              <p className="mt-1.5 flex items-center gap-1 text-[0.62rem] font-black">
                <Star className="size-3 fill-current" style={{ color: couleur }} aria-hidden="true" />
                {note}
                {lieu.avis !== null && (
                  <span className="font-bold text-[#2a1712]/55">
                    · {lieu.avis.toLocaleString(t.htmlLang)} {a.avis}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Sa photo principale en bannière */}
          <div className="relative mt-3 h-36 overflow-hidden rounded-3xl bg-[#2b1a15]">
            {principale && (
              <img src={urlPhoto(principale, 600)} alt="" className="absolute inset-0 size-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span
              className="absolute bottom-3 left-3 inline-flex items-center rounded-full px-3.5 py-1.5 text-[0.7rem] font-black text-white transition-colors duration-500"
              style={{ background: couleur }}
            >
              {a.commander}
            </span>
          </div>

          {/* Ses autres photos */}
          {autres.length > 0 && (
            <>
              <p className="mt-4 font-display text-sm font-black">{a.vedette}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {autres.slice(0, 2).map((p) => (
                  <img key={p} src={urlPhoto(p, 300)} alt="" className="h-24 w-full rounded-2xl object-cover" />
                ))}
              </div>
            </>
          )}

          {/* Les points de fidélité */}
          <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
            <p className="flex items-center gap-1.5 text-xs font-black">
              <Gift className="size-3.5" style={{ color: couleur }} aria-hidden="true" />
              {a.points}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#efe6dc]">
              <div className="h-full w-3/5 rounded-full transition-colors duration-500" style={{ background: couleur }} />
            </div>
          </div>
        </div>

        {/* Barre d'onglets */}
        <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-[#2a1712]/5 bg-white/95 px-2 pb-4 pt-2.5 backdrop-blur">
          {ONGLETS.map((Icone, k) => (
            <Icone
              key={k}
              className="size-4 transition-colors duration-500"
              style={{ color: k === 0 ? couleur : "#2a171299" }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
