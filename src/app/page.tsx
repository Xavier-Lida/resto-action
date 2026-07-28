import Image from "next/image";
import { Phone, ArrowDown } from "lucide-react";

const PHONE_DISPLAY = "819 944-4661";
const PHONE_HREF = "tel:+18199444661";

function Buoy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      <circle cx="80" cy="80" r="52" fill="#ffffff" stroke="#f1f1ef" strokeWidth="34" />
      <circle
        cx="80"
        cy="80"
        r="52"
        fill="none"
        stroke="#ff3008"
        strokeWidth="34"
        strokeDasharray="40.84 40.84"
      />
      <circle cx="80" cy="80" r="69" fill="none" stroke="#191919" strokeWidth="5" />
      <circle cx="80" cy="80" r="35" fill="#ffffff" stroke="#191919" strokeWidth="5" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* ─── Nav ─── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-bone">
        <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
          <a href="#top" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="Resto Action"
              width={180}
              height={48}
              priority
              className="h-9 w-auto"
            />
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            <a href="#mission" className="hover:text-brand transition-colors">
              Notre mission
            </a>
            <a href="#histoire" className="hover:text-brand transition-colors">
              Notre histoire
            </a>
            <a href="#contact" className="hover:text-brand transition-colors">
              Contact
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

      {/* ─── Héro — le pitch ─── */}
      <section id="top" className="relative overflow-hidden">
        <Buoy className="pointer-events-none absolute -right-24 -top-24 w-[420px] opacity-[0.07] rotate-12" />
        <div className="mx-auto max-w-6xl px-5 pt-20 pb-24 md:pt-28 md:pb-32">
          <p className="mb-6 inline-block rounded-full bg-bone px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            Pour les restaurateurs québécois
          </p>
          <h1 className="max-w-4xl text-5xl md:text-7xl font-black leading-[1.04] tracking-tight">
            Pas normal que ceux qui cuisinent soient{" "}
            <span className="text-brand">ceux qui restent pauvres.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/75">
            Des restaurateurs d&apos;ici travaillent 70 heures par semaine
            pendant que des firmes américaines prennent la plus grosse part de
            chaque commande. Chez Resto Action, on part d&apos;une conviction
            simple :{" "}
            <strong className="text-ink">
              le fruit de leur travail doit leur revenir — pour le bien
              collectif.
            </strong>
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-base font-black text-white hover:bg-ink transition-colors"
            >
              <Phone className="size-5" />
              Appelle-nous pour découvrir ta solution
            </a>
            <a
              href="#mission"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-7 py-4 text-base font-black hover:bg-ink hover:text-white transition-colors"
            >
              Notre mission
              <ArrowDown className="size-5" />
            </a>
          </div>
          <p className="mt-6 text-sm text-ink/60">{PHONE_DISPLAY} · Québec</p>
        </div>
      </section>

      {/* ─── Notre mission ─── */}
      <section id="mission" className="relative overflow-hidden bg-ink text-white">
        <Image
          src="/resto-ferme.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/85" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="text-xs font-black uppercase tracking-widest text-brand">
            Notre mission
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Pensez au dernier resto indépendant où vous avez mangé.
          </h2>

          <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-white/80">
            <p>
              Le proprio, il se lève à 5 heures pour recevoir ses livraisons.
              Il connaît le nom de ses habitués. Sa recette, c&apos;est
              peut-être celle de sa mère. Lui, il travaille 70 heures par
              semaine pour se garder 3 à 9 % de marge.
            </p>
            <p>
              Pis pendant ce temps-là, une firme américaine qui n&apos;a jamais
              mis les pieds dans sa cuisine prend{" "}
              <strong className="text-white">30 % de chaque commande</strong> —
              trois fois plus que lui, sur le fruit de son travail. Et en plus,
              elle garde les données de ses clients : les noms, les numéros,
              les habitudes. Lui, il reçoit juste un ticket.
            </p>
            <p>
              Si rien ne change, ces restos-là ferment un par un — pis on perd
              notre variété au profit des multinationales. Dans 10 ans, il va
              rester quoi?{" "}
              <strong className="text-white">
                Des chaînes pis des franchises.
              </strong>
            </p>
            <p className="border-l-4 border-brand pl-5 text-xl md:text-2xl font-black leading-snug text-white">
              Nous, on refuse ça. Notre mission : que le fruit du travail des
              restaurateurs québécois leur revienne — pour le bien collectif.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Notre histoire ─── */}
      <section id="histoire" className="bg-bone">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="text-xs font-black uppercase tracking-widest text-brand">
            Notre histoire
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Un resto qui ferme, c&apos;est un morceau de nos vies qui part
            avec.
          </h2>

          <div className="mt-10 grid gap-12 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink/75">
              <p>
                Chaque anniversaire de la famille de Guillaume se fêtait au
                même restaurant. Même table, même propriétaire qui les
                accueillait par leur prénom. En 2020, le restaurant a fermé —
                comme des centaines d&apos;autres au Québec. Ce jour-là,
                Guillaume a compris qu&apos;un resto qui ferme, c&apos;est pas
                juste un commerce qui disparaît :{" "}
                <strong className="text-ink">
                  c&apos;est un morceau de nos vies qui part avec.
                </strong>
              </p>
              <p>
                Justin, lui, l&apos;a vécu de l&apos;intérieur. En travaillant
                en restauration, il a vu à quel point les marges sont minces —
                chaque perte compte, chaque dollar donné à un intermédiaire
                fait mal.
              </p>
              <p>
                Leurs chemins se sont croisés à l&apos;École
                d&apos;entrepreneurship de Beauce. Guillaume a présenté son
                idée; Justin a embarqué sur-le-champ. Ils ont gagné le
                concours. Mais la vraie victoire, ç&apos;a été la décision
                prise ce soir-là :{" "}
                <strong className="text-ink">
                  arrêter d&apos;en parler, pis agir.
                </strong>
              </p>
              <p className="border-l-4 border-brand pl-5 text-xl md:text-2xl font-black leading-snug text-ink">
                Aujourd&apos;hui, Resto Action existe pour une seule raison :
                sauver les restaurants indépendants du Québec, pour le bien de
                tout le monde. Parce que le fruit de leur travail doit leur
                revenir — pour le bien collectif.
              </p>
            </div>

            <div className="flex flex-row gap-6 md:flex-col md:w-52">
              {[
                { src: "/guillaume.jpg", name: "Guillaume" },
                { src: "/justin.jpg", name: "Justin" },
              ].map(({ src, name }) => (
                <figure key={name} className="flex-1 md:flex-none">
                  <div className="overflow-hidden rounded-2xl shadow-sm">
                    <Image
                      src={src}
                      alt={name}
                      width={675}
                      height={900}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-2 text-center font-script text-3xl text-ink">
                    {name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA final / Contact ─── */}
      <section id="contact" className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 text-center">
          <Buoy className="mx-auto mb-8 w-24" />
          <h2 className="mx-auto max-w-2xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Appelle-nous pour découvrir ta solution.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
            Un appel de 15 minutes suffit pour voir ce que Resto Action peut
            faire pour ton resto — et combien les commissions te coûtent
            vraiment.
          </p>
          <a
            href={PHONE_HREF}
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-black text-ink hover:bg-ink hover:text-white transition-colors"
          >
            <Phone className="size-5" />
            {PHONE_DISPLAY}
          </a>
          <p className="mt-4 text-sm text-white/70">
            Guillaume Therrien · Resto Action
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-ink text-white/60">
        <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <p>
            © {new Date().getFullYear()} Resto Action — un produit de Studio LT,
            Trois-Rivières, Québec.
          </p>
          <a href={PHONE_HREF} className="font-bold hover:text-white transition-colors">
            {PHONE_DISPLAY}
          </a>
        </div>
      </footer>
    </main>
  );
}
