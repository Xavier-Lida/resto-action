import Image from "next/image";
import Reveal from "@/components/Reveal";
import { PROBLEME } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";

/* LE PROBLÈME, COURT. Une carte sombre arrondie, comme les autres cartes
   sombres de la page, avec la photo du resto fermé en fond. */
export default function ProblemeLancement() {
  return (
    <section id="probleme" className="bg-white px-3 pt-3 md:px-5 md:pt-5 lg:px-6 lg:pt-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <Image src="/faillite.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal>
            <p className="max-w-3xl font-display text-2xl font-black leading-tight tracking-tight md:text-4xl">
              {fr(PROBLEME)}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
