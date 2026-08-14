import Image from "next/image";
import { BOOKING_URL, CITY, EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/60">
      <div className="mx-auto max-w-6xl px-5 py-12 grid gap-10 md:grid-cols-3 text-sm">
        <div className="space-y-4">
          <Image
            src="/logo-blanc.png"
            alt="Resto Action"
            width={1012}
            height={128}
            draggable={false}
            className="h-7 w-auto"
          />
          <p>
            Une entreprise de Trois-Rivières au service des restaurants
            indépendants du Québec.
          </p>
        </div>
        <nav className="flex flex-col gap-2" aria-label="Pied de page">
          <a href="/#approche" className="hover:text-white transition-colors">
            Notre approche
          </a>
          <a href="/#mission" className="hover:text-white transition-colors">
            Notre mission
          </a>
          <a href="/#histoire" className="hover:text-white transition-colors">
            Notre histoire
          </a>
          <a href="/#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
          <a href="/confidentialite" className="hover:text-white transition-colors">
            Politique de confidentialité
          </a>
        </nav>
        <div className="flex flex-col gap-2">
          <a
            href={PHONE_HREF}
            className="font-bold text-white/80 hover:text-white transition-colors"
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener"
            className="hover:text-white transition-colors"
          >
            Céduler un appel
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="hover:text-white transition-colors"
          >
            {EMAIL}
          </a>
          <p>{CITY}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs">
          © {new Date().getFullYear()} Resto Action, un produit de{" "}
          <a
            href="https://studioslt.com"
            target="_blank"
            rel="noopener"
            className="font-bold text-white/80 underline transition-colors hover:text-white"
          >
            Studios LT
          </a>
          , {CITY}.
        </div>
      </div>
    </footer>
  );
}
