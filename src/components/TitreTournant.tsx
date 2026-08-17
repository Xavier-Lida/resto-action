"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import type { Textes } from "@/lib/textes/fr";

/* Le H1 du héro : une partie fixe, et une fin de phrase qui tourne.

   CE QUI COMPTE POUR LE RÉFÉRENCEMENT. Le serveur ne rend QUE la première
   variante, et c'est elle qui part dans le HTML. Le robot lit donc un H1 propre
   et unique — « Les restos indépendants du Québec nous appellent pour sortir
   enfin dans Google. » — au lieu des quatre phrases collées bout à bout. Les
   autres n'apparaissent qu'après hydratation. Sans JavaScript, la phrase reste
   complète et correcte : la rotation est un agrément, pas le contenu.

   LE GESTE, relevé sur la référence image par image : la phrase sortante
   s'efface EN BLOC en montant (120 ms), un creux de 80 ms, puis l'entrante
   arrive MOT PAR MOT, chacun en fondu montant décalé de 65 ms sur le
   précédent. C'est la frappe lettre par lettre de l'onglet 1, à l'échelle du
   mot. */

const SORTIE = 120;
const CREUX = 80;
const PAS_MOT = 65; // décalage d'un mot sur le précédent
const POSE = 2600; // le temps qu'on laisse lire une variante

export default function TitreTournant({ t }: { t: Textes }) {
  const { fixe, variantes } = t.h1;
  const [i, setI] = useState(0);
  const [sort, setSort] = useState(false);
  const [anime, setAnime] = useState(false);
  const section = useRef<HTMLHeadingElement>(null);

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

  const [enVue, setEnVue] = useState(false);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const observateur = new IntersectionObserver(
      ([entree]) => setEnVue(entree.isIntersecting),
      { threshold: 0.2 }
    );
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  // La pose finie, la phrase sort ; la sortie finie, la suivante entre.
  useEffect(() => {
    if (!anime || !enVue) return;
    const attente = setTimeout(() => setSort(true), POSE);
    return () => clearTimeout(attente);
  }, [anime, enVue, i]);

  useEffect(() => {
    if (!sort) return;
    const bascule = setTimeout(() => {
      setI((k) => (k + 1) % variantes.length);
      setSort(false);
    }, SORTIE + CREUX);
    return () => clearTimeout(bascule);
  }, [sort, variantes.length]);

  /* Le réservoir de hauteur n'existe QU'APRÈS hydratation. Rendu côté serveur,
     son texte se retrouverait dans le H1 : un robot lit le DOM, pas les pixels,
     et `invisible` comme `aria-hidden` n'y changent rien — le H1 contiendrait
     deux phrases collées. Le HTML servi ne porte donc que la phrase active.
     Sans JavaScript il n'y a pas de rotation non plus, donc rien à réserver. */
  const monte = useSyncExternalStore(
    () => () => {}, // rien à surveiller : la valeur ne change plus après l'hydratation
    () => true, // côté client
    () => false // côté serveur
  );

  const mots = variantes[i].split(" ");
  const plusLongue = variantes.reduce((a, b) => (b.length > a.length ? b : a));

  return (
    <h1
      ref={section}
      className="animate-hero delay-1 mx-auto max-w-[16ch] text-balance px-5 text-center font-display text-[8vw] font-black leading-[1.05] tracking-tight text-white/60 sm:max-w-[20ch] lg:max-w-[26ch] lg:text-[4.6vw]"
    >
      {fixe}{" "}
      {/* La hauteur est réservée par la variante la plus longue, rendue
          invisible sous la pile : sans elle, le héro sauterait chaque fois
          qu'une phrase de deux lignes en remplace une d'une seule. */}
      <span className="relative inline-block align-top text-white">
        {monte && (
          <span aria-hidden="true" className="invisible block">
            {plusLongue}
          </span>
        )}
        <span
          key={i}
          className={`block ${monte ? "absolute inset-0" : ""} ${sort ? "titre-sortie" : ""}`}
        >
          {mots.map((mot, m) => (
            <span
              key={m}
              className="titre-mot"
              style={{ "--t": `${m * PAS_MOT}ms` } as CSSProperties}
            >
              {mot}
              {m < mots.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}
