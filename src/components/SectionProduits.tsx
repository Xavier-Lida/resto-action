"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import DemoApp from "@/components/DemoApp";
import DemoTablette from "@/components/DemoTablette";
import type { Textes } from "@/lib/textes/fr";

/* TROIS APPS, UN SEUL SYSTÈME — EN ONGLETS QUI TOURNENT SEULS.

   Les trois apps étaient trois blocs empilés, téléphone à gauche puis à droite.
   Elles deviennent une liste à gauche et UN téléphone à droite : l'app active
   montre son texte et sa barre de minuterie, puis la suivante prend le relais
   après DUREE. Même règles que la section Résultats : rien ne tourne hors écran
   ni en mouvement réduit, et un clic choisit l'app (la minuterie repart). */

const DUREE = 9000;

export default function SectionProduits({ t }: { t: Textes }) {
  const apps = t.produits.apps;
  const [i, setI] = useState(0);
  // Le sens du dernier changement, pour faire glisser la carte du bon côté
  // au cellulaire : 1 = vers la suivante, -1 = vers la précédente.
  const [sens, setSens] = useState(1);
  const toucher = useRef<number | null>(null);
  const aller = (k: number) => {
    setSens(k >= i ? 1 : -1);
    setI((k + apps.length) % apps.length);
  };
  const [enVue, setEnVue] = useState(false);
  const [anime, setAnime] = useState(true);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const requete = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lire = () => setAnime(!requete.matches);
    lire();
    requete.addEventListener("change", lire);
    return () => requete.removeEventListener("change", lire);
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entree]) => setEnVue(entree.isIntersecting),
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!anime || !enVue) return;
    const minuterie = setTimeout(() => {
      setSens(1);
      setI((k) => (k + 1) % apps.length);
    }, DUREE);
    return () => clearTimeout(minuterie);
  }, [anime, enVue, i, apps.length]);

  const app = apps[i];

  return (
    <section ref={section} id="produits" className="bg-white p-3 md:p-5 lg:p-6">
      <div className="overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <h2 className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {t.produits.titre}
          </h2>

          {/* AU CELLULAIRE : UNE APP À LA FOIS. Avant, les trois titres
              s'empilaient puis la démo suivait loin en dessous : on ne savait
              plus quel texte allait avec quel écran. Ici, des pastilles en
              haut, puis une carte qui garde ensemble le texte et sa démo, et
              qui glisse de côté vers la suivante (minuterie ou balayage). */}
          <div
            className="mt-10 lg:hidden"
            onTouchStart={(e) => {
              toucher.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (toucher.current === null) return;
              const dx = e.changedTouches[0].clientX - toucher.current;
              toucher.current = null;
              if (Math.abs(dx) > 50) aller(dx < 0 ? i + 1 : i - 1);
            }}
          >
            <div role="tablist" aria-label={t.produits.titre} className="grid grid-cols-3 gap-2">
              {apps.map((a, k) => {
                const actif = k === i;
                return (
                  <button
                    key={a.demo}
                    type="button"
                    role="tab"
                    aria-selected={actif}
                    onClick={() => aller(k)}
                    className={`relative overflow-hidden rounded-full px-2 py-2.5 text-sm font-black transition-colors ${
                      actif ? "bg-white/15 text-white" : "bg-white/5 text-white/50"
                    }`}
                  >
                    {a.court}
                    {actif && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
                        <span
                          key={i}
                          style={
                            {
                              "--res-duree": `${DUREE}ms`,
                              animationPlayState: enVue && anime ? "running" : "paused",
                            } as CSSProperties
                          }
                          className={`block h-full bg-brand ${anime ? "res-barre" : ""}`}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div
              key={app.demo}
              role="tabpanel"
              className={`mt-6 ${anime ? (sens > 0 ? "produits-glisse-droite" : "produits-glisse-gauche") : ""}`}
            >
              <div className="min-h-[15rem]">
              <p className="text-xs font-black uppercase tracking-widest text-white/50">{app.etiquette}</p>
              <h3 className="mt-2 font-display text-2xl font-black leading-tight tracking-tight">{app.titre}</h3>
              <p className="mt-3 leading-relaxed text-white/75">
                {app.texte.map((bout, j) =>
                  typeof bout === "string" ? (
                    bout
                  ) : (
                    <span key={j} className="rounded bg-white/10 px-1.5 font-black text-white">
                      {bout.statut}
                    </span>
                  ),
                )}
              </p>
              </div>
              {/* Hauteur fixe : le téléphone est plus haut que la tablette, et
                  la page sous la section ne doit pas sauter à chaque changement. */}
              <div className="mt-8 flex min-h-[32rem] items-center justify-center">
                {app.demo === "cuisine" ? (
                  <DemoTablette t={t} />
                ) : (
                  <DemoApp demo={app.demo} alt={app.alt} attente={t.produits.attente} className="[--demo-w:15rem]" />
                )}
              </div>
            </div>
          </div>

          {/* À L'ORDI : la liste à gauche, la démo à droite. */}
          <div className="mt-16 hidden items-center gap-14 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div role="tablist" aria-label={t.produits.titre} className="grid gap-3">
              {apps.map((a, k) => {
                const actif = k === i;
                return (
                  <button
                    key={a.demo}
                    type="button"
                    role="tab"
                    aria-selected={actif}
                    aria-controls="produits-demo"
                    onClick={() => aller(k)}
                    className={`relative overflow-hidden rounded-2xl p-5 text-left transition-colors md:p-6 ${
                      actif ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="block text-xs font-black uppercase tracking-widest text-white/50">
                      {a.etiquette}
                    </span>
                    <span
                      className={`mt-2 block font-display text-xl font-black leading-tight tracking-tight md:text-2xl ${
                        actif ? "text-white" : "text-white/55"
                      }`}
                    >
                      {a.titre}
                    </span>
                    {actif && (
                      <span className="mt-3 block text-sm leading-relaxed text-white/75 md:text-base">
                        {a.texte.map((bout, j) =>
                          typeof bout === "string" ? (
                            bout
                          ) : (
                            <span
                              key={j}
                              className="rounded bg-white/10 px-1.5 font-black text-white"
                            >
                              {bout.statut}
                            </span>
                          ),
                        )}
                      </span>
                    )}
                    {actif && (
                      <span className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                        <span
                          key={i}
                          style={
                            {
                              "--res-duree": `${DUREE}ms`,
                              animationPlayState: enVue && anime ? "running" : "paused",
                            } as CSSProperties
                          }
                          className={`block h-full bg-brand ${anime ? "res-barre" : ""}`}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div id="produits-demo" role="tabpanel" className="flex justify-center">
              {/* La cuisine travaille sur une tablette, pas un téléphone : sa
                  démo est dessinée en HTML (DemoTablette), pas en captures. */}
              {app.demo === "cuisine" ? (
                <DemoTablette key={app.demo} t={t} />
              ) : (
                <DemoApp
                  key={app.demo}
                  demo={app.demo}
                  alt={app.alt}
                  attente={t.produits.attente}
                  className="[--demo-w:17rem] sm:[--demo-w:20rem]"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
