/* Les liens hreflang. Chaque page bilingue doit annoncer son homologue, et les
   deux annonces doivent s'accorder — les écrire à la main de chaque côté, c'est
   se donner l'occasion de les désaccorder.

   x-default pointe sur le français : c'est la version d'origine, et c'est ce
   que sert un visiteur dont on ne connaît pas la langue.

   Une fabrique plutôt qu'une constante depuis qu'il y a deux paires de pages
   (l'accueil et /contact) : copier l'objet une fois de plus, c'était accepter
   qu'un jour l'une des deux copies dérive. */
export const liensAlternes = (cheminFr: string, cheminEn: string) => ({
  "fr-CA": cheminFr,
  "en-CA": cheminEn,
  "x-default": cheminFr,
});

export const LIENS_ALTERNES = liensAlternes("/", "/en");
export const LIENS_ALTERNES_CONTACT = liensAlternes("/contact", "/en/contact");
