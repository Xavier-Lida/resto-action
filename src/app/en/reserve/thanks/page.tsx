import type { Metadata } from "next";
import PageMerciFondateur from "@/components/PageMerciFondateur";
import { EN } from "@/lib/textes/en";

export const metadata: Metadata = {
  title: EN.reservation.merci.metaTitre,
  robots: { index: false, follow: false },
};

export default async function Thanks({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session } = await searchParams;
  return <PageMerciFondateur t={EN} session={typeof session === "string" ? session : undefined} />;
}
