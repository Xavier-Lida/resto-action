import BoutonReserver from "@/components/BoutonReserver";
import Reveal from "@/components/Reveal";
import { Surtitre } from "@/components/lancement/ui";
import { ANCRES, RARETE, bonusDisponibles, lienReservation } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";

/* LA RARETÉ ET L'URGENCE : le grand panneau rouge du héro, avec ses ondes.
   Les dates viennent du fichier de contenu. Aucun compte à rebours, aucun
   compteur de places. */
export default function RareteLancement() {
  const expire = bonusDisponibles().filter((b) => b.expire);
  return (
    <section id={ANCRES.reserver.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-hero via-hero to-brand text-white lg:rounded-[3rem]">
        <div aria-hidden="true" className="absolute right-0 top-1/2 size-[26rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-white/15 blur-3xl" />
        <svg
          aria-hidden="true"
          className="absolute -right-40 top-1/2 h-[200%] w-auto max-w-none -translate-y-1/2"
          viewBox="0 0 1000 1000"
          fill="none"
        >
          {[140, 230, 320, 410, 500, 590, 680, 770, 860, 950].map((r, k) => (
            <circle key={r} cx="500" cy="500" r={r / 2} stroke="white" strokeOpacity={0.26 - k * 0.02} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal>
            <Surtitre ton="sombre">La rareté et l&apos;urgence</Surtitre>
            <h2 className="mt-6 max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              {fr(RARETE.titre)}
            </h2>
            <div className="mt-8 max-w-2xl space-y-4 text-lg leading-relaxed text-white/90">
              {RARETE.lignes.map((l) => (
                <p key={l}>{fr(l)}</p>
              ))}
              {expire.length > 0 && (
                <p>
                  {RARETE.expirePrefixe} <strong className="text-white">{expire.map((b) => b.nom).join(" et ")}.</strong>
                </p>
              )}
              <p className="font-black text-white">{fr(RARETE.depot)}</p>
            </div>
            <div className="mt-10">
              <BoutonReserver href={lienReservation()} libelle={RARETE.bouton} ton="blanc" taille="xl" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
