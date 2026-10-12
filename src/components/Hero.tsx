import BarrePlaces from "@/components/BarrePlaces";
import BoutonReserver from "@/components/BoutonReserver";
import DemoApp from "@/components/DemoApp";
import GenerateurApp from "@/components/GenerateurApp";
import LienPasPret from "@/components/LienPasPret";
import TitreRoulant from "@/components/TitreRoulant";
import { cheminReservation } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* LE HÉRO, INSPIRÉ D'OWNER.COM.

   Sur fond blanc, tout centré : d'où on vient, le titre qui roule (« Ton app.
   Tes ventes. Tes clients. »), une ligne de ce qui est inclus, puis l'app de
   Bistro Habibi qui défile dans un téléphone posé sur un grand panneau rouge,
   coupé au bas du panneau.

   L'ORDRE CHANGE SELON L'ÉCRAN. À l'ordi, comme owner.com : la maquette
   gratuite et le bouton sous le titre, le téléphone en dessous. Au téléphone,
   à la demande de Guillaume : le titre, l'app, puis la maquette et le bouton. */
export default function Hero({ t }: { t: Textes }) {
  const reserver = cheminReservation(t.racine);

  return (
    <section id="top" className="bg-white px-3 pt-10 md:px-5 md:pt-16 lg:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <p className="animate-hero delay-1 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-bold text-brand">
          <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
          {t.hero.badge}
        </p>

        <TitreRoulant
          lignes={t.hero.titre}
          className="animate-hero delay-1 mt-6 font-display text-[12vw] font-black leading-[1.02] tracking-tight text-ink sm:text-7xl lg:text-8xl"
        />

        <ul className="animate-hero delay-2 mt-5 hidden max-w-2xl list-none sm:flex flex-wrap items-center justify-center lg:max-w-none gap-x-3 gap-y-1 text-base font-semibold text-ink/60 md:text-lg">
          {t.hero.puces.map((puce, i) => (
            <li key={puce} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="text-brand">
                  ·
                </span>
              )}
              {puce}
            </li>
          ))}
        </ul>

        <div className="flex w-full flex-col items-center">
          {/* La maquette gratuite et le bouton : sous le titre à l'ordi
              (order-1), sous le téléphone au cellulaire (order-2). */}
          <div className="order-2 mt-10 flex w-full flex-col items-center gap-5 lg:order-1 lg:mt-10">
            <div className="flex w-full justify-center">
              <GenerateurApp t={t} />
            </div>

            <div className="animate-hero delay-3 flex flex-col items-center gap-1.5">
              <BarrePlaces modele={t.hero.places} ton="sombre" />
              <p className="text-sm font-semibold text-ink/55">{t.hero.condition}</p>
            </div>

            <div className="animate-hero delay-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <BoutonReserver href={reserver} libelle={t.hero.reserver} />
              <LienPasPret
                libelle={t.hero.pasPret}
                className="font-bold text-ink underline underline-offset-4 transition hover:text-brand"
              />
            </div>
          </div>

          {/* LE TÉLÉPHONE SUR LE PANNEAU ROUGE. Le panneau commence sous le
              haut du téléphone; la boîte coupe le téléphone au bas du panneau,
              comme owner.com. */}
          <figure className="animate-hero delay-2 relative order-1 mt-10 w-full lg:order-2 lg:mt-16">
            <div className="relative h-[27rem] overflow-hidden sm:h-[31rem] lg:h-[34rem]">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 top-16 overflow-hidden rounded-[2rem] bg-hero lg:top-24 lg:rounded-[3rem]"
              >
                <div className="absolute -left-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-16 size-96 rounded-full bg-brand/60 blur-3xl" />
              </div>
              <div className="relative flex justify-center">
                <DemoApp
                  demo="client"
                  alt={t.hero.maquette.exempleAlt}
                  attente={t.hero.maquette.attente}
                  className="[--demo-w:15rem] sm:[--demo-w:17rem] lg:[--demo-w:18.5rem]"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-sm font-bold text-ink/55">{t.hero.appHabibi}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
