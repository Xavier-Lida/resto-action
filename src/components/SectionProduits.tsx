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
    const minuterie = setTimeout(() => setI((k) => (k + 1) % apps.length), DUREE);
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

          <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
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
                    onClick={() => setI(k)}
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
