"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { equivalentLangue } from "@/lib/routes";
import type { Textes } from "@/lib/textes/fr";

/* Le sélecteur de langue, en pilule segmentée.

   L'ORDRE EST FIXE : FRANÇAIS PUIS ANGLAIS, TOUJOURS. Il affichait la langue
   COURANTE en premier, ce qui donnait « FR | EN » en français et « EN | FR »
   en anglais : les deux mots échangeaient leur place au moment même du clic,
   sous le curseur. Un réglage qui bouge quand on s'en sert donne l'impression
   d'avoir raté sa cible. La langue active se marque donc par le fond et par
   `aria-current`, jamais par la position. Le français passe en premier parce
   que c'est la version d'origine, celle que désigne le x-default.

   LA FORME : un rail teinté, et la langue active posée dessus sur une pastille
   blanche en relief. C'est la convention du sélecteur segmenté — on voit d'un
   coup les deux choix possibles ET celui qui est actif, ce qu'un « FR | EN »
   en texte nu ne montrait qu'à la nuance de gris près. Entièrement rond :
   la pastille et son rail partagent le même arrondi, sinon la pastille flotte
   dans un coin carré.

   La crainte d'origine — qu'une pilule à côté du bouton d'action en imite un
   second — ne tient plus : ce bouton est passé en coins doux. Les deux formes
   ne se ressemblent plus, l'œil ne les confond plus.

   NAVIGATION DOUCE. C'était un `<a>` : changer de langue rechargeait la page
   entière, écran blanc compris. `Link` fait la bascule côté client.

   IL EMMÈNE OÙ ON ÉTAIT, PLUS À L'ACCUEIL. Il lisait `t.autre.href`, une
   constante figée dans les dictionnaires qui valait toujours « /en » ou « / » :
   quelqu'un qui lisait un article et cliquait EN se retrouvait sur la page
   d'accueil anglaise, sa lecture perdue. Le registre des routes sait apparier
   toutes les pages du site — c'est lui qui compose le plan du site et les
   balises hreflang — il suffisait de le lui demander.

   D'OÙ LE « use client » : il faut connaître le chemin courant, et seul
   `usePathname` le donne sans faire descendre la paire depuis chaque page à
   travers la barre de navigation. Le coût est une poignée d'octets pour un
   composant qui n'a ni état ni effet ; le prix de l'alternative était une
   dizaine de fichiers à faire transiter une information qu'on peut lire.

   `ton` distingue les deux endroits où il se pose : la barre, sur blanc, et le
   menu mobile, sur blanc lui aussi mais dans un panneau — d'où un rail un peu
   plus marqué pour qu'il ne disparaisse pas. (Un troisième ton « hero »
   existait pour la nav qui vivait dans la carte rouge ; cette nav est sortie
   de la carte depuis longtemps et le ton n'était plus jamais demandé.) */
export default function SelecteurLangue({
  t,
  ton = "barre",
}: {
  t: Textes;
  ton?: "barre" | "menu";
}) {
  const chemin = usePathname();
  // La même page, dans l'autre langue. Une seule destination possible : on est
  // forcément dans l'une des deux, donc l'autre est celle qu'on propose.
  const ailleurs = equivalentLangue(chemin, t.code === "fr" ? "en" : "fr");

  /* Les deux langues dans un ordre qui ne dépend PAS de la page courante.
     `href: null` marque celle où l'on se trouve déjà. */
  const langues = [
    { code: "fr", href: t.code === "fr" ? null : ailleurs, titre: "Français" },
    { code: "en", href: t.code === "en" ? null : ailleurs, titre: "English" },
  ];

  const rail = ton === "menu" ? "bg-bone" : "bg-ink/[0.06]";

  return (
    <div
      aria-label={t.langue.aria}
      className={`inline-flex items-center rounded-full p-1 text-xs font-black ${rail}`}
    >
      {langues.map(({ code, href, titre }) =>
        href === null ? (
          <span
            key={code}
            aria-current="true"
            className="rounded-full bg-white px-3 py-1.5 text-ink shadow-sm"
          >
            {code.toUpperCase()}
          </span>
        ) : (
          <Link
            key={code}
            href={href}
            hrefLang={code}
            title={titre}
            className="rounded-full px-3 py-1.5 text-ink/45 transition-colors hover:text-ink"
          >
            {code.toUpperCase()}
          </Link>
        )
      )}
    </div>
  );
}
