import BarreNav from "@/components/BarreNav";
import BoutonReserver from "@/components/BoutonReserver";
import DonneesStructurees from "@/components/DonneesStructurees";
import Footer from "@/components/Footer";
import SectionFaq from "@/components/SectionFaq";
import { contenuLancement } from "@/lib/contenu/lancement";
import { formats } from "@/lib/format";
import { noeudFaq } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* LA FAQ, SUR SA PROPRE PAGE (/faq). Elle a quitté le bas de l'accueil pour
   l'alléger. Les 6 plus grosses peurs d'abord, puis toutes les autres,
   ouvertes au besoin. Les liens #faq-… (ex. le calcul des garanties)
   ouvrent la bonne question. */
export default function PageFaq({ t }: { t: Textes }) {
  const langue = t.htmlLang.startsWith("en") ? "en" : "fr";
  const en = langue === "en";
  const { FAQ, disponible, lienReservation } = contenuLancement(langue);
  const { typo: fr } = formats(langue);
  const dispo = FAQ.questions.filter(disponible);
  const top = dispo.filter((q) => q.top);
  const questions = [...top, ...dispo.filter((q) => !q.top)].map((q) => ({ q: en ? `“${q.question}”` : `« ${fr(q.question)} »`, a: fr(q.reponse), id: q.id }));
  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        <section className="bg-white px-3 pt-3 md:px-5 md:pt-5 lg:px-6 lg:pt-6">
          <div className="rounded-[2rem] bg-bone px-5 py-14 text-center md:py-20 lg:rounded-[3rem]">
            <p className="text-base font-bold text-ink/55">{en ? "Frequently asked questions" : "Questions fréquentes"}</p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              {fr(FAQ.titre)}
            </h1>
          </div>
        </section>
        <SectionFaq titre={en ? "The biggest worries, first" : "Les plus grosses peurs, en premier"} items={questions} visibles={top.length} voirTout={en ? "See the other questions" : "Voir les autres questions"} centre />
        <section className="bg-white pb-20">
          <div className="flex justify-center">
            <BoutonReserver href={lienReservation()} libelle={en ? "Reserve your spot" : "Réserve ta place"} sous={en ? "Free. We'll call you to set your date." : "Gratuit. On t'appelle pour fixer ta date."} />
          </div>
        </section>
        <DonneesStructurees json={{ "@context": "https://schema.org", "@graph": [noeudFaq({ id: `${SITE_URL}${en ? "/en/faq" : "/faq"}#faq`, langue: t.htmlLang, items: questions })] }} />
      </main>
      <Footer t={t} />
    </>
  );
}
