import BarreNav from "@/components/BarreNav";
import BandeauReference from "@/components/references/BandeauReference";
import BarreReservation from "@/components/BarreReservation";
import DonneesStructurees from "@/components/DonneesStructurees";
import Footer from "@/components/Footer";
import CommentOnFait from "@/components/CommentOnFait";
import ChiffresLancement from "@/components/lancement/ChiffresLancement";
import CalculateurReleve from "@/components/lancement/CalculateurReleve";
import GarantiesLancement from "@/components/lancement/GarantiesLancement";
import HeroLancement from "@/components/lancement/HeroLancement";
import PrixLancement from "@/components/lancement/PrixLancement";
import QuiOnEstLancement from "@/components/lancement/QuiOnEstLancement";
import RareteLancement from "@/components/lancement/RareteLancement";
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
  const { DATE_LIMITE, RESTOS_PAR_MOIS, lienReservation } = contenuLancement(langue);
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
      {/* « Réfère un resto » : seulement pour un visiteur arrivé par /p/CODE ou /f/CODE. */}
      <BandeauReference langue={langue} />
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        {/* 1. La promesse, l'accroche et le bouton du calculateur. */}
        <HeroLancement t={t} langue={langue} />
        {/* 2. « Tu pourrais faire BEAUCOUP plus de ventes en ligne » : la
            vidéo, puis les étapes 01 à 06, chacune vers sa page. */}
        <ChiffresLancement langue={langue} />
        <CommentOnFait langue={langue} accueil />
        {/* 3. Le calculateur. */}
        <CalculateurReleve langue={langue} />
        {/* 4. Les 4 garanties, une ligne chacune. */}
        <GarantiesLancement langue={langue} />
        {/* 5. Le prix tout compris, l'exemple et les bonus en 3 lignes. */}
        <PrixLancement langue={langue} />
        {/* 6. Qui on est, la rareté et le bouton. */}
        <QuiOnEstLancement t={t} langue={langue} />
        <RareteLancement langue={langue} />
        {/* La FAQ vit maintenant sur sa propre page (/faq). */}
        <DonneesStructurees json={jsonLd} />
      </main>
      {/* La barre qui suit le visiteur mène au calculateur : c'est le premier
          pas de l'offre. Elle se cache dès qu'un gros bouton est à l'écran. */}
      <BarreReservation
        href={lienReservation()}
        libelle={langue === "en" ? "Reserve your spot" : "Réserve ta place"}
        places={fr(ui(langue).urgenceCourte(RESTOS_PAR_MOIS))}
        placesLongues={fr(ui(langue).urgence(RESTOS_PAR_MOIS, DATE_LIMITE))}
      />
      <Footer t={t} />
    </>
  );
}
