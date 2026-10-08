import type { Metadata } from "next";
import FormulaireFondateur from "@/components/FormulaireFondateur";
import { EN } from "@/lib/textes/en";

// La version anglaise de /reserver : mêmes étapes, mêmes paramètres.
export const metadata: Metadata = {
  title: EN.reservation.metaTitre,
  description: EN.reservation.metaDescription,
  alternates: { canonical: "/en/reserve", languages: { "fr-CA": "/reserver", "en-CA": "/en/reserve" } },
};

export default async function Reserve({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const resto = typeof p.resto === "string" ? p.resto.slice(0, 120) : "";
  return <FormulaireFondateur t={EN} restoInitial={resto} annule={p.annule === "1"} />;
}
