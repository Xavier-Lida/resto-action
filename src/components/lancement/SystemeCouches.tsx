"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Visuel } from "@/components/lancement/visuels";
import { PointCiel } from "@/components/lancement/ui";
import { COUCHES, MOTEURS, PROBLEME } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";

/* LE SYSTÈME, COUCHE PAR COUCHE.

   En défilant, les couches du Système se posent une par une, comme des
   plaques empilées : on t'amène le client, il commande chez toi, la commande
   sort toute seule, il revient, tu vois tout. La couche du moment est rouge
   et soulevée; celles déjà posées gardent un liséré cyan; celles à venir
   attendent au-dessus, transparentes.

   Pas de défilement détourné : le bloc garde sa hauteur, et les couches se
   posent toutes seules quand la section est à l'écran (ou au clic). */

/* L'image posée sur chaque plaque : une vraie photo ou un vrai écran de
   l'app, dans l'ordre des couches. Pas d'icônes. */
const IMAGES: ({ src: string; position: string } | "textos")[] = [
  { src: "/couches/client.webp", position: "center" }, // un client découvre le resto sur son cell
  { src: "/demo-app/client/panier.webp", position: "center top" }, // il passe sa commande sur ton app
  { src: "/demo-app/livreur/livree.webp", position: "center top" }, // la commande part et arrive
  { src: "/demo-app/client/compte.webp", position: "center top" }, // ses points, il revient
  "textos", // le texto du proprio
];

const N = COUCHES.length;

export default function SystemeCouches() {
  const piste = useRef<HTMLDivElement>(null);
  const [actif, setActif] = useState(0);

  // Les couches se posent toutes seules, une toutes les 3,5 secondes, tant
  // que la section est à l'écran. Un clic sur une barre choisit la couche et
  // arrête le défilement automatique. Rien ne bouge si l'appareil demande
  // moins de mouvement : on change alors de couche au clic seulement.
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    const el = piste.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let minuterie: ReturnType<typeof setInterval> | undefined;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (minuterie) clearInterval(minuterie);
        minuterie = undefined;
        if (e.isIntersecting && auto)
          minuterie = setInterval(() => setActif((k) => (k + 1) % N), 3500);
      },
      { threshold: 0.45 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (minuterie) clearInterval(minuterie);
    };
  }, [auto]);

  const allerA = (k: number) => {
    setAuto(false);
    setActif(k);
  };

  const c = COUCHES[actif];

  return (
    <section
      id="systeme"
      className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-24 size-[28rem] rounded-full bg-brand/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-5 pt-16 md:pt-24">
          <p className="max-w-3xl font-display text-xl font-black leading-snug text-white/60 md:text-2xl">
            {fr(PROBLEME)}
          </p>
          <p className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            <PointCiel />
            Le Système, couche par couche
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
            Le Système Nouveaux Clients, au complet.
          </h2>
        </div>

        <div ref={piste} className="relative">
          <div>
            <div className="mx-auto mt-6 grid w-full max-w-6xl items-center gap-2 px-5 md:mt-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-8">
              {/* La pile, à droite à l'ordi, en haut au cellulaire. */}
              <div
                className="relative order-1 h-[16rem] sm:h-[20rem] md:order-2 md:h-[24rem] lg:h-[28rem]"
                aria-hidden="true"
              >
                {COUCHES.map((couche, i) => (
                  <Plaque key={couche.titre} i={i} actif={actif} />
                ))}
              </div>

              {/* Le texte de la couche du moment. */}
              <div className="order-2 lg:order-1">
                <div
                  className="flex items-center gap-2"
                  role="tablist"
                  aria-label="Les couches du Système"
                >
                  {COUCHES.map((couche, k) => (
                    <button
                      key={couche.titre}
                      type="button"
                      role="tab"
                      aria-selected={k === actif}
                      aria-label={`Couche ${k + 1} : ${couche.titre}`}
                      onClick={() => allerA(k)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${k === actif ? "w-10 bg-brand" : k < actif ? "w-5 bg-ciel" : "w-5 bg-white/20 hover:bg-white/40"}`}
                    />
                  ))}
                </div>
                <div key={actif} className="couche-entre" role="tabpanel">
                  <p className="mt-5 text-xs font-black uppercase tracking-widest text-white/50">
                    Couche {actif + 1} sur {N}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-black leading-tight tracking-tight md:text-4xl">
                    {fr(c.titre)}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-white/70 md:text-lg">
                    {fr(c.texte)}
                  </p>
                  <ul className="mt-5 flex list-none flex-wrap gap-2">
                    {c.pieces.map((p) => {
                      const contenu = (
                        <>
                          {fr(p.nom)}
                          {p.href && (
                            <ArrowRight
                              className="size-3.5 opacity-50"
                              aria-hidden="true"
                            />
                          )}
                        </>
                      );
                      const cls =
                        "inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-2 text-sm font-bold ring-1 ring-white/10";
                      return (
                        <li key={p.nom}>
                          {p.href ? (
                            <Link
                              href={p.href}
                              className={`${cls} transition hover:bg-white hover:text-ink`}
                            >
                              {contenu}
                            </Link>
                          ) : (
                            <span className={cls}>{contenu}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-10 md:pb-24">
          <p className="max-w-2xl border-t border-white/10 pt-6 text-white/60">
            {fr(MOTEURS.effort)}
          </p>
        </div>
      </div>
    </section>
  );
}

/* UNE PLAQUE de la pile, vue en isométrique. La couche 0 est en bas. */
function Plaque({ i, actif }: { i: number; actif: number }) {
  const image = IMAGES[i] ?? "textos";
  const posee = i < actif;
  const enCours = i === actif;
  const aVenir = i > actif;
  // Écart entre les plaques (var CSS --ecart, plus serré au cellulaire),
  // centré sur la pile. La couche du moment se soulève un peu.
  const rang = (N - 1) / 2 - i;
  const decalage = `calc(${rang} * var(--ecart) ${enCours ? "- 1.25rem" : aVenir ? "- 6rem" : "+ 0rem"})`;
  return (
    <div
      className="plaque absolute left-1/2 top-1/2 transition-all duration-700 [--cote:9rem] [--ecart:2.4rem] sm:[--cote:11rem] sm:[--ecart:3rem] md:[--cote:12rem] md:[--ecart:3.2rem] lg:[--cote:14.5rem] lg:[--ecart:3.8rem]"
      style={{
        zIndex: i + 1,
        opacity: aVenir ? 0 : 1,
        transform: `translate(-50%, -50%) translateY(${decalage}) rotateX(58deg) rotateZ(-45deg)`,
      }}
    >
      <div
        className={`relative size-[var(--cote)] overflow-hidden rounded-[1.6rem] bg-white transition-all duration-700 lg:rounded-[2.2rem] ${
          enCours
            ? "shadow-[0_0_0_4px_#ff3008,0_30px_60px_-10px_rgba(255,48,8,0.55)]"
            : posee
              ? "shadow-[0_0_0_1.5px_rgba(25,211,240,0.7)]"
              : ""
        }`}
      >
        {image === "textos" ? (
          <div className="absolute inset-0 grid place-items-center bg-bone [&_figure]:mb-0 [&_figure]:h-full [&_figure]:w-full">
            <Visuel type="textos" />
          </div>
        ) : (
          <Image
            src={image.src}
            alt=""
            fill
            sizes="300px"
            className="object-cover"
            style={{ objectPosition: image.position }}
          />
        )}
        {/* Les couches déjà posées s'assombrissent : on suit la couche du moment. */}
        <div
          className={`absolute inset-0 bg-ink transition-opacity duration-700 ${posee ? "opacity-60" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}
