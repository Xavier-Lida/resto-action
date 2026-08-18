/* L'HORAIRE : SES RÈGLES ET SON CALCUL, SANS UNE LIGNE DE RÉSEAU.

   Ce fichier est volontairement pur. Il ne connaît ni Google, ni les variables
   d'environnement, ni la requête HTTP : on lui donne des fenêtres et des
   occupations, il rend des créneaux. C'est le seul endroit du dispositif où la
   logique est délicate, et c'est précisément pour ça qu'il doit rester
   vérifiable de tête, sans rien démarrer.

   Il est aussi importé par le COMPOSANT CLIENT, qui a besoin de la durée et du
   fuseau pour l'affichage. D'où l'interdiction absolue d'y importer `node:` :
   ça casserait le paquet du navigateur.

   CE QUI N'EST PAS ICI : les heures d'ouverture. Elles ne sont écrites nulle
   part dans le code — elles vivent dans le calendrier « Disponibilités » de
   Guillaume, où il les ajoute et les retire lui-même. Le jour où il ne veut
   plus des mardis matin, il efface l'événement ; personne ne redéploie. */

// La promesse faite partout sur le site : « trente minutes avec Guillaume ».
export const DUREE_MIN = 30;
// Le pas de la grille. Égal à la durée : les créneaux se touchent sans
// chevaucher, et une fenêtre de 9 h à 12 h en donne exactement six.
export const PAS_MIN = 30;
/* La respiration entre un rendez-vous et ce qui l'entoure. Sans elle, un appel
   qui déborde de deux minutes fait rater le suivant, et un rendez-vous collé à
   une réunion ne laisse pas le temps de changer de fenêtre. Elle élargit les
   occupations, jamais les disponibilités : c'est ce qui la rend sûre. */
export const TAMPON_MIN = 15;
/* Personne ne doit pouvoir réserver dans quinze minutes. Quatre heures, c'est
   assez pour que Guillaume voie l'invitation arriver et s'organise, et assez
   court pour que « on répond vite » reste vrai. */
export const PREAVIS_H = 4;
// Trois semaines. Au-delà, un agenda se réorganise de toute façon.
export const HORIZON_JOURS = 21;
/* Le fuseau NE SERT QU'À L'AFFICHAGE. Tout le calcul ci-dessous est en
   millisecondes UTC, parce que Google renvoie ses horaires en RFC 3339 avec
   leur décalage (« 2026-09-14T09:00:00-04:00 ») : l'instant est déjà absolu,
   il n'y a rien à convertir. C'est ce qui met ce fichier à l'abri du
   changement d'heure, où les calculs « à la main » se trompent d'une heure
   deux fois par année. */
export const FUSEAU = "America/Toronto";

/** Un intervalle de temps absolu, en millisecondes depuis l'époque. */
export type Intervalle = { debut: number; fin: number };

const MINUTE = 60_000;

/* Découpe les fenêtres offertes en créneaux réservables.

   `fenetres`    : ce que Guillaume propose (calendrier « Disponibilités »).
   `occupations` : ce qui le retient déjà (freeBusy de ses autres calendriers).
   `maintenant`  : l'instant de référence, passé en paramètre plutôt que lu de
                   `Date.now()` — c'est ce qui rend la fonction testable.

   Le résultat est trié, dédoublonné et en ISO UTC. Le dédoublonnage compte :
   deux fenêtres qui se chevauchent (une récurrence plus une plage ponctuelle
   ajoutée par-dessus) proposeraient sinon la même heure deux fois. */
export function decouperCreneaux(
  fenetres: Intervalle[],
  occupations: Intervalle[],
  maintenant: number,
): string[] {
  const plancher = maintenant + PREAVIS_H * 60 * MINUTE;
  const duree = DUREE_MIN * MINUTE;
  const pas = PAS_MIN * MINUTE;
  const tampon = TAMPON_MIN * MINUTE;

  // Les occupations élargies une fois pour toutes, plutôt qu'à chaque créneau.
  const bloques = occupations.map((o) => ({
    debut: o.debut - tampon,
    fin: o.fin + tampon,
  }));

  const retenus = new Set<number>();

  for (const fenetre of fenetres) {
    /* Le premier départ est le début de la fenêtre elle-même, pas la
       demi-heure ronde la plus proche : si Guillaume pose une plage de 9 h 15
       à 10 h 15, il veut manifestement être réservable à 9 h 15. */
    for (let debut = fenetre.debut; debut + duree <= fenetre.fin; debut += pas) {
      if (debut < plancher) continue;
      const fin = debut + duree;
      const encombre = bloques.some((b) => debut < b.fin && fin > b.debut);
      if (encombre) continue;
      retenus.add(debut);
    }
  }

  return [...retenus]
    .sort((a, b) => a - b)
    .map((ms) => new Date(ms).toISOString());
}
