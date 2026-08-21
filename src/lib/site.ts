// Source unique de vérité pour les coordonnées et l'URL du site.
// AVEC le www : c'est l'hôte réellement servi — restoaction.ca redirige en
// 308 vers www.restoaction.ca. Tout en découle (canonique, hreflang, sitemap,
// robots, Open Graph, @id du JSON-LD), donc un signal qui désignerait l'apex
// pointerait vers une redirection. Si la redirection Vercel s'inverse un jour,
// c'est ici et nulle part ailleurs qu'il faut le refléter.
export const SITE_URL = "https://www.restoaction.ca";
export const SITE_NAME = "Resto Action";
export const PHONE_DISPLAY = "819 944-4661";
export const PHONE_E164 = "+18199444661";
export const PHONE_HREF = "tel:+18199444661";
// À migrer vers contact@restoaction.ca quand l'adresse existera
export const EMAIL = "guillaume@studioslt.com";
export const CITY = "Trois-Rivières, Québec";
// L'adresse au registre des entreprises. Elle complète le NAP (nom, adresse,
// téléphone) du référencement local, qui n'avait jusqu'ici que deux tiers.
// ATTENTION, elle ne va PAS sur la fiche Google Business : aucun local n'est
// ouvert au public, la fiche doit donc rester une « entreprise de zone de
// service », adresse masquée. L'afficher là-bas expose à une suspension.
export const STREET = "185 rue Michel-Lemay";
export const POSTAL_CODE = "G8W 2P7";
// Le LinkedIn de la MARQUE (pas des fondateurs) : affiché dans le héro et
// déclaré en sameAs dans le JSON-LD, d'où sa place ici.
export const LINKEDIN_URL = "https://www.linkedin.com/company/restoaction";

/* L'IDENTIFIANT DE MESURE GOOGLE ANALYTICS 4.

   Il n'est PAS secret : Google l'expose en clair dans la balise, il part donc
   dans le paquet client de toute façon, et le mettre en variable
   d'environnement ne cacherait rien tout en ajoutant une valeur à tenir dans le
   tableau de bord Vercel. Sa place est ici, avec les autres constantes
   d'identité du site, là où on ira le chercher le jour où il faudra le changer.

   Le site mesure son achalandage DEUX fois, et c'est voulu : Vercel Analytics
   donne des pages vues sans témoins, GA4 donne les canaux d'acquisition et se
   relie à Search Console. Les deux sont déclarés dans la politique de
   confidentialité — GA4 dépose des témoins, ce que Vercel Analytics ne fait
   pas, et la Loi 25 veut que ce soit écrit. */
export const GA_MESURE_ID = "G-V8EERCZE9G";

/* LA PRISE DE RENDEZ-VOUS N'EST PLUS UNE URL, ET N'A PLUS SA PLACE ICI.

   Il y avait à cet endroit BOOKING_URL et BOOKING_EMBED_URL : le lien de la
   page Google Appointment Schedules, et sa variante `?gv=true` qu'on glissait
   dans une iframe en rognant l'en-tête de Google à la marge négative.

   L'agenda est maintenant à nous (`src/components/Agenda.tsx` et
   `src/app/api/agenda/route.ts`). Ce qu'il lui faut ne sont pas des constantes
   mais des SECRETS — clé du compte de service, identités de calendriers — qui
   n'ont rien à faire dans un fichier versionné : ils vivent en variables
   d'environnement, listées dans `.env.example`.

   L'ancienne page Google doit être DÉSACTIVÉE une fois ce site déployé, sinon
   deux portes mènent au même agenda et une seule est à notre nom. */

/* La date du dernier remaniement du CONTENU, pas du dernier déploiement. Un
   moteur qui ne voit aucune date sur une page ne sait pas si elle date d'hier
   ou de 2019 ; une date de build, elle, mentirait — elle bougerait à chaque
   correction de CSS sans qu'un mot ait changé. Celle-ci se met à jour à la
   main, quand le texte change pour vrai.

   Le format d'affichage n'est PAS écrit ici : le pied de page la formate selon
   la langue de la page (`toLocaleDateString`), sinon il faudrait maintenir
   « 17 août 2026 » et « August 17, 2026 » en parallèle et les laisser dériver. */
export const MISE_A_JOUR = "2026-08-21";

/* LES DEUX FONDATEURS, à un seul endroit.

   Leurs profils LinkedIn étaient écrits TROIS FOIS dans Accueil.tsx : dans le
   `founder` du JSON-LD, et dans les deux vignettes de la section Histoire. Les
   articles du blogue en ont maintenant besoin une quatrième fois pour déclarer
   leur auteur — et c'est ce `sameAs` identique qui permet aux moteurs de
   recoller l'auteur d'un article au dirigeant de l'entreprise. Quatre copies
   d'une URL, c'est trois occasions qu'elles cessent d'être identiques, et le
   recollement se ferait alors en silence de moins en moins bien. */
export const FONDATEURS = {
  guillaume: {
    nom: "Guillaume Therrien",
    linkedin: "https://www.linkedin.com/in/guillaume-therrien-776a653b3/",
  },
  justin: {
    nom: "Justin Bouillon",
    linkedin: "https://www.linkedin.com/in/justin-bouillon-58a667421/",
  },
} as const;

export type CleFondateur = keyof typeof FONDATEURS;

/* La phrase-définition GEO vivait ici. Elle en est partie : elle doit exister
   dans les DEUX langues, donc sa place est dans les dictionnaires
   (`donnees.definition`), d'où la tire le JSON-LD. La constante française qui
   restait ici n'était plus importée nulle part — deux vérités dont une morte. */
