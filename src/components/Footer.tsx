import Image from "next/image";
import { BOOKING_URL, CITY, EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/60">
      <div className="mx-auto max-w-6xl px-5 py-12 grid gap-10 md:grid-cols-3 text-sm">
        <div className="space-y-3">
          <Image
            src="/logo-dark.svg"
            alt="Resto Action"
            width={180}
            height={48}
            className="h-8 w-auto"
          />
          <p>
            La commande en ligne des restaurants indépendants du Québec, sans
            commission de marketplace.
          </p>
        </div>
        <nav className="flex flex-col gap-2" aria-label="Pied de page">
          <a href="/#solution" className="hover:text-white transition-colors">
            La solution
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
          © {new Date().getFullYear()} Resto Action, un produit de Studio LT,{" "}
          {CITY}.
        </div>
      </div>
    </footer>
  );
}
