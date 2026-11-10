import BarreNav from "@/components/BarreNav";
import BarreReservation from "@/components/BarreReservation";
import DonneesStructurees from "@/components/DonneesStructurees";
import Footer from "@/components/Footer";
import Resultats from "@/components/Resultats";
import ToutCeQuOnFait from "@/components/lancement/ToutCeQuOnFait";
import CalculateurReleve from "@/components/lancement/CalculateurReleve";
import EtapesInclus from "@/components/lancement/EtapesInclus";
import GarantiesLancement from "@/components/lancement/GarantiesLancement";
import HeroLancement from "@/components/lancement/HeroLancement";
import PrixLancement from "@/components/lancement/PrixLancement";
import QuiOnEstLancement from "@/components/lancement/QuiOnEstLancement";
import RareteLancement from "@/components/lancement/RareteLancement";
import SystemeBento from "@/components/lancement/SystemeBento";
import { FONCTIONNALITES_EN, FONCTIONNALITES_FR } from "@/lib/contenu/fonctionnalites";
import { contenuLancement } from "@/lib/contenu/lancement";
import { ui } from "@/lib/contenu/ui-lancement";
import { formats } from "@/lib/format";
import { EMAIL, FONDATEURS, LINKEDIN_URL, PHONE_E164, POSTAL_CODE, SITE_URL, STREET, YOUTUBE_URL } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* LA PAGE D'ACCUEIL DU GRAND LANCEMENT D'HIVER (français).

   1. La promesse qui roule (ventes en ligne, nouveaux clients, commandes
      directes, argent), le bouton du calculateur, l'urgence.
   2. Le problème en une ligne, le Système en images, les onglets à la Owner,
      puis tout ce qu'on fait (chaque pièce vers sa page).
   3. Le calculateur (le relevé lu par l'IA).
   4. Les 4 garanties, une ligne et une petite animation chacune.
   5. Le prix en quatre chiffres, les bonus, l'exemple à +629 $.
   6. Tout ce qui est inclus, étape par étape, qui on est, et le bandeau de
      la rareté avec le téléphone.
   La FAQ est sur sa propre page (/faq). Textes et chiffres :
   src/lib/contenu/grand-lancement.ts. */
export default function AccueilLancement({ t }: { t: Textes }) {
  const langue = t.htmlLang.startsWith("en") ? "en" : "fr";
  const { ANCRES, DATE_COHORTE, FIN } = contenuLancement(langue);
  const { typo: fr } = formats(langue);
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
    ],
  };

  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        {/* 1. La promesse, l'accroche et le bouton du calculateur. */}
        <HeroLancement t={t} langue={langue} />
        {/* 2. Le problème en une ligne, puis le Système en images. */}
        <SystemeBento langue={langue} />
        <Resultats t={t} fonctionnalites={langue === "en" ? FONCTIONNALITES_EN : FONCTIONNALITES_FR} />
        {/* Tout ce qu'on fait, en un coup d'œil : chaque pièce mène à sa page. */}
        <ToutCeQuOnFait langue={langue} />
        {/* 3. Le calculateur. */}
        <CalculateurReleve langue={langue} />
        {/* 4. Les 4 garanties, une ligne chacune. */}
        <GarantiesLancement langue={langue} />
        {/* 5. Le prix tout compris, l'exemple et les bonus en 3 lignes. */}
        <PrixLancement langue={langue} />
        {/* 6. Tout ce qui est inclus, étape par étape (ça remplace la frise),
            qui on est, la rareté et le bouton. */}
        <EtapesInclus langue={langue} />
        <QuiOnEstLancement t={t} langue={langue} />
        <RareteLancement langue={langue} />
        {/* La FAQ vit maintenant sur sa propre page (/faq). */}
        <DonneesStructurees json={jsonLd} />
      </main>
      {/* La barre qui suit le visiteur mène au calculateur : c'est le premier
          pas de l'offre. Elle se cache dès qu'un gros bouton est à l'écran. */}
      <BarreReservation href={ANCRES.calculateur} libelle={FIN.barreCollante} places={fr(ui(langue).prochaineCohorte(DATE_COHORTE))} />
      <Footer t={t} />
    </>
  );
}
