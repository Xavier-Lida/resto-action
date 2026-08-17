import Image from "next/image";
import { Phone } from "lucide-react";
import { PHONE_HREF } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-bone">
      {/* Même disposition que la barre du héro : le logo à gauche, tout le
          reste groupé à droite. La nav était au milieu, entre le logo et le
          bouton — deux pages voisines n'ont pas à composer différemment. */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <a href="/#top" className="shrink-0">
          <Image
            draggable={false}
            src="/logo-marque.png"
            alt="Resto Action"
            width={1012}
            height={128}
            priority
            className="h-9 w-auto"
          />
        </a>
        <div className="ml-auto flex items-center gap-6 md:gap-8">
          <nav className="hidden items-center gap-6 text-sm font-bold md:flex lg:gap-8">
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
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-ink"
          >
            <Phone className="size-4" />
            Appelle-nous
          </a>
        </div>
      </div>
    </header>
  );
}
