"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { GroupeNav } from "@/lib/navigation";

/* UN GROUPE DÉROULANT DE LA BARRE.

   POURQUOI IL EST CLIENT ET LA BARRE NON. Ouvrir un panneau demande de l'état ;
   le reste de la barre n'en demande pas. Isoler l'interaction ici laisse
   BarreNav en composant serveur — le logo, les liens et le bouton d'action
   restent du HTML rendu au serveur, et seul ce petit composant traverse.

   TROIS FAÇONS D'OUVRIR, PARCE QU'IL Y A TROIS FAÇONS DE NAVIGUER :
   - à la souris, le survol suffit et c'est ce qu'on attend d'un menu ;
   - au clavier, Entrée ou Espace sur le bouton, Échap pour refermer ;
   - au doigt, le toucher déclenche un clic — d'où le bouton, qui reste un
     vrai bouton, et non un lien qui naviguerait avant d'avoir déroulé.

   ET TROIS FAÇONS DE FERMER, parce qu'un panneau qui reste ouvert est pire
   qu'un panneau qui ne s'ouvre pas : Échap, un clic à l'extérieur, ou le focus
   qui sort du groupe. Ce dernier cas est celui qu'on oublie : sans lui, un
   utilisateur au clavier qui tabule au-delà du dernier lien laisse le panneau
   ouvert derrière lui.

   LE PANNEAU N'EST PAS DÉMONTÉ, IL EST MASQUÉ (`hidden` + `invisible`) : c'est
   ce qui permet à la transition de jouer dans les deux sens, et ça garde les
   liens dans le HTML rendu — donc lisibles par un robot qui n'exécute rien. */
export default function MenuDeroulant({ groupe }: { groupe: GroupeNav }) {
  const [ouvert, setOuvert] = useState(false);
  const conteneur = useRef<HTMLDivElement>(null);
  const bouton = useRef<HTMLButtonElement>(null);
  const idPanneau = useId();

  // Un clic n'importe où ailleurs referme.
  useEffect(() => {
    if (!ouvert) return;
    const dehors = (e: MouseEvent) => {
      if (!conteneur.current?.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener("mousedown", dehors);
    return () => document.removeEventListener("mousedown", dehors);
  }, [ouvert]);

  return (
    <div
      ref={conteneur}
      className="relative"
      onMouseEnter={() => setOuvert(true)}
      onMouseLeave={() => setOuvert(false)}
      onBlur={(e) => {
        // `relatedTarget` est l'élément qui REÇOIT le focus. S'il est hors du
        // groupe, on a quitté le menu pour de bon.
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOuvert(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && ouvert) {
          setOuvert(false);
          bouton.current?.focus();
        }
      }}
    >
      <button
        ref={bouton}
        type="button"
        aria-expanded={ouvert}
        aria-controls={idPanneau}
        onClick={() => setOuvert((o) => !o)}
        className={`flex ${groupe.fente} items-center justify-center gap-1.5 whitespace-nowrap rounded-full py-2 text-center transition-colors hover:bg-ink/[0.06] focus-visible:bg-ink/[0.06] ${
          ouvert ? "bg-ink/[0.06]" : ""
        }`}
      >
        {groupe.titre}
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 transition-transform duration-200 motion-reduce:transition-none ${
            ouvert ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Le panneau déborde de la barre vers le bas. Il est centré sur son
          bouton plutôt qu'aligné à gauche : les titres de groupe n'ont pas la
          même largeur d'une langue à l'autre, et un alignement à gauche ferait
          glisser le panneau au changement de langue. */}
      <div
        id={idPanneau}
        className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-all duration-200 ease-out motion-reduce:transition-none ${
          ouvert
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <ul className="min-w-[15rem] list-none rounded-2xl border border-bone bg-white p-2 shadow-xl shadow-ink/10">
          {groupe.liens.map(({ href, libelle }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOuvert(false)}
                // `tabIndex` suit l'état : un lien masqué ne doit pas être
                // atteignable au clavier, sinon la tabulation traverse des
                // panneaux invisibles.
                tabIndex={ouvert ? undefined : -1}
                className="block whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-bone"
              >
                {libelle}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
