import type { NextConfig } from "next";

/* LES LIENS COURTS À COLLER DANS LES DESCRIPTIONS.

   `restoaction.ca/yt` pour la chaîne, `restoaction.ca/yt/<video>` pour une
   vidéo précise. Ils se déplient en UTM sur la page d'accueil, où
   instrumentation-client.ts les capte et où GA4 les lit tout seul. Un lien
   court se lit dans une description YouTube ; un lien à quatre UTM, non.

   Le slug de la vidéo est libre (lettres, chiffres, tirets), pas une liste
   fermée : ajouter une vidéo, c'est inventer un slug, sans redéployer.

   `permanent: false` (307) EXPRÈS : un 308 est mis en cache par le navigateur
   sans date de fin, et changer les UTM un jour ne changerait plus rien pour
   qui a déjà cliqué. Un clic est un GET, la conservation de la méthode n'a
   pas d'importance.

   Atterrissage sur l'accueil, pas sur /contact : quelqu'un qui vient d'une
   vidéo a besoin de l'argumentaire avant le formulaire, et la provenance
   survit à la navigation vers la page de contact. */
const CHAINE = "utm_source=youtube&utm_medium=video&utm_campaign=chaine";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/yt", destination: `/?${CHAINE}`, permanent: false },
      {
        source: "/yt/:video([A-Za-z0-9_-]{1,60})",
        destination: `/?${CHAINE}&utm_content=:video`,
        permanent: false,
      },
      {
        source: "/li",
        destination: "/?utm_source=linkedin&utm_medium=social&utm_campaign=profil",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
