"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

/* LE CARROUSEL DES ÉTAPES : une diapo à la fois, qui change toute seule.

   Chaque onglet porte une fine barre qui se remplit pendant que sa diapo est
   affichée; quand elle est pleine (fin de l'animation CSS), on passe à la
   suivante, en fondu. Un clic sur un onglet y va et relance le minuteur;
   au cellulaire, on glisse du doigt. */
const DUREE_MS = 2500;

export default function Carrousel({ onglets, children }: { onglets: string[]; children: ReactNode }) {
  const [actif, setActif] = useState(0);
  const [visible, setVisible] = useState(false);
  const depart = useRef<number | null>(null);
  const boite = useRef<HTMLDivElement>(null);
  const rangee = useRef<HTMLDivElement>(null);
  const n = Children.count(children);

  // Le minuteur ne tourne que si le carrousel est à l'écran.
  useEffect(() => {
    const el = boite.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Le minuteur : une diapo toutes les DUREE_MS, tant que le carrousel est à
  // l'écran. Un vrai minuteur (et non la fin de l'animation CSS) : il tourne
  // même si l'appareil demande moins de mouvement ou si la souris est dessus.
  useEffect(() => {
    if (!visible || n < 2) return;
    const t = setTimeout(() => setActif((k) => (k + 1) % n), DUREE_MS);
    return () => clearTimeout(t);
  }, [actif, visible, n]);

  // Au cellulaire, la rangée d'onglets défile pour garder l'onglet actif en vue.
  useEffect(() => {
    const r = rangee.current;
    const b = r?.children[actif] as HTMLElement | undefined;
    if (r && b) r.scrollTo({ left: b.offsetLeft - r.clientWidth / 2 + b.clientWidth / 2, behavior: "smooth" });
  }, [actif]);

  const aller = (k: number) => setActif(((k % n) + n) % n);
  // Un clic choisit la diapo et relance le minuteur depuis zéro.
  const choisir = (k: number) => aller(k);

  return (
    <div ref={boite}>
      {/* Les onglets : un sélecteur en pastilles, centré. L'onglet actif est
          blanc, et un léger fond se remplit dedans pendant qu'il joue. */}
      <div className="flex justify-center">
        <div
          ref={rangee}
          role="tablist"
          className="relative flex max-w-full gap-1 overflow-x-auto rounded-full bg-bone p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {onglets.map((o, k) => {
            const enCours = k === actif;
            return (
              <button
                key={o}
                type="button"
                role="tab"
                aria-selected={enCours}
                onClick={() => choisir(k)}
                className={`relative shrink-0 overflow-hidden whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-black transition-all duration-300 md:px-5 ${
                  enCours ? "bg-white text-ink shadow-[0_2px_10px_rgba(25,25,25,0.08)]" : "text-ink/50 hover:text-ink"
                }`}
              >
                {enCours && (
                  <span
                    key={actif}
                    aria-hidden="true"
                    className="carrousel-progres absolute inset-y-0 left-0 bg-ciel/15"
                    style={{ animationDuration: `${DUREE_MS}ms`, animationPlayState: visible ? "running" : "paused" }}
                  />
                )}
                <span className="relative">{o}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Les diapos, empilées dans la même case : seule l'active est visible. */}
      <div
        className="mt-8 grid"
        onTouchStart={(e) => {
          depart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (depart.current === null) return;
          const dx = e.changedTouches[0].clientX - depart.current;
          depart.current = null;
          if (Math.abs(dx) > 50) choisir(actif + (dx < 0 ? 1 : -1));
        }}
      >
        {Children.map(children, (enfant, k) => (
          <div
            role="tabpanel"
            aria-hidden={k !== actif}
            data-actif={k === actif}
            className={`[grid-area:1/1] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              k === actif ? "scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0"
            }`}
          >
            {enfant}
          </div>
        ))}
      </div>
    </div>
  );
}
