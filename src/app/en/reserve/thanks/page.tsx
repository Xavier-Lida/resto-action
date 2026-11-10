import type { Metadata } from "next";
import PageMerciFondateur from "@/components/PageMerciFondateur";
import { EN } from "@/lib/textes/en";

export const metadata: Metadata = {
  title: EN.reservation.merci.metaTitre,
  robots: { index: false, follow: false },
};

export default function Thanks() {
  return <PageMerciFondateur t={EN} />;
}
