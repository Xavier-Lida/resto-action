import type { Metadata } from "next";
import ReglagesDemo from "@/components/ReglagesDemo";

/* Page de réglage de la démo animée, isolée du site.

   Volontairement ABSENTE de src/lib/routes.ts : ce registre alimente le plan du
   site et les balises hreflang, et une page de réglage n'a rien à y faire. */
export const metadata: Metadata = {
  title: "Réglage de la démo animée",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string | string[] }>;
}) {
  const { demo } = await searchParams;
  return <ReglagesDemo initiale={Array.isArray(demo) ? demo[0] : demo} />;
}
