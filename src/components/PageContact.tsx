import { ArrowLeft, CalendarDays, Phone } from "lucide-react";
import BarreNav from "@/components/BarreNav";
import Buoy from "@/components/Buoy";
import CalendarEmbed from "@/components/CalendarEmbed";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* La page /contact, partagée par les deux langues.

   ELLE NE REMPLACE PAS la section #contact de l'accueil. Celle-ci reste
   l'aboutissement du one-pager : quelqu'un qui a tout lu doit pouvoir céduler
   sur place, sans un clic de plus. La page, elle, est la destination des
   boutons « Nous contacter » — elle pose les deux options à plat au lieu de
   faire défiler un visiteur pressé à travers six sections.

   Les deux options sont présentées à ÉGALITÉ, en deux cartes de même taille.
   Hiérarchiser l'une des deux reviendrait à décider à la place du restaurateur
   s'il préfère écrire ou parler — et c'est précisément le choix qu'on lui
   laisse. */
export default function PageContact({ t }: { t: Textes }) {
  const accueil = t.racine || "/";

  /* Le nœud ContactPage renvoie à l'Organization déclarée par l'accueil plutôt
     que de la redéclarer : deux fiches concurrentes pour la même entreprise,
     c'est ce que Google recolle mal. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}${t.racine}/contact#page`,
    url: `${SITE_URL}${t.racine}/contact`,
    name: t.pageContact.metaTitre,
    description: t.pageContact.metaDescription,
    inLanguage: t.htmlLang,
    about: { "@id": `${SITE_URL}${t.racine}/#organization` },
  };

  return (
    <>
      <BarreNav t={t} />
      <main lang={t.htmlLang} className="flex-1">
        <div className="mx-auto max-w-5xl px-5 pb-20 pt-16 md:pt-24">
          <Reveal>
            <div className="text-center">
              <Buoy className="mx-auto mb-6 w-14" />
              <p className="text-xs font-black uppercase tracking-widest text-brand">
                {t.pageContact.surtitre}
              </p>
              <h1 className="mt-3 font-display text-4xl font-black leading-tight tracking-tight md:text-6xl">
                {t.pageContact.titre}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
                {t.pageContact.sousTitre}
              </p>
            </div>
          </Reveal>

          {/* Les deux chemins, à égalité. `items-stretch` pour que la carte au
              texte le plus court ne soit pas la plus petite : deux cartes de
              tailles différentes, c'est déjà une hiérarchie. */}
          <div className="mt-14 grid items-stretch gap-5 md:grid-cols-2">
            <Reveal>
              <a
                href="#agenda"
                className="group flex h-full flex-col rounded-3xl border-2 border-bone bg-white p-8 transition-colors hover:border-brand"
              >
                <span className="grid size-12 place-items-center rounded-full bg-brand text-white">
                  <CalendarDays className="size-6" />
                </span>
                <h2 className="mt-6 text-2xl font-black tracking-tight">
                  {t.pageContact.rdv.titre}
                </h2>
                <p className="mt-3 leading-relaxed text-ink/70">
                  {t.pageContact.rdv.texte}
                </p>
                <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-black text-white transition-colors group-hover:bg-ink">
                  {t.pageContact.rdv.bouton}
                </span>
              </a>
            </Reveal>

            <Reveal delay={1}>
              <a
                href={PHONE_HREF}
                className="group flex h-full flex-col rounded-3xl border-2 border-bone bg-white p-8 transition-colors hover:border-ink"
              >
                <span className="grid size-12 place-items-center rounded-full bg-ink text-white">
                  <Phone className="size-6" />
                </span>
                <h2 className="mt-6 text-2xl font-black tracking-tight">
                  {t.pageContact.tel.titre}
                </h2>
                <p className="mt-3 leading-relaxed text-ink/70">
                  {t.pageContact.tel.texte}
                </p>
                <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-black text-white transition-colors group-hover:bg-brand">
                  <Phone className="size-4" />
                  {PHONE_DISPLAY}
                </span>
              </a>
            </Reveal>
          </div>
        </div>

        {/* L'agende en pleine largeur sur le rouge, comme la section #contact
            de l'accueil : la même action porte le même fond. */}
        <section id="agenda" className="bg-hero text-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
            <Reveal>
              <div className="text-center">
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
                  {t.pageContact.agendaTitre}
                </h2>
                <p className="mt-3 text-white/85">
                  {t.pageContact.agendaTexte}
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="mt-10">
                <CalendarEmbed t={t} />
              </div>
            </Reveal>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-5 py-12 text-center">
          <a
            href={accueil}
            className="inline-flex items-center gap-2 text-sm font-bold text-ink/60 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            {t.pageContact.retour}
          </a>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </main>
      <Footer t={t} />
    </>
  );
}
