import Reveal from "@/components/Reveal";
import { Accordeon } from "@/components/lancement/Accordeon";
import { AnimerAuDefilement } from "@/components/lancement/AnimerAuDefilement";
import { Scene } from "@/components/lancement/Scene";
import { Surtitre } from "@/components/lancement/ui";
import { Visuel } from "@/components/lancement/visuels";
import {
  ANCRES,
  PILE,
  REGLE_AVIS,
  SCENE,
  piecesDisponibles,
  valeurAffichable,
  valeurTotale,
  type Piece,
} from "@/lib/contenu/grand-lancement";
import { argent, fr } from "@/lib/format";

/* TOUT CE QUE TU REÇOIS : la pile de valeur.

   D'abord « Le Système en images » (six panneaux animés), puis les pièces,
   groupées par moment. Au cellulaire, un accordéon par groupe, le premier
   ouvert; à l'ordi, tout est ouvert. Chaque carte : le visuel (quand il
   existe), le nom, une ligne, et la valeur en dollars si elle est remplie
   avec 2 soumissions. Le total ne s'affiche que quand chaque pièce et chaque
   bonus affichés ont une valeur. */
function Carte({ piece }: { piece: Piece }) {
  const valeur = valeurAffichable(piece);
  return (
    <li className="flex flex-col rounded-3xl border-2 border-bone bg-white p-5 lg:transition lg:duration-300 lg:hover:-translate-y-1 lg:hover:shadow-xl lg:hover:shadow-ink/5">
      {piece.visuel && (
        <AnimerAuDefilement>
          <Visuel type={piece.visuel} />
        </AnimerAuDefilement>
      )}
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-display text-lg font-black leading-tight">{fr(piece.nom)}</h4>
        {valeur != null && <span className="shrink-0 rounded-full bg-bone px-3 py-1 text-sm font-black">{argent(valeur)}</span>}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">{fr(piece.ligne)}</p>
      {piece.id === "avis" && <p className="mt-3 text-xs leading-relaxed text-ink/55">{fr(REGLE_AVIS)}</p>}
    </li>
  );
}

export default function PileValeurLancement() {
  const groupes = piecesDisponibles();
  const total = valeurTotale();
  return (
    <section id="pile" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <Surtitre>La pile de valeur</Surtitre>
          <h2 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">{PILE.titre}</h2>
        </Reveal>

        <Reveal>
          <div className="mt-12 rounded-[2rem] bg-bone p-5 md:p-8 lg:rounded-[3rem] lg:p-10">
            <h3 className="mb-8 font-display text-xl font-black leading-tight md:text-2xl">{SCENE.titre}</h3>
            <Scene />
          </div>
        </Reveal>

        <div className="mt-14 space-y-4 md:space-y-14">
          {groupes.map((g, i) => (
            <Accordeon key={g.id} titre={g.titre} ouvert={i === 0}>
              <ul className="mt-4 grid list-none gap-4 md:mt-6 md:grid-cols-2 lg:grid-cols-3">
                {g.pieces.map((p) => (
                  <Carte key={p.id} piece={p} />
                ))}
              </ul>
            </Accordeon>
          ))}
        </div>

        <Reveal>
          <div className="relative mt-14 overflow-hidden rounded-[2rem] bg-ink p-7 text-white md:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/30 blur-3xl" />
            {total != null && (
              <p className="relative text-sm font-black uppercase tracking-widest text-white/60">
                {PILE.totalLibelle} : <span className="font-display text-2xl text-white">{argent(total)}</span>
              </p>
            )}
            <p className="relative font-display text-xl font-black leading-snug md:text-3xl">{fr(PILE.prixLigne)}</p>
            <a href={ANCRES.prix} className="relative mt-4 inline-block font-bold text-brand underline underline-offset-4 hover:text-white">
              {PILE.prixLien}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
