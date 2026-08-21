import type { Metadata } from "next";
import { Caveat, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_MESURE_ID, SITE_URL } from "@/lib/site";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Resto Action | On règle les vrais problèmes des restos indépendants",
    template: "%s | Resto Action",
  },
  description:
    "Une entreprise québécoise à l'écoute des restaurateurs indépendants. On trouve ce qui gruge ton resto pis on le règle avec toi. 819 944-4661.",
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr-CA"
      className={`${caveat.variable} ${unbounded.variable} h-full antialiased`}
    >
      {/* Ni le Header ni le Footer ne sont globaux : la home a sa nav intégrée
          à la hero, et le pied de page suit la langue de la page qui le rend —
          rendu ici, il resterait français sur /en. Chaque page rend donc les
          deux elle-même. */}
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
      {/* GA4 se pose en FRÈRE du <body>, hors de lui : c'est la forme que
          prescrit la doc de Next 16 pour ce composant. Il charge gtag.js après
          l'hydratation, donc sans retarder l'affichage — c'est tout l'intérêt
          de passer par @next/third-parties plutôt que de coller la balise brute
          de Google, qui s'exécuterait dans le chemin critique. */}
      <GoogleAnalytics gaId={GA_MESURE_ID} />
    </html>
  );
}
