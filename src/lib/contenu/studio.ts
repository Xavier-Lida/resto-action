import { CALCUL_60 } from "@/lib/contenu/grand-lancement";
import { PHONE_DISPLAY, STUDIO } from "@/lib/site";
import { FR } from "@/lib/textes/fr";

/* LE STUDIO PHOTO (/studio, 18 nov.) : les textes de la page.

   Textes de Guillaume, mot pour mot, sauf ceux marqués « utilitaire » (libellés
   de champs, messages d'erreur, refus d'une photo), écrits ici faute de texte
   fourni : à relire. Les chiffres (délai, nombre de photos, garde) viennent de
   STUDIO dans src/lib/site.ts.

   Français seulement. Aucun compte à rebours, aucun compteur de places. */

/** La consigne de retouche envoyée au moteur d'IA, MOT POUR MOT. Ne pas y toucher. */
export const CONSIGNE_RETOUCHE =
  "Retouche cette photo de plat comme le ferait un photographe culinaire, sans rien inventer. Garde exactement le même plat : mêmes aliments, mêmes portions, même assiette, même disposition. Corrige seulement la lumière (douce et naturelle), la balance des blancs, les couleurs (fidèles), la netteté et le cadrage. Tu peux enlever les taches et les miettes autour de l'assiette et adoucir l'arrière-plan, sans le remplacer. N'ajoute aucun aliment, aucune vapeur, aucun accessoire, aucun texte. Si la photo est trop floue ou trop sombre pour être sauvée, dis-le au lieu d'inventer.";

