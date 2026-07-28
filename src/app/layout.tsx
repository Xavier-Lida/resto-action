import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resto Action — Le fruit du travail des restaurateurs doit leur revenir",
  description:
    "Ta propre solution, tes propres clients, zéro commission de marketplace. Resto Action redonne aux restaurateurs québécois leur canal direct et leurs clients. Appelle-nous pour découvrir ta solution : 819 944-4661.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA" className={`${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
