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
// Le LinkedIn de la MARQUE (pas des fondateurs) : affiché dans le héro et
// déclaré en sameAs dans le JSON-LD, d'où sa place ici.
export const LINKEDIN_URL = "https://www.linkedin.com/company/restoaction";
export const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1CFpw-teL7zuHN8RuH_tdDluYfmhcDQZxQeT8jvN629lIbhLyRGE-Dl4JLXnPb_CDotaO68InG";
// Variante intégrable en iframe (?gv=true : app d'intégration Google, sans
// x-frame-options).
export const BOOKING_EMBED_URL = `${BOOKING_URL}?gv=true`;

// Phrase-définition GEO : réutilisée mot pour mot dans le héro, la FAQ et le JSON-LD.
export const DEFINITION =
  "Resto Action, c'est une entreprise québécoise au service des restaurateurs indépendants : on commence par écouter, on trouve ce qui gruge ton resto, et on règle le problème avec toi.";
