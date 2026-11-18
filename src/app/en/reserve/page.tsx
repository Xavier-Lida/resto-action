import type { Metadata } from "next";
import FormulaireFondateur from "@/components/FormulaireFondateur";
import { RESERVATION, hreflang } from "@/lib/routes";
import { EN } from "@/lib/textes/en";

/* La mise en service passe de 750 $ à 1 500 $ le 19 déc. à 0 h (heure de Montréal) :
   la page se régénère toutes les 5 minutes, sans redéploiement. */
export const revalidate = 300;

// La version anglaise de /reserver : mêmes étapes, mêmes paramètres.
export const metadata: Metadata = {
  title: EN.reservation.metaTitre,
  description: EN.reservation.metaDescription,
  alternates: { canonical: "/en/reserve", languages: hreflang(RESERVATION) },
};

export default async function Reserve({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const resto = typeof p.resto === "string" ? p.resto.slice(0, 120) : "";
  return <FormulaireFondateur t={EN} restoInitial={resto} />;
}
