import type { Metadata } from "next";
import PageDossier from "@/components/PageDossier";
import { FR } from "@/lib/textes/fr";

// Un dossier privé : jamais dans Google, jamais suivi par un robot.
export const metadata: Metadata = {
  title: FR.reservation.dossier.metaTitre,
  robots: { index: false, follow: false },
};
// Toujours relu chez Stripe : une étape cochée doit apparaître tout de suite.
export const dynamic = "force-dynamic";

export default async function Dossier({ params }: { params: Promise<{ session: string }> }) {
  const { session } = await params;
  return <PageDossier t={FR} session={session} />;
}
