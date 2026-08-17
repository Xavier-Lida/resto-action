/* Les liens hreflang, déclarés une seule fois et partagés par les deux pages :
   chacune doit annoncer l'autre, et les deux doivent s'accorder. Les écrire
   deux fois, c'est se donner l'occasion de les désaccorder.

   x-default pointe sur le français : c'est la version d'origine, et c'est ce
   que sert un visiteur dont on ne connaît pas la langue. */
export const LIENS_ALTERNES = {
  "fr-CA": "/",
  "en-CA": "/en",
  "x-default": "/",
};
