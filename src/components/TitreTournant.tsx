"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Textes } from "@/lib/textes/fr";

/* Le H1 du héro : une ligne fixe, une ligne qui tourne.

   CE QUI COMPTE POUR LE RÉFÉRENCEMENT. Le serveur ne rend QU'UNE variante, et
   c'est elle qui part dans le HTML. Le robot lit donc un H1 propre et unique —
   « Les restos indépendants du Québec nous appellent pour sortir enfin dans
   Google. » — au lieu des quatre phrases collées bout à bout. La sortante
   n'existe qu'après hydratation. Sans JavaScript, la phrase reste complète et
   correcte : la rotation est un agrément, pas le contenu.

   LE GESTE : un rouleau. Les deux lignes montent EN MÊME TEMPS dans une fente
   qui les écrête — la sortante s'en va par le haut pendant que l'entrante prend
   sa place par le bas. La fente n'est jamais vide, et c'est ce qui fait lire un
   remplacement plutôt qu'une disparition suivie d'une apparition. */

const ROULEAU = 520; // la durée du remplacement
const POSE = 2600; // le temps qu'on laisse lire une variante

export default function TitreTournant({ t }: { t: Textes }) {
  const { fixe, variantes } = t.h1;
  const [i, setI] = useState(0);
  // La variante qui s'en va. `null` = rien ne roule en ce moment.
  const [sortante, setSortante] = useState<number | null>(null);
  const [anime, setAnime] = useState(false);
  const [enVue, setEnVue] = useState(false);
  const titre = useRef<HTMLHeadingElement>(null);

  /* Mouvement réduit : la première variante reste, rien ne tourne. Et rien ne
     tourne non plus hors écran — c'est la même paire de gardes que la section
     Résultats, pour la même raison : ne pas faire travailler la page pour une
     animation que personne ne regarde. */
  useEffect(() => {
    const requete = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lire = () => setAnime(!requete.matches);
    lire();
    requete.addEventListener("change", lire);
    return () => requete.removeEventListener("change", lire);
  }, []);

  useEffect(() => {
    const el = titre.current;
    if (!el) return;
    const observateur = new IntersectionObserver(
      ([entree]) => setEnVue(entree.isIntersecting),
      { threshold: 0.2 }
    );
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  // La pose finie, on avance : la courante devient la sortante et la suivante
  // entre. Les deux existent ensemble le temps du rouleau.
  useEffect(() => {
    if (!anime || !enVue) return;
    const attente = setTimeout(() => {
      setSortante(i);
      setI((k) => (k + 1) % variantes.length);
    }, POSE);
    return () => clearTimeout(attente);
  }, [anime, enVue, i, variantes.length]);

  useEffect(() => {
    if (sortante === null) return;
    const fin = setTimeout(() => setSortante(null), ROULEAU);
    return () => clearTimeout(fin);
  }, [sortante]);

  /* La sortante et le réservoir de hauteur n'existent QU'APRÈS hydratation.
     Rendus côté serveur, leur texte se retrouverait dans le H1 : un robot lit
     le DOM, pas les pixels, et `invisible` comme `aria-hidden` n'y changent
     rien. Le HTML servi ne porte donc que la phrase active. */
  const monte = useSyncExternalStore(
    () => () => {}, // rien à surveiller : la valeur ne change plus après l'hydratation
    () => true, // côté client
    () => false // côté serveur
  );

  const plusLongue = variantes.reduce((a, b) => (b.length > a.length ? b : a));

  return (
    <h1
      ref={titre}
      className="animate-hero delay-1 mx-auto max-w-[22ch] px-5 text-center font-display text-[6.2vw] font-black leading-[1.15] tracking-tight text-white/60 sm:max-w-none sm:text-[4.6vw] lg:text-[3.4vw]"
    >
      {/* Une ligne pour la partie fixe : `block` plutôt qu'un espace, pour que
          la coupure soit décidée et non subie. */}
      <span className="block">{fixe}</span>

      {/* LA FENTE. Sa hauteur est celle de la variante la plus longue, rendue
          invisible dessous : sans ce réservoir, le héro sauterait au moindre
          changement de longueur. `overflow-hidden` est ce qui écrête les deux
          lignes pendant qu'elles roulent. */}
      <span className="relative block overflow-hidden text-white">
        {monte && (
          <span aria-hidden="true" className="invisible block">
            {plusLongue}
          </span>
        )}

        {monte && sortante !== null && (
          <span
            key={`sort-${sortante}`}
            aria-hidden="true"
            className="titre-sort absolute inset-x-0 top-0 block"
          >
            {variantes[sortante]}
          </span>
        )}

        <span
          key={i}
          className={`block ${monte ? "absolute inset-x-0 top-0" : ""} ${
            sortante !== null ? "titre-entre" : ""
          }`}
        >
          {variantes[i]}
        </span>
      </span>
    </h1>
  );
}
