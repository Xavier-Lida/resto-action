import type { SourceLead } from "@/lib/leads/lead";

/* LES GABARITS DE TEXTO DE L'ALERTE [Lead].   À RELIRE

   Le lien « Texter » en haut de chaque courriel d'alerte ouvre un texto déjà
   écrit, adressé au cellulaire du resto. Le texte vient d'ici, un par source.

   C'EST GUILLAUME QUI LES ÉCRIT. Tant qu'un gabarit est vide, le lien ouvre
   un texto vide au bon numéro, et le courriel le dit. Rien n'est inventé ici.

   Quatre jetons sont remplacés : {prenom}, {resto}, {ville} et {lien}.
   {lien} est le lien du dossier du resto (le Calcul 60 secondes). Pour un lead
   qui a un dossier, le lien « Texter » du courriel ouvre ce texte déjà rempli.
   Exemple de forme (à ne pas garder tel quel) : « Salut {prenom}, … »

   AUCUN TEXTO NE PART TOUT SEUL : le lien ouvre l'app Messages du cellulaire
   de celui qui lit le courriel, et c'est lui qui appuie sur Envoyer. */

export const MARQUEUR_TEXTOS = "À RELIRE";

export const TEXTOS_LEADS: Record<SourceLead, string> = {
  /** Le Calcul 60 secondes. À RELIRE */
  "calcul-60": "Salut {prenom}, c'est Guillaume de Resto Action. Voici ton dossier pour {resto} : {lien}",
  /** Ton rang sur Google. À RELIRE */
  classement: "",
  /** Le Studio Photo. À RELIRE */
  studio: "",
  /** Un resto présenté par un référent (Réfère un resto). À RELIRE */
  reference: "",
  /** /reserver, étapes 1 et 4. À RELIRE */
  "reserve-ta-place": "",
  /** Un rendez-vous pris à l'agenda. À RELIRE */
  reservation: "",
  /** Le Dossier pour ton associé, après le relevé. À RELIRE */
  "dossier-releve": "",
  /** La maquette gratuite et l'ancien formulaire de références. À RELIRE */
  contact: "",
  /** Un lead ajouté à la main. */
  manuel: "",
};
