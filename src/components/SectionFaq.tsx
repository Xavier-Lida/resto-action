import type { ReactNode } from "react";
import OuvrirAncre from "@/components/OuvrirAncre";
import Reveal from "@/components/Reveal";

/* L'accordéon de la FAQ, partagé par l'accueil, la page plateforme et les
   quatre pages de fonctionnalité.

   LA QUESTION EST UN `h3`, PAS DU GRAS. C'était la correction demandée par
   l'audit : un `summary` en gras ressemble à un titre sans en être un, et le
   lien entre la question et sa réponse se perd pour un moteur comme pour un
   lecteur d'écran. Ce composant existe surtout pour que cette règle n'ait
   qu'un seul endroit où être vraie — recopiée six fois, elle aurait fini par
   être fausse quelque part.

   Le `h3` porte la mise en page de la ligne (le flex, les marges) plutôt que
   d'ajouter un bloc de plus à l'intérieur du `summary`.

   `name="faq"` sur les `details` : une seule question ouverte à la fois, sans
   une ligne de JavaScript.

   `visibles` : seules les N premières questions sont affichées; les autres
   s'ouvrent sous `voirTout` (« Voir toutes les questions »). Un lien vers une
   question cachée (#id) l'ouvre quand même (OuvrirAncre). */
type Item = { q: string; a: string; id?: string };

function Question({ q, a, id }: Item): ReactNode {
  return (
    <details
      id={id}
      name="faq"
      className="faq-item group scroll-mt-28 rounded-3xl transition-colors duration-300 open:bg-bone"
    >
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <h3 className="flex items-center justify-between gap-6 px-6 py-5 text-lg font-black md:px-8">
          {q}
          <span
            aria-hidden="true"
            className="text-2xl leading-none transition-transform duration-300 group-open:rotate-45"
          >
            +
          </span>
        </h3>
      </summary>
      <p className="max-w-3xl px-6 pb-6 leading-relaxed text-ink/75 md:px-8">{a}</p>
    </details>
  );
}
export default function SectionFaq({
  titre,
  items,
  id,
  centre = false,
  visibles,
  voirTout = "Voir toutes les questions",
}: {
  titre: string;
  items: Item[];
  id?: string;
  centre?: boolean;
  visibles?: number;
  voirTout?: string;
}) {
  const devant = visibles ? items.slice(0, visibles) : items;
  const reste = visibles ? items.slice(visibles) : [];
  return (
    <section id={id} className="bg-white">
      <div className="mx-auto max-w-4xl px-5 py-20 md:py-28">
        <Reveal>
          <h2
            className={`font-display text-3xl md:text-5xl font-black leading-tight tracking-tight ${
              centre ? "text-center" : ""
            }`}
          >
            {titre}
          </h2>
        </Reveal>

        <Reveal delay={1}>
          <div className="mt-12 space-y-2">
            {devant.map((item) => (
              <Question key={item.q} {...item} />
            ))}
          </div>
          {reste.length > 0 && (
            <details className="group/tout mt-4">
              <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border-2 border-ink/15 px-6 py-3 font-black transition hover:border-ink [&::-webkit-details-marker]:hidden">
                {voirTout} ({reste.length})
                <span aria-hidden="true" className="transition-transform duration-300 group-open/tout:rotate-180">↓</span>
              </summary>
              <div className="mt-4 space-y-2">
                {reste.map((item) => (
                  <Question key={item.q} {...item} />
                ))}
              </div>
            </details>
          )}
          <OuvrirAncre />
        </Reveal>
      </div>
    </section>
  );
}
