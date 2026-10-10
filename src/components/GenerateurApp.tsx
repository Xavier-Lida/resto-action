"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import ApercuResto, { COULEURS } from "@/components/ApercuResto";
import DemoApp from "@/components/DemoApp";
import FormulaireMaquette from "@/components/FormulaireMaquette";
import Modale from "@/components/Modale";
import type { LieuResto } from "@/lib/places";
import type { Textes } from "@/lib/textes/fr";

/* « TROUVE TON RESTO » → UN APERÇU AUTOMATIQUE, PUIS LA VRAIE MAQUETTE EN 48 H.

   Le resto tape son nom, la fenêtre s'ouvre :
     à droite, un APERÇU AUTOMATIQUE de son app, fait avec sa vraie fiche
       Google (nom, adresse, note, photos ; voir /api/places). Il peut essayer
       une couleur, et choisir la bonne fiche si Google en trouve plusieurs ;
     à gauche, la demande de maquette faite à la main (FormulaireMaquette).

   Sans fiche trouvée (ou sans clé Google configurée), la droite montre la
   vraie app de Bistro Habibi, comme preuve de ce qu'on fait. */

type Recherche =
  | { etat: "chargement" }
  | { etat: "trouve"; lieux: LieuResto[] }
  | { etat: "aucun" };

export default function GenerateurApp({ t }: { t: Textes }) {
  const m = t.hero.maquette;
  const a = t.hero.apercu;
  const [restaurant, setRestaurant] = useState("");
  const [ouvert, setOuvert] = useState(false);
  // Change à chaque ouverture : le formulaire repart à neuf avec le nom tapé.
  const [cle, setCle] = useState(0);
  const [recherche, setRecherche] = useState<Recherche>({ etat: "chargement" });
  const [choix, setChoix] = useState(0);
  const [couleur, setCouleur] = useState(COULEURS[0]);

  async function chercher(nom: string) {
    setRecherche({ etat: "chargement" });
    setChoix(0);
    try {
      const langue = t.htmlLang.startsWith("en") ? "en" : "fr";
      const reponse = await fetch(`/api/places?q=${encodeURIComponent(nom)}&langue=${langue}`);
      const donnees = (await reponse.json()) as { lieux?: LieuResto[] };
      const lieux = donnees.lieux ?? [];
      setRecherche(lieux.length > 0 ? { etat: "trouve", lieux } : { etat: "aucun" });
    } catch {
      setRecherche({ etat: "aucun" });
    }
  }

  const lieu = recherche.etat === "trouve" ? recherche.lieux[choix] : null;

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const nom = restaurant.trim();
          if (!nom) return;
          setCle((c) => c + 1);
          setOuvert(true);
          void chercher(nom);
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
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
          <FormulaireMaquette
            key={cle}
            t={t}
            restaurant={restaurant.trim()}
            lieu={lieu ? { id: lieu.id, adresse: lieu.adresse } : null}
            titreId="maquette-titre"
          />

          <div className="mx-auto flex w-full max-w-[18rem] flex-col items-center gap-4 pt-3">
            {recherche.etat === "chargement" && (
              <div className="grid h-[33rem] w-[16rem] place-items-center rounded-[2.6rem] bg-bone text-center text-sm font-bold text-ink/50 md:w-[17rem]">
                <span className="animate-pulse px-6">{a.chargement}</span>
              </div>
            )}

            {lieu && (
              <>
                <ApercuResto t={t} lieu={lieu} couleur={couleur} />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink/60">{a.couleur}</span>
                  {COULEURS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCouleur(c)}
                      aria-label={c}
                      aria-pressed={couleur === c}
                      className={`size-6 rounded-full ring-offset-2 transition ${couleur === c ? "ring-2 ring-ink" : "hover:scale-110"}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                {recherche.etat === "trouve" && recherche.lieux.length > 1 && (
                  <div className="w-full">
                    <p className="text-xs font-bold text-ink/60">{a.choisir}</p>
                    <div className="mt-1.5 grid gap-1.5">
                      {recherche.lieux.map((l, k) => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => setChoix(k)}
                          aria-pressed={k === choix}
                          className={`rounded-xl border-2 px-3 py-2 text-left text-xs transition ${
                            k === choix ? "border-brand bg-white" : "border-bone bg-bone hover:bg-white"
                          }`}
                        >
                          <span className="block font-black">{l.nom}</span>
                          <span className="block truncate text-ink/55">{l.adresse}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-center text-xs leading-relaxed text-ink/55">{a.note}</p>
              </>
            )}

            {recherche.etat === "aucun" && (
              <figure className="flex flex-col items-center gap-3">
                <figcaption className="text-center text-sm font-bold text-ink/60">{a.aucun}</figcaption>
                <DemoApp demo="client" alt={m.exempleAlt} attente={m.attente} className="[--demo-w:15rem] md:[--demo-w:17rem]" />
              </figure>
            )}
          </div>
        </div>
      </Modale>
    </>
  );
}
