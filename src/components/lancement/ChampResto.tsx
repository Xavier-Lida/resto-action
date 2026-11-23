"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import { Check } from "lucide-react";
import { CALCUL_60 as K } from "@/lib/contenu/grand-lancement";
import type { LieuChamp } from "@/lib/places";

/* LE CHAMP « TON RESTO » DU CALCUL 60 SECONDES.

   La recherche de « Trouve ton resto », reprise comme champ : le resto tape
   son nom, choisit sa fiche, et on a d'un coup le nom, la ville et
   l'identifiant Google (/api/places?champ=1).

   IL N'Y A JAMAIS DE CUL-DE-SAC. « Je ne trouve pas mon resto » ouvre 2 champs
   libres (le nom, la ville). Et si la recherche ne répond pas (pas de clé en
   local, Google en panne, trop de recherches), les 2 champs libres s'ouvrent
   tout seuls, avec ce qu'il a déjà tapé.

   La recherche part quand il arrête de taper, à partir de 3 lettres : chaque
   recherche est facturée par Google. */

export type RestoChoisi = { nom: string; ville: string; placeId: string };

const DELAI_MS = 600;
const LETTRES_MIN = 3;

const champ =
  "mt-1 w-full rounded-xl border-2 bg-white px-3.5 py-3 text-base font-bold outline-none transition-colors focus:border-brand";
const etiquette = "block text-sm font-bold text-ink/70";
const lienDiscret = "text-sm font-bold text-ink/70 underline underline-offset-4 hover:text-brand";

export default function ChampResto({
  id,
  valeur,
  onChange,
  libre,
  onLibre,
  erreurResto,
  erreurVille,
  onFocus,
}: {
  id: string;
  valeur: RestoChoisi;
  onChange: (v: RestoChoisi) => void;
  /** Vrai : les 2 champs libres (le nom, la ville) remplacent la recherche. */
  libre: boolean;
  onLibre: (libre: boolean) => void;
  erreurResto?: string;
  erreurVille?: string;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
}) {
  const [lieux, setLieux] = useState<LieuChamp[]>([]);
  const [cherche, setCherche] = useState(false);
  // Le numéro de la dernière recherche lancée : une réponse en retard est ignorée.
  const tour = useRef(0);

  const choisi = !libre && valeur.placeId !== "";
  const requete = valeur.nom.trim();

  useEffect(() => {
    if (libre || choisi || requete.length < LETTRES_MIN) return;
    const moi = ++tour.current;
    const stop = new AbortController();
    const minuterie = setTimeout(async () => {
      setCherche(true);
      try {
        const r = await fetch(`/api/places?champ=1&q=${encodeURIComponent(requete)}`, { signal: stop.signal });
        if (moi !== tour.current) return;
        // Pas de clé, Google en panne ou trop de recherches : les champs libres.
        if (!r.ok) {
          onLibre(true);
          return;
        }
        const donnees = (await r.json()) as { lieux?: LieuChamp[] };
        if (moi === tour.current) setLieux(donnees.lieux ?? []);
      } catch {
        if (moi === tour.current && !stop.signal.aborted) onLibre(true);
      } finally {
        if (moi === tour.current) setCherche(false);
      }
    }, DELAI_MS);
    return () => {
      clearTimeout(minuterie);
      stop.abort();
    };
    // onLibre est stable côté parent (un setState) : seule la requête relance la recherche.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requete, libre, choisi]);

  if (libre) {
    return (
      <div className="grid gap-3">
        <label className={etiquette}>
          {K.champs.restoLibre}
          <input
            id={id}
            className={`${champ} ${erreurResto ? "border-brand" : "border-bone"}`}
            type="text"
            autoComplete="organization"
            aria-invalid={!!erreurResto}
            aria-describedby={erreurResto ? `${id}-erreur` : undefined}
            value={valeur.nom}
            onFocus={onFocus}
            onChange={(e) => onChange({ ...valeur, nom: e.target.value, placeId: "" })}
          />
          {erreurResto && <Manque id={`${id}-erreur`}>{erreurResto}</Manque>}
        </label>
        <label className={etiquette}>
          {K.champs.ville}
          <input
            id={`${id}-ville`}
            className={`${champ} ${erreurVille ? "border-brand" : "border-bone"}`}
            type="text"
            autoComplete="address-level2"
            aria-invalid={!!erreurVille}
            aria-describedby={erreurVille ? `${id}-ville-erreur` : undefined}
            value={valeur.ville}
            onFocus={onFocus}
            onChange={(e) => onChange({ ...valeur, ville: e.target.value, placeId: "" })}
          />
          {erreurVille && <Manque id={`${id}-ville-erreur`}>{erreurVille}</Manque>}
        </label>
      </div>
    );
  }

  if (choisi) {
    return (
      <div>
        <p className={etiquette}>{K.champs.resto}</p>
        <div className="mt-1 flex items-center gap-3 rounded-xl border-2 border-bone bg-bone/60 px-3.5 py-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-white">
            <Check className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-base font-bold">{valeur.nom}</span>
            <span className="block truncate text-xs text-ink/60">{valeur.ville}</span>
          </span>
          <button
            type="button"
            className={lienDiscret}
            onClick={() => {
              setLieux([]);
              onChange({ nom: "", ville: "", placeId: "" });
            }}
          >
            {K.restoChanger}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className={etiquette}>
        {K.champs.resto}
        <input
          id={id}
          className={`${champ} font-bold placeholder:font-normal placeholder:text-ink/40 ${erreurResto ? "border-brand" : "border-bone"}`}
          type="text"
          autoComplete="organization"
          placeholder={K.restoExemple}
          aria-invalid={!!erreurResto}
          aria-describedby={erreurResto ? `${id}-erreur` : undefined}
          aria-busy={cherche}
          value={valeur.nom}
          onFocus={onFocus}
          onChange={(e) => {
            if (e.target.value.trim().length < LETTRES_MIN) setLieux([]);
            onChange({ nom: e.target.value, ville: "", placeId: "" });
          }}
        />
      </label>
      {erreurResto && <Manque id={`${id}-erreur`}>{erreurResto}</Manque>}
      {lieux.length > 0 && (
        <ul className="mt-2 grid gap-1.5" aria-label={K.champs.resto}>
          {lieux.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                className="block w-full rounded-xl bg-bone px-3.5 py-2.5 text-left transition hover:bg-ink hover:text-white"
                onClick={() => {
                  setLieux([]);
                  // Une fiche sans ville : on garde le nom et on demande la ville.
                  if (!l.ville) {
                    onChange({ nom: l.nom, ville: "", placeId: "" });
                    onLibre(true);
                  } else {
                    onChange({ nom: l.nom, ville: l.ville, placeId: l.id });
                  }
                }}
              >
                <span className="block text-base font-bold">{l.nom}</span>
                <span className="block text-xs opacity-70">{l.adresse}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2">
        <button type="button" className={lienDiscret} onClick={() => onLibre(true)}>
          {K.restoIntrouvable}
        </button>
      </p>
    </div>
  );
}

export function Manque({ id, children }: { id: string; children: string }) {
  return (
    <span id={id} role="alert" className="mt-1.5 block text-sm font-bold text-brand">
      {children}
    </span>
  );
}
