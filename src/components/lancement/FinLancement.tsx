import { Phone } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import Buoy from "@/components/Buoy";
import Reveal from "@/components/Reveal";
import { BoutonContour } from "@/components/lancement/ui";
import { ANCRES, FIN, lienAppel, lienReservation } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";

/* LA FIN DE PAGE : la dernière carte sombre, la bouée, et les trois boutons. */
export default function FinLancement() {
  return (
    <section id="fin" className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 text-center md:py-28">
          <Reveal>
            <Buoy className="mx-auto mb-8 w-24" />
            <p className="mx-auto max-w-3xl text-lg font-bold leading-snug text-white/85 md:text-2xl">{fr(FIN.texte)}</p>
            <h2 className="mx-auto mt-8 max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
              {fr(FIN.titre)}
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <BoutonReserver href={ANCRES.calculateur} libelle={FIN.boutons.calcul} />
              <BoutonReserver href={lienReservation()} libelle={FIN.boutons.reserver} ton="blanc" />
              <BoutonContour href={lienAppel()} ton="clair">
                <Phone className="size-4" aria-hidden="true" />
                {FIN.boutons.appel}
              </BoutonContour>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
