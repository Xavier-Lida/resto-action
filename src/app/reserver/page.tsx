import type { Metadata } from "next";
import FormulaireFondateur from "@/components/FormulaireFondateur";
import { RESERVATION, hreflang } from "@/lib/routes";
import { FR } from "@/lib/textes/fr";

/* La mise en service passe de 750 $ à 1 500 $ le 19 déc. à 0 h (heure de Montréal) :
   la page se régénère toutes les 5 minutes, sans redéploiement. */
export const revalidate = 300;

/* /reserver : la réservation gratuite, en 4 étapes. Tous les boutons
   « Réserve ta place » du site y mènent ; le générateur d'app du héro y
   envoie le nom du resto (?resto=). */
export const metadata: Metadata = {
  title: FR.reservation.metaTitre,
  description: FR.reservation.metaDescription,
  alternates: { canonical: "/reserver", languages: hreflang(RESERVATION) },
};

export default async function Reserver({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const resto = typeof p.resto === "string" ? p.resto.slice(0, 120) : "";
  return <FormulaireFondateur t={FR} restoInitial={resto} />;
}
