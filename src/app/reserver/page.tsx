import type { Metadata } from "next";
import FormulaireFondateur from "@/components/FormulaireFondateur";
import { FR } from "@/lib/textes/fr";

/* /reserver : la réservation fondateur, en 4 étapes. Tous les boutons
   « Réserver ma place » du site y mènent ; le générateur d'app du héro y
   envoie le nom du resto (?resto=), et Stripe y ramène après une annulation
   (?annule=1). */
export const metadata: Metadata = {
  title: FR.reservation.metaTitre,
  description: FR.reservation.metaDescription,
  alternates: { canonical: "/reserver", languages: { "fr-CA": "/reserver", "en-CA": "/en/reserve" } },
};

export default async function Reserver({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const resto = typeof p.resto === "string" ? p.resto.slice(0, 120) : "";
  return <FormulaireFondateur t={FR} restoInitial={resto} annule={p.annule === "1"} />;
}
