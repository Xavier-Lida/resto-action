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
export const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1CFpw-teL7zuHN8RuH_tdDluYfmhcDQZxQeT8jvN629lIbhLyRGE-Dl4JLXnPb_CDotaO68InG";
// Variante intégrable en iframe (?gv=true : app d'intégration Google, sans
// x-frame-options).
export const BOOKING_EMBED_URL = `${BOOKING_URL}?gv=true`;

/* La date du dernier remaniement du CONTENU, pas du dernier déploiement. Un
   moteur qui ne voit aucune date sur une page ne sait pas si elle date d'hier
   ou de 2019 ; une date de build, elle, mentirait — elle bougerait à chaque
   correction de CSS sans qu'un mot ait changé. Celle-ci se met à jour à la
   main, quand le texte change pour vrai.

   Le format d'affichage n'est PAS écrit ici : le pied de page la formate selon
   la langue de la page (`toLocaleDateString`), sinon il faudrait maintenir
   « 17 août 2026 » et « August 17, 2026 » en parallèle et les laisser dériver. */
export const MISE_A_JOUR = "2026-08-18";

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
