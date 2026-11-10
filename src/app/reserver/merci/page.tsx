import type { Metadata } from "next";
import PageMerciFondateur from "@/components/PageMerciFondateur";
import { FR } from "@/lib/textes/fr";

// Une page de confirmation n'a rien à faire dans Google.
export const metadata: Metadata = {
  title: FR.reservation.merci.metaTitre,
  robots: { index: false, follow: false },
};

export default function Merci() {
  return <PageMerciFondateur t={FR} />;
}
