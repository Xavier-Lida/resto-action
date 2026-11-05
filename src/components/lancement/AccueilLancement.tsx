import BarreNav from "@/components/BarreNav";
import BarreReservation from "@/components/BarreReservation";
import DonneesStructurees from "@/components/DonneesStructurees";
import Footer from "@/components/Footer";
import SectionFaq from "@/components/SectionFaq";
import BonusLancement from "@/components/lancement/BonusLancement";
import CalculateurReleve from "@/components/lancement/CalculateurReleve";
import ComparaisonLancement from "@/components/lancement/ComparaisonLancement";
import FinLancement from "@/components/lancement/FinLancement";
import FriseLancement from "@/components/lancement/FriseLancement";
import GarantiesLancement from "@/components/lancement/GarantiesLancement";
import HeroLancement from "@/components/lancement/HeroLancement";
import MoteursLancement from "@/components/lancement/MoteursLancement";
import PileValeurLancement from "@/components/lancement/PileValeurLancement";
import PrixLancement from "@/components/lancement/PrixLancement";
import ProblemeLancement from "@/components/lancement/ProblemeLancement";
import QuiOnEstLancement from "@/components/lancement/QuiOnEstLancement";
import RareteLancement from "@/components/lancement/RareteLancement";
import { ANCRES, DATE_COHORTE, FAQ, FIN, disponible } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";
import { noeudFaq } from "@/lib/schema";
import { EMAIL, FONDATEURS, LINKEDIN_URL, PHONE_E164, POSTAL_CODE, SITE_URL, STREET, YOUTUBE_URL } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* LA PAGE D'ACCUEIL DU GRAND LANCEMENT D'HIVER (français).

   Les sections suivent l'ordre du prompt : haut de page, le problème, les 3
   moteurs, comment ça marche, le calculateur, la pile de valeur, les bonus,
   les garanties, la comparaison, le prix, la rareté, qui on est, la FAQ, la
   fin de page. Tous les textes et chiffres viennent de
   src/lib/contenu/grand-lancement.ts. La version anglaise (/en) garde
   l'ancien accueil tant qu'elle n'est pas traduite. */
export default function AccueilLancement({ t }: { t: Textes }) {
  const questions = FAQ.questions.filter(disponible).map((q) => ({ q: `« ${fr(q.question)} »`, a: fr(q.reponse) }));
  const racine = `${SITE_URL}${t.racine}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${racine}/#organization`,
        name: "Resto Action",
        url: racine,
        logo: `${SITE_URL}/logo-marque.png`,
        image: `${SITE_URL}/logo-marque.png`,
        description: t.donnees.definition,
        sameAs: [LINKEDIN_URL, YOUTUBE_URL],
        priceRange: "$$",
        telephone: PHONE_E164,
        email: EMAIL,
        address: { "@type": "PostalAddress", streetAddress: STREET, addressLocality: "Trois-Rivières", addressRegion: "QC", postalCode: POSTAL_CODE, addressCountry: "CA" },
        areaServed: { "@type": "AdministrativeArea", name: t.donnees.zoneServie },
        parentOrganization: { "@type": "Organization", name: "Studios LT" },
        founder: Object.values(FONDATEURS).map(({ nom, linkedin }) => ({ "@type": "Person", name: nom, sameAs: linkedin })),
      },
      noeudFaq({ id: `${racine}/#faq`, langue: t.htmlLang, items: questions }),
    ],
  };

  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        <HeroLancement t={t} />
        <ProblemeLancement />
        <MoteursLancement />
        <FriseLancement />
        <CalculateurReleve />
        <PileValeurLancement />
        <BonusLancement />
        <GarantiesLancement />
        <ComparaisonLancement />
        <PrixLancement />
        <RareteLancement />
        <QuiOnEstLancement t={t} />
        <SectionFaq id={ANCRES.faq.slice(1)} titre={fr(FAQ.titre)} items={questions} centre />
        <FinLancement />
        <DonneesStructurees json={jsonLd} />
      </main>
      {/* La barre qui suit le visiteur mène au calculateur : c'est le premier
          pas de l'offre. Elle se cache dès qu'un gros bouton est à l'écran. */}
      <BarreReservation href={ANCRES.calculateur} libelle={FIN.barreCollante} places={fr(`Prochaine cohorte : ${DATE_COHORTE}`)} />
      <Footer t={t} />
    </>
  );
}
