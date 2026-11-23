/* LE TÉLÉPHONE, MIS EN FORME À LA FRAPPE.

   Les gens tapent « 8199444661 », « 819-944-4661 », « 819 944 4661 » ou
   collent « +1 819 944 4661 ». Tout ça atterrissait tel quel dans l'événement,
   et Guillaume relisait dix formats différents avant de composer.

   ELLE NE BLOQUE RIEN, elle reformate. Un champ qui refuse une frappe est un
   champ dont on ne comprend pas le refus : ici, les chiffres sont retenus, la
   ponctuation est refaite, et ce qu'on ne sait pas lire passe intact.

   Le « 1 » d'en-tête n'est retiré qu'à ONZE chiffres : le retirer dès la
   première frappe ferait disparaître le chiffre sous les doigts de quelqu'un
   qui commence par l'indicatif de pays. Aucun indicatif régional nord-américain
   ne commence par 1, donc à onze chiffres il n'y a pas d'ambiguïté.

   Un numéro qui commence par « + » est laissé TEL QUEL : c'est un numéro
   étranger, et lui plaquer des parenthèses nord-américaines le rendrait faux.

   Partagé par l'agenda et la réservation fondateur (src/lib/telephone.ts). */
export function formaterTelephone(brut: string): string {
  if (brut.trimStart().startsWith("+")) return brut.slice(0, 24);

  let chiffres = brut.replace(/\D/g, "");
  if (chiffres.length === 11 && chiffres.startsWith("1")) chiffres = chiffres.slice(1);
  chiffres = chiffres.slice(0, 10);

  // Les parenthèses n'arrivent qu'une fois l'indicatif complet : « (81 » sous
  // les doigts de quelqu'un qui tape encore, c'est une ponctuation qui commente.
  if (chiffres.length <= 3) return chiffres;
  if (chiffres.length <= 6) return `(${chiffres.slice(0, 3)}) ${chiffres.slice(3)}`;
  return `(${chiffres.slice(0, 3)}) ${chiffres.slice(3, 6)}-${chiffres.slice(6)}`;
}

/** Les 10 chiffres d'un numéro d'ici, peu importe comment il a été écrit
    (« 819 555-0100 », « 819.555.0100 », « +1 (819) 555-0100 »), ou null s'il
    n'en a pas 10. Le « 1 » d'en-tête ne compte pas. */
export function dixChiffres(brut: string): string | null {
  let chiffres = brut.replace(/\D/g, "");
  if (chiffres.length === 11 && chiffres.startsWith("1")) chiffres = chiffres.slice(1);
  return chiffres.length === 10 ? chiffres : null;
}

/** Le seul format qu'on envoie au CRM : « (819) 555-0100 ». Null si le numéro n'a pas 10 chiffres. */
export function telephoneNormalise(brut: string): string | null {
  const chiffres = dixChiffres(brut);
  return chiffres ? formaterTelephone(chiffres) : null;
}
