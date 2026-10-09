import type { Metadata } from "next";
import PageDossier from "@/components/PageDossier";
import { EN } from "@/lib/textes/en";

export const metadata: Metadata = {
  title: EN.reservation.dossier.metaTitre,
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Status({ params }: { params: Promise<{ session: string }> }) {
  const { session } = await params;
  return <PageDossier t={EN} session={session} />;
}
