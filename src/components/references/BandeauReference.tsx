import { AFFICHER_MONTANTS, MONTANTS, REFERE_UN_RESTO } from "@/lib/contenu/references";
import BandeauReferenceClient from "./BandeauReferenceClient";

/* LE BANDEAU « X T'A RECOMMANDÉ RESTO ACTION », en haut de l'accueil.

   Il n'apparaît que pour un visiteur arrivé par /p/CODE ou /f/CODE dans les
   2 dernières heures (petit témoin posé par src/lib/references/lien.ts).
   Les textes sont choisis ici, côté serveur : le navigateur ne reçoit ni la
   liste des codes ni les montants qui ne s'affichent pas encore.

   Le « plus de pub » n'est promis qu'au resto référé par un resto CLIENT :
   pour un partenaire, l'avantage est convenu dans son entente. */
export default function BandeauReference({ langue }: { langue: "fr" | "en" }) {
  const a = REFERE_UN_RESTO.atterrissage;
  const t =
    langue === "en"
      ? { bandeau: a.en.bandeau, bonus: AFFICHER_MONTANTS ? a.en.bonusMontant(MONTANTS) : a.en.bonus, fermer: a.en.fermer }
      : { bandeau: a.bandeauClient, bonus: AFFICHER_MONTANTS ? a.bonusMontant(MONTANTS) : a.bonus, fermer: a.fermer };
  return <BandeauReferenceClient {...t} />;
}
