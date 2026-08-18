import { ChevronRight } from "lucide-react";
import Link from "next/link";

/* Le fil d'Ariane visible.

   Il double le `BreadcrumbList` du JSON-LD, et c'est délibéré : Google
   compare les deux. Un fil déclaré dans le balisage mais absent de la page
   est un signal que le site décrit autrement que ce qu'il montre — au mieux
   ignoré, au pire retenu contre lui.

   Le dernier maillon est la page courante : il n'est pas un lien, et il porte
   `aria-current` pour que ce soit dit et pas seulement montré. */
export default function FilAriane({
  elements,
  clair = false,
}: {
  elements: { nom: string; chemin: string }[];
  clair?: boolean;
}) {
  const couleur = clair ? "text-white/60" : "text-ink/50";
  const survol = clair ? "hover:text-white" : "hover:text-ink";

  return (
    <nav aria-label="Fil d'Ariane" className={`text-sm ${couleur}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {elements.map(({ nom, chemin }, i) => {
          const dernier = i === elements.length - 1;
          return (
            <li key={chemin} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
              )}
              {dernier ? (
                <span aria-current="page" className="font-bold">
                  {nom}
                </span>
              ) : (
                <Link href={chemin} className={`transition-colors ${survol}`}>
                  {nom}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
