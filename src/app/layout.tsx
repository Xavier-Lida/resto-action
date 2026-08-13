import type { Metadata } from "next";
import { Caveat, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: "/",
    siteName: "Resto Action",
    title: "Resto Action | On règle les vrais problèmes des restos indépendants",
    description:
      "On commence par t'écouter. On trouve ce qui gruge ton resto, pis on le règle avec toi.",
  },
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
      {/* Le Header n'est plus global : la home a sa nav intégrée à la hero,
          les autres pages le rendent elles-mêmes. */}
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
