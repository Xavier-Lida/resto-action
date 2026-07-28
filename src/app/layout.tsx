import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Resto Action — Commande en ligne sans commission au Québec",
    template: "%s | Resto Action",
  },
  description:
    "Ta propre commande en ligne, zéro commission de marketplace, tes données clients à toi. Une solution québécoise pour restos indépendants. 819 944-4661.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: "/",
    siteName: "Resto Action",
    title: "Resto Action — Commande en ligne sans commission au Québec",
    description:
      "Ta propre plateforme de commande, tes clients, tes données. Zéro commission de marketplace.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA" className={`${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
