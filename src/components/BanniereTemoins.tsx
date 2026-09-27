"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_MESURE_ID } from "@/lib/site";

/* La bannière de témoins, et la porte d'entrée de Google Analytics.

   GA se chargeait pour tout le monde, depuis le layout. Seul outil du site à
   déposer des témoins (Vercel Analytics n'en pose aucun, YouTube attend le
   clic, la provenance vit en sessionStorage), il est désormais éteint par
   défaut — c'est ce que la Loi 25 demande d'un traceur — et ne se charge
   qu'après « Accepter ». La bannière ne parle donc que de lui.

   DISCRÈTE PAR CHOIX : une petite carte dans un coin, sans voile ni piège de
   focus. Elle ne bloque rien, et qui l'ignore navigue sans GA. Les deux
   boutons ont le même poids : un refus caché ne serait pas un choix.

   LE CHOIX vit en localStorage. Si le stockage est bloqué, il vit en mémoire
   le temps de la page : la carte se ferme quand même, et GA reste éteint au
   prochain chargement — l'erreur tombe du côté du refus.

   `useSyncExternalStore` plutôt qu'un état lu dans un effet : le serveur ne
   connaît pas le choix, il rend donc « inconnu » (ni carte ni GA), et le
   client bascule sur la vraie valeur sans écart d'hydratation. */

type Choix = "oui" | "non" | null;

/* Ses textes vivent ici et non dans les dictionnaires : la carte est montée
   par le layout, sur toutes les pages, et importer FR et EN au complet
   ajouterait les deux dictionnaires entiers au paquet client de chaque page
   pour quatre phrases. */
const TEXTES = {
  fr: {
    htmlLang: "fr-CA",
    aria: "Témoins",
    texte:
      "Google Analytics mesure nos visites avec des témoins, seulement si vous acceptez.",
    lien: "En savoir plus",
    href: "/confidentialite",
    refuser: "Refuser",
    accepter: "Accepter",
  },
  en: {
    htmlLang: "en-CA",
    aria: "Cookies",
    texte:
      "Google Analytics measures our traffic with cookies, only if you accept.",
    lien: "Learn more",
    href: "/en/privacy",
    refuser: "Decline",
    accepter: "Accept",
  },
};

const CLE = "ra-temoins";
const SERVEUR = "serveur";
const REOUVRIR = "ra-temoins:rouvrir";

let memoire: Choix = null;
const abonnes = new Set<() => void>();

function lire(): Choix {
  try {
    const v = localStorage.getItem(CLE);
    if (v === "oui" || v === "non") return v;
  } catch {}
  return memoire;
}

function ecrire(choix: Choix) {
  memoire = choix;
  try {
    if (choix) localStorage.setItem(CLE, choix);
    else localStorage.removeItem(CLE);
  } catch {}
  abonnes.forEach((f) => f());
}

function abonner(f: () => void) {
  abonnes.add(f);
  const rouvrir = () => ecrire(null);
  // Un autre onglet qui tranche ferme la carte ici aussi.
  window.addEventListener("storage", f);
  window.addEventListener(REOUVRIR, rouvrir);
  return () => {
    abonnes.delete(f);
    window.removeEventListener("storage", f);
    window.removeEventListener(REOUVRIR, rouvrir);
  };
}

/* Retirer son accord doit valoir tout de suite, pas au prochain chargement :
   gtag.js est déjà dans la page. Le drapeau `ga-disable-<id>` est le moyen
   documenté par Google de le faire taire, et les témoins _ga déjà posés sont
   effacés — sur l'hôte et sur ses domaines parents, où GA les pose. */
function drapeauGA(eteint: boolean) {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MESURE_ID}`] =
    eteint;
}

function eteindreGA() {
  drapeauGA(true);
  const parties = location.hostname.split(".");
  const domaines = parties.map((_, i) => parties.slice(i).join("."));
  for (const temoin of document.cookie.split(";")) {
    const nom = temoin.split("=")[0].trim();
    if (!nom.startsWith("_ga")) continue;
    const expire = `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = expire;
    for (const d of domaines) document.cookie = `${expire}; domain=.${d}`;
  }
}

/* Pour le bouton « Modifier mon choix » de la politique : efface le choix, la
   carte revient. */
export function BoutonTemoins({ libelle }: { libelle: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(REOUVRIR))}
      className="mt-4 inline-flex items-center rounded-full bg-ink/[0.06] px-4 py-2 text-sm font-black text-ink transition hover:bg-ink hover:text-white active:scale-95"
    >
      {libelle}
    </button>
  );
}

export default function BanniereTemoins() {
  const choix = useSyncExternalStore<Choix | typeof SERVEUR>(
    abonner,
    lire,
    () => SERVEUR
  );
  const chemin = usePathname();

  const ga = choix === "oui" ? <GoogleAnalytics gaId={GA_MESURE_ID} /> : null;

  // Le tableau de bord est privé : ni carte ni mesure n'y ont leur place.
  if (choix !== null || chemin.startsWith("/tableau")) return ga;

  // Le layout est toujours français : la langue se lit dans le chemin, comme
  // le fait SelecteurLangue.
  const t = chemin === "/en" || chemin.startsWith("/en/") ? TEXTES.en : TEXTES.fr;

  const refuser = () => {
    eteindreGA();
    ecrire("non");
  };

  return (
    <div
      role="region"
      aria-label={t.aria}
      lang={t.htmlLang}
      className="animate-hero-fondu fixed bottom-4 left-4 right-4 z-40 rounded-2xl bg-white/95 p-3 text-xs leading-snug text-ink/75 shadow-lg ring-1 ring-ink/5 backdrop-blur sm:right-auto sm:max-w-xs"
    >
      <p>
        {t.texte}{" "}
        <Link
          href={t.href}
          className="font-bold text-ink underline hover:text-brand"
        >
          {t.lien}
        </Link>
      </p>
      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          onClick={refuser}
          className="flex-1 rounded-full bg-ink/[0.06] px-3 py-1 font-black text-ink transition hover:bg-ink/[0.12] active:scale-95"
        >
          {t.refuser}
        </button>
        <button
          type="button"
          onClick={() => {
            // Un refus plus tôt dans la même page a levé le drapeau.
            drapeauGA(false);
            ecrire("oui");
          }}
          className="flex-1 rounded-full bg-ink px-3 py-1 font-black text-white transition hover:bg-brand active:scale-95"
        >
          {t.accepter}
        </button>
      </div>
    </div>
  );
}
