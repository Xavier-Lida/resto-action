import Image from "next/image";
import { Phone } from "lucide-react";
import { PHONE_HREF } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-bone">
      <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
        <a href="/#top" className="shrink-0">
          <Image
            src="/logo-marque.png"
            alt="Resto Action"
            width={1012}
            height={128}
            priority
            className="h-9 w-auto"
          />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
          <a href="/#approche" className="hover:text-brand transition-colors">
            Notre approche
          </a>
          <a href="/#mission" className="hover:text-brand transition-colors">
            Notre mission
          </a>
          <a href="/#histoire" className="hover:text-brand transition-colors">
            Notre histoire
          </a>
          <a href="/#faq" className="hover:text-brand transition-colors">
            FAQ
          </a>
        </nav>
        <a
          href={PHONE_HREF}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-black text-white hover:bg-ink transition-colors"
        >
          <Phone className="size-4" />
          Appelle-nous
        </a>
      </div>
    </header>
  );
}
