"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import DemoApp from "@/components/DemoApp";
import FormulaireMaquette from "@/components/FormulaireMaquette";
import Modale from "@/components/Modale";
import type { Textes } from "@/lib/textes/fr";

/* « TROUVE TON RESTO » → UNE MAQUETTE FAITE À LA MAIN, EN 48 H.

   Le resto tape son nom, la fenêtre s'ouvre : à gauche la demande de
   maquette (FormulaireMaquette), à droite la VRAIE app qu'on a bâtie pour
   Bistro Habibi, comme preuve. On vend du sur mesure fait par du monde d'ici :
   on montre du vrai travail, pas un modèle généré. */
export default function GenerateurApp({ t }: { t: Textes }) {
  const m = t.hero.maquette;
  const [restaurant, setRestaurant] = useState("");
  const [ouvert, setOuvert] = useState(false);
  // Change à chaque ouverture : le formulaire repart à neuf avec le nom tapé.
  const [cle, setCle] = useState(0);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!restaurant.trim()) return;
          setCle((c) => c + 1);
          setOuvert(true);
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
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
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

      <Modale
        ouvert={ouvert}
        onFermer={() => setOuvert(false)}
        etiquetteFermer={t.hero.hesite.fermer}
        titreId="maquette-titre"
        className="max-w-5xl"
      >
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
          <FormulaireMaquette key={cle} t={t} restaurant={restaurant.trim()} titreId="maquette-titre" />
          {/* LA PREUVE : la vraie app de Bistro Habibi, qui défile. */}
          <figure className="mx-auto flex flex-col items-center gap-3">
            <DemoApp demo="client" alt={m.exempleAlt} attente={m.attente} className="[--demo-w:15rem] md:[--demo-w:17rem]" />
            <figcaption className="text-sm font-bold text-ink/60">{m.exemple}</figcaption>
          </figure>
        </div>
      </Modale>
    </>
  );
}
