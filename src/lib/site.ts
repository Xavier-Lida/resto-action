// Source unique de vérité pour les coordonnées et l'URL du site.
export const SITE_URL = "https://restoaction.ca"; // TODO: confirmer l'achat du domaine avant le déploiement
export const SITE_NAME = "Resto Action";
export const PHONE_DISPLAY = "819 944-4661";
export const PHONE_E164 = "+18199444661";
export const PHONE_HREF = "tel:+18199444661";
// À migrer vers contact@restoaction.ca quand l'adresse existera
export const EMAIL = "guillaume@studioslt.com";
export const CITY = "Trois-Rivières, Québec";
export const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1CFpw-teL7zuHN8RuH_tdDluYfmhcDQZxQeT8jvN629lIbhLyRGE-Dl4JLXnPb_CDotaO68InG";
// Variante intégrable en iframe (?gv=true : app d'intégration Google, sans
// x-frame-options).
export const BOOKING_EMBED_URL = `${BOOKING_URL}?gv=true`;

// Phrase-définition GEO : réutilisée mot pour mot dans le héro, la FAQ et le JSON-LD.
export const DEFINITION =
  "Resto Action, c'est une solution québécoise de commande en ligne directe : les restaurants indépendants reçoivent leurs commandes sans commission de marketplace pis gardent les données de leurs clients.";
