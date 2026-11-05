import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Surtitre } from "@/components/lancement/ui";
import { QUI, VIDEO_GUILLAUME_URL, disponible } from "@/lib/contenu/grand-lancement";
import { FONDATEURS } from "@/lib/site";
import { fr } from "@/lib/format";
import type { Textes } from "@/lib/textes/fr";

/* QUI ON EST. La carte sombre « Ce en quoi on croit » d'avant, avec les deux
   cofondateurs (photo cliquable vers LinkedIn) et le Défi CEED, sous le texte
   du Grand Lancement. La vidéo de Guillaume s'affiche si son adresse est
   remplie; sinon, le bloc « Les vrais chiffres… ». La Preuve locale prendra
   cette place quand les vidéos des restos existeront. */

function IconeLinkedIn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
    </svg>
  );
}

const IMAGES = [
  { src: "/guillaume.jpg", width: 675, height: 900, lien: FONDATEURS.guillaume.linkedin, position: "object-[50%_30%]" },
  { src: "/xavier.webp", width: 512, height: 683, lien: FONDATEURS.xavier.linkedin, position: "object-[50%_65%]" },
];

export default function QuiOnEstLancement({ t }: { t: Textes }) {
  const preuveLocale = disponible({ dependDe: ["preuve-locale"] });
  const h = t.histoire;
  return (
    <section id="histoire" className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal>
            <Surtitre ton="sombre">{QUI.titre}</Surtitre>
            <h2 className="mt-6 max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
              {fr(QUI.texte)}
            </h2>
          </Reveal>

          {VIDEO_GUILLAUME_URL && (
            <Reveal>
              <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[2rem] bg-black">
                <video src={VIDEO_GUILLAUME_URL} controls playsInline preload="metadata" className="w-full" />
              </div>
            </Reveal>
          )}

          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
            <div className="grid gap-6 md:grid-cols-2">
              {h.convictions.fondateurs.map((f, i) => {
                const image = IMAGES[i];
                return (
                  <Reveal key={f.nom} delay={(i + 1) as 1 | 2}>
                    <article className="group h-full rounded-[2rem] bg-white/[0.05] p-5 ring-1 ring-white/10 lg:transition lg:duration-300 lg:hover:-translate-y-1 lg:hover:bg-white/[0.08]">
                      <a
                        href={image.lien}
                        target="_blank"
                        rel="noopener"
                        aria-label={h.linkedinDe.replace("{nom}", f.nom)}
                        className="relative block overflow-hidden rounded-2xl [-webkit-mask-image:-webkit-radial-gradient(white,black)] [isolation:isolate]"
                      >
                        <Image
                          draggable={false}
                          src={image.src}
                          alt={f.alt}
                          width={image.width}
                          height={image.height}
                          className={`aspect-[4/3] w-full object-cover ${image.position} grayscale lg:transition lg:duration-500 lg:group-hover:scale-[1.03] lg:group-hover:grayscale-0`}
                        />
                        <span className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-full bg-white text-[#0a66c2] shadow-lg transition group-hover:scale-110">
                          <IconeLinkedIn className="size-5" />
                        </span>
                      </a>
                      <p className="mt-5 font-display text-2xl font-black">{f.nom}</p>
                      <p className="text-sm text-white/60">{f.role}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={2}>
              <aside className="flex h-full flex-col rounded-[2rem] bg-white p-5 text-ink">
                <Image draggable={false} src="/ceed.jpeg" alt={h.ceed.alt} width={1086} height={1018} className="w-full rounded-2xl object-cover" />
                <p className="mt-5 font-display text-2xl font-black leading-tight">{h.ceed.titre}</p>
                <p className="mt-2 text-ink/70">{h.ceed.texte}</p>
              </aside>
            </Reveal>
          </div>

          {!preuveLocale && (
            <Reveal>
              <p className="mt-10 max-w-2xl border-l-4 border-brand pl-5 text-lg font-bold leading-snug text-white/85">
                {fr(QUI.preuveAVenir)}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
