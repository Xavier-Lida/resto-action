"use client";

import { useState } from "react";
import DemoApp from "@/components/DemoApp";

// Les mêmes clés que `DEMOS` dans scripts/preparer-demo-app.mjs. Celles qui
// n'ont pas encore d'assets montrent le cadre d'attente — c'est aussi comme ça
// qu'on le règle.
const DEMOS = ["client", "cuisine", "livreur"];

/* Les curseurs qui servent à régler la démo sans lancer tout le site.
   La timeline elle-même se modifie en haut de DemoApp.tsx. */
export default function ReglagesDemo() {
  const [demo, setDemo] = useState(DEMOS[0]);
  const [largeur, setLargeur] = useState(320);
  const [fond, setFond] = useState("#191919");

  return (
    <main
      style={{ background: fond }}
      className="flex min-h-svh flex-col items-center gap-10 p-8 transition-colors"
    >
      <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl bg-white/95 px-6 py-4 text-sm text-ink shadow-lg">
        <label className="flex items-center gap-3">
          <span className="font-black">Démo</span>
          <select
            value={demo}
            onChange={(e) => setDemo(e.target.value)}
            className="rounded-lg border border-ink/20 bg-white px-2 py-1"
          >
            {DEMOS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3">
          <span className="font-black">Largeur</span>
          <input
            type="range"
            min={180}
            max={520}
            value={largeur}
            onChange={(e) => setLargeur(Number(e.target.value))}
          />
          <span className="w-14 tabular-nums text-ink/60">{largeur} px</span>
        </label>

        <label className="flex items-center gap-3">
          <span className="font-black">Fond</span>
          {["#191919", "#c74238", "#ffffff", "#f1f1ef"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFond(c)}
              aria-label={c}
              style={{ background: c }}
              className={`size-7 rounded-full border transition ${
                fond === c ? "border-ink ring-2 ring-ink/40" : "border-ink/20"
              }`}
            />
          ))}
        </label>

        <p className="max-w-xs text-xs leading-relaxed text-ink/60">
          La timeline se règle en haut de{" "}
          <code className="font-mono">src/components/DemoApp.tsx</code>. Les assets
          se régénèrent avec{" "}
          <code className="font-mono">node scripts/preparer-demo-app.mjs</code>.
        </p>
      </div>

      <DemoApp
        demo={demo}
        alt="Démonstration de l'application"
        attente="Aperçu à venir"
        className="shrink-0"
        style={{ "--demo-w": `${largeur}px` } as React.CSSProperties}
      />
    </main>
  );
}