export const STUDIO_TEXTES = {
  /** Le gabarit du site ajoute « | Resto Action ». */
  metaTitre: "Le Studio Photo",
  metaDescription: "Envoie la photo d'un de tes plats, prise au cell. Tu la reçois retouchée comme en studio.",

  // ─── A. La page ───
  titre: `Ta photo de studio en ${STUDIO.delaiPromis}.`,
  sousTitre: "Envoie la photo d'un de tes plats, prise au cell. Tu la reçois retouchée comme en studio. Gratuit.",
  conseil: "Près d'une fenêtre, sans flash.",
  /** Utilitaire. */
  champs: { resto: "Nom du resto", ville: "Ville", prenom: "Prénom", cellulaire: "Cellulaire" },
  /** Utilitaire. */
  boutonChoisir: "Choisis une photo",
  boutonPrendre: "Prends une photo",
  changerPhoto: "Changer de photo",
  formatsAcceptes: `JPEG, PNG ou HEIC (iPhone). ${STUDIO.tailleMaxMo} Mo au plus.`,
  boutonRetoucher: "Retouche ma photo",

  // ─── C1. L'attente ───
  /** Utilitaire : ce que dit la barre de progression à chaque étape. */
  etapes: {
    envoi: "On reçoit ta photo…",
    reception: "On prépare ta photo…",
    controle: "On regarde ton plat…",
    retouche: "On retouche la lumière et les couleurs…",
    verification: "On vérifie que ton plat est resté le même…",
    formats: "On prépare tes 2 formats…",
  },
  questionPlateformes: "Tu es sur quelles plateformes de livraison?",
  questionCommandes: "Tu fais combien de commandes en ligne par semaine?",
  /** Les mêmes choix que le formulaire /reserver, pour que le CRM lise la même chose. */
  listePlateformes: FR.reservation.app.listePlateformes,
  listeCommandes: FR.reservation.app.listeCommandes,
  facultatif: "Facultatif, pendant que ça travaille.",

  // ─── C2 et C3. Le résultat ───
  avant: "Avant",
  apres: "Après",
  curseur: "Glisse pour comparer l'avant et l'après",
  mentionIA:
    "Retouche faite par IA à partir de ta photo : la lumière, les couleurs, la netteté et le cadrage. Ton plat reste le même. Vérifie-le avant de publier.",
  mentionUsage:
    "Pour ton site, tes réseaux et tes affiches. Pour ta fiche Google, garde une retouche légère. Pour le menu d'une plateforme, prends ses outils.",
  /** Quand on livre la correction sans génération (2 échecs du contrôle, panne ou plafond). */
  messageRepli:
    "Ta photo était difficile à retoucher sans changer ton plat. Voici une correction de la lumière et des couleurs. Pour un meilleur résultat, reprends-la près d'une fenêtre, sans flash.",

  // ─── C4. Le formulaire ───
  formulaireTitre: "Reçois tes 2 formats en haute qualité et ta publication prête",
  consentementTextos:
    "J'accepte de recevoir des textos de Resto Action au sujet de mes photos. Je peux me désabonner en tout temps.",
  consentementExemple: "J'accepte que Resto Action montre mon avant et après comme exemple.",
  lienConfidentialite: { label: "Confidentialité", href: "/confidentialite" },
  boutonEnvoyer: "Envoie-moi mes photos",

  // ─── C5. Après l'envoi ───
  /** Utilitaire. */
  livraisonTitre: "Tes photos sont prêtes, {prenom}!",
  telecharger: { carre: "Télécharge le carré (1080 × 1080)", vertical: "Télécharge le vertical (1080 × 1350)" },
  publicationTitre: "Ta publication prête",
  copier: "Copie le texte",
  copie: "C'est copié!",
  /** « Fais-en 4 autres » : le chiffre est ce qu'il reste sur les 5 photos par resto. */
  boutonAutres(restantes: number): string {
    return restantes === 1 ? "Fais-en 1 autre" : `Fais-en ${restantes} autres`;
  },
  limiteAtteinte: `Tu as fait tes ${STUDIO.photosParResto} photos. Pour la suite, on s'en parle.`,

  // ─── D. La suite ───
  suite:
    "T'as aimé tes photos? La suite : on les met sur ton site et ton app à ton nom, là où tes clients commandent chez toi. C'est là que tu fais le plus d'argent par commande, pas sur une plateforme qui garde 25 à 30 %.",
  /** La ligne de la mise en service : la même que Le Calcul 60 secondes, tirée de
      miseEnService(). Vide dès le 19 décembre à 0 h : elle disparaît toute seule. */
  get ligneMise(): string {
    return CALCUL_60.ligneMise;
  },
  boutonReserver: CALCUL_60.boutonReserver,
  boutonAppel: CALCUL_60.boutonAppel,

  // ─── Utilitaire : ce qui manque, dit à côté du champ ───
  manque: {
    resto: "Écris le nom de ton resto.",
    ville: "Écris ta ville.",
    photo: "Ajoute la photo d'un de tes plats.",
    format: "Ce format ne passe pas. Envoie une photo JPEG, PNG ou HEIC.",
    taille: `Ta photo dépasse ${STUDIO.tailleMaxMo} Mo. Envoie-la en plus petit.`,
    prenom: "Écris ton prénom.",
    cellulaire: "Écris ton cellulaire, avec l'indicatif régional (10 chiffres).",
    textos: "Coche cette case pour recevoir tes photos.",
  },

  // ─── Utilitaire : quand on ne retouche pas (premier contrôle) ───
  refus: {
    visage:
      "On voit quelqu'un sur ta photo. Pour protéger les gens, on retouche seulement des plats. Reprends ta photo avec juste l'assiette.",
    "pas-un-plat": "On n'a pas reconnu de plat sur ta photo. Envoie la photo d'un de tes plats, bien au centre.",
    floue: "Ta photo est trop floue pour être sauvée. Reprends-la en tenant ton cell bien stable, près d'une fenêtre, sans flash.",
    sombre: "Ta photo est trop sombre pour être sauvée. Reprends-la près d'une fenêtre, sans flash.",
    illisible: "On n'a pas réussi à ouvrir ta photo. Essaie avec une autre, en JPEG, PNG ou HEIC.",
  },
  boutonAutrePhoto: "Envoie une autre photo",

  // ─── Utilitaire : les pannes ───
  erreurs: {
    trop: "Tu as atteint la limite de photos pour aujourd'hui. Reviens demain.",
    limite: `C'est ${STUDIO.photosParResto} photos au plus par resto.`,
    panne: `Ça n'a pas fonctionné. Réessaie, ou appelle-nous au ${PHONE_DISPLAY}.`,
    indisponible: `Le Studio Photo fait une pause. Réessaie plus tard, ou appelle-nous au ${PHONE_DISPLAY}.`,
  },
};

export type RaisonRefus = keyof typeof STUDIO_TEXTES.refus;

/* LE TEXTO PROPOSÉ DANS LE MINI CRM (/tableau/leads). À RELIRE : écrit ici
   faute de texte fourni par Guillaume. Le bouton « Texter » ouvre l'app
   Messages du cellulaire de celui qui lit, avec ce texte déjà écrit : RIEN NE
   PART TOUT SEUL, c'est lui qui appuie sur Envoyer. Si Guillaume écrit le
   gabarit du Studio dans src/lib/contenu/leads.ts (TEXTOS_LEADS.studio), c'est
   le sien qui sert. `{prenom}`, `{resto}` et `{ville}` sont remplis. */
export const TEXTO_SUIVI_STUDIO =
  "Salut {prenom}, c'est Guillaume de Resto Action. J'ai vu la photo de {resto} que tu as fait retoucher au Studio. T'as 15 minutes cette semaine pour qu'on en parle?";
