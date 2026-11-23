import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BarreNav from "@/components/BarreNav";
import Footer from "@/components/Footer";
import Studio from "@/components/studio/Studio";
import { STUDIO_TEXTES } from "@/lib/contenu/studio";
import { studioOuvert } from "@/lib/site";
import { studioPret } from "@/lib/studio/acces";
import { FR } from "@/lib/textes/fr";

/* LE STUDIO PHOTO (/studio, 18 nov.) : le proprio téléverse la photo d'un plat
   et la reçoit retouchée comme en studio, sans personne.

   CACHÉE TANT QUE GUILLAUME N'A PAS DIT OUI : STUDIO_ACTIF est à faux
   (src/lib/site.ts). La page répond alors 404 partout, sauf sur un poste de
   développement. Elle n'est ni au menu, ni au plan du site (src/lib/routes.ts
   n'en sait rien), et elle demande aux moteurs de ne pas l'indexer.

   Rendue à chaque visite : la ligne de la mise en service vient de
   miseEnService() et disparaît toute seule le 19 décembre à 0 h. Français
   seulement. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: STUDIO_TEXTES.metaTitre,
  description: STUDIO_TEXTES.metaDescription,
  robots: { index: false, follow: false },
};

export default function PageStudio() {
  if (!studioOuvert()) notFound();
  return (
    <>
      <BarreNav t={FR} />
      <main className="flex-1" lang="fr-CA">
        <Studio ligneMise={STUDIO_TEXTES.ligneMise} pret={studioPret()} />
      </main>
      <Footer t={FR} />
    </>
  );
}
