"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  BellRing,
  Bike,
  Check,
  ChefHat,
  ClipboardList,
  Settings,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import type { Textes } from "@/lib/textes/fr";

/* LA TABLETTE DE CUISINE, EN DÉMO ANIMÉE.

   Pensée pour qu'un restaurateur la reconnaisse du premier coup d'œil : c'est
   la même logique que les tablettes Uber Eats et DoorDash qu'il a déjà sur son
   comptoir (fond foncé, colonnes de commandes, grosse alerte « Nouvelle
   commande », gros bouton vert « Accepter », choix du temps de préparation).
   Rien à réapprendre : c'est le message.

   LE SCÉNARIO, en boucle d'environ 9 s (la durée d'un onglet de la section) :
     0     la file tourne : 2 en préparation, 1 prête ;
     0,8 s une commande arrive, la grande carte s'ouvre et la cloche sonne ;
     2,6 s on choisit 15 min, on appuie sur Accepter ;
     3,6 s elle file dans « En préparation » ;
     5,2 s le livreur de la commande prête arrive ;
     6,8 s elle lui est remise, le compteur du jour monte.

   L'écran est dessiné à une taille fixe (640 × 440) puis mis à l'échelle de
   son conteneur : la mise en page reste identique du téléphone à l'écran large.
   En mouvement réduit, on montre l'état final, sans animation. */

const LARGEUR = 640;
const HAUTEUR = 440;
// [étape, moment d'arrivée en ms]
const ETAPES = [0, 800, 2600, 3600, 5200, 6800] as const;
const BOUCLE = 9000;

export default function DemoTablette({ t }: { t: Textes }) {
  const d = t.produits.tablette;
  const cadre = useRef<HTMLDivElement>(null);
  const [echelle, setEchelle] = useState(0.8);
  const [etapeAnimee, setEtape] = useState(0);
  const reduit = useMouvementReduit();

  // L'échelle suit la largeur du conteneur.
  useLayoutEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const mesurer = () => setEchelle(el.clientWidth / LARGEUR);
    mesurer();
    const obs = new ResizeObserver(mesurer);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (reduit) return;
    let minuteries: ReturnType<typeof setTimeout>[] = [];
    const lancer = () => {
      minuteries = ETAPES.map((ms, k) => setTimeout(() => setEtape(k), ms));
      minuteries.push(setTimeout(lancer, BOUCLE));
    };
    lancer();
    return () => minuteries.forEach(clearTimeout);
  }, [reduit]);

  // En mouvement réduit : l'état final, figé.
  const anime = !reduit;
  const etape = reduit ? 5 : etapeAnimee;
  const modale = anime && (etape === 1 || etape === 2);
  const accepte = etape >= 3;
  const livreur = etape >= 4;
  const remise = etape >= 5;
  const nbJour = remise ? 24 : 23;
  const montantJour = remise ? "1 286 $" : "1 240 $";
  const modeTexte = (mode: string) => (mode === "livraison" ? d.livraison : d.cueillette);

  return (
    <figure className="w-full max-w-[38rem]">
      {/* Le boîtier de la tablette */}
      <div className="rounded-[1.6rem] bg-[#0d0d0d] p-[3%] shadow-2xl ring-1 ring-white/10">
        <div
          ref={cadre}
          role="img"
          aria-label={d.alt}
          className="relative overflow-hidden rounded-[0.9rem] bg-[#141414]"
          style={{ height: HAUTEUR * echelle }}
        >
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 flex origin-top-left text-white"
            style={{ width: LARGEUR, height: HAUTEUR, transform: `scale(${echelle})` }}
          >
            {/* ─── Barre latérale ─── */}
            <nav className="flex w-[64px] shrink-0 flex-col items-center gap-5 border-r border-white/5 bg-[#0f0f0f] py-4">
              <span className="grid size-9 place-items-center rounded-xl bg-brand text-[11px] font-black">RA</span>
              {[ClipboardList, UtensilsCrossed, Settings].map((Icone, k) => (
                <span
                  key={k}
                  className={`flex flex-col items-center gap-1 text-[8px] font-bold ${k === 0 ? "text-white" : "text-white/40"}`}
                >
                  <Icone className="size-[18px]" />
                  {d.onglets[k]}
                </span>
              ))}
            </nav>

            <div className="flex min-w-0 flex-1 flex-col">
              {/* ─── En-tête ─── */}
              <header className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                <div>
                  <p className="text-[15px] font-black leading-none">{d.resto}</p>
                  <p className="mt-1 text-[10px] text-white/50">
                    {d.jour.replace("{n}", String(nbJour)).replace("{montant}", montantJour)}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-[#06c167]/15 px-3 py-1.5 text-[10px] font-black text-[#2fd885]">
                  <span className="size-1.5 rounded-full bg-[#2fd885]" />
                  {d.ouvert}
                </span>
              </header>

              {/* ─── Les trois colonnes ─── */}
              <div className="grid flex-1 grid-cols-3 gap-2.5 p-3">
                <Colonne titre={d.colonnes.nouvelles} nombre={accepte || !modale ? 0 : 1} accent="#ff3008">
                  {!accepte && etape >= 1 && (
                    <Carte numero={d.commande.numero} client={d.commande.client} mode={d.livraison} articles={`4 ${d.articles}`} vive />
                  )}
                </Colonne>

                <Colonne titre={d.colonnes.preparation} nombre={accepte ? 3 : 2} accent="#f5a524">
                  {accepte && (
                    <div className="tab-entre">
                      <Carte
                        numero={d.commande.numero}
                        client={d.commande.client}
                        mode={d.livraison}
                        articles={`4 ${d.articles}`}
                        pied={d.pretDans.replace("{n}", "15")}
                        couleurPied="#f5a524"
                      />
                    </div>
                  )}
                  {d.autres.map((o, k) => (
                    <Carte
                      key={o.numero}
                      numero={o.numero}
                      client={o.client}
                      mode={modeTexte(o.mode)}
                      articles={`${o.articles} ${d.articles}`}
                      pied={d.pretDans.replace("{n}", String(6 + k * 5))}
                      couleurPied="#f5a524"
                    />
                  ))}
                </Colonne>

                <Colonne titre={d.colonnes.pretes} nombre={remise ? 0 : 1} accent="#2fd885">
                  {!remise && (
                    <Carte
                      numero={d.prete1.numero}
                      client={d.prete1.client}
                      mode={d.livraison}
                      articles={`2 ${d.articles}`}
                      pied={livreur ? d.livreurArrive : d.prete}
                      couleurPied="#2fd885"
                      icone={livreur ? <Bike className="size-3" /> : <ChefHat className="size-3" />}
                    />
                  )}
                  {remise && (
                    <div className="tab-entre flex items-center gap-2 rounded-xl bg-[#2fd885]/10 p-2.5 text-[10px] font-bold text-[#2fd885]">
                      <Check className="size-3.5" />
                      {d.prete1.numero} · {d.remis}
                    </div>
                  )}
                </Colonne>
              </div>
            </div>

            {/* ─── L'alerte « Nouvelle commande », comme sur Uber et DoorDash ─── */}
            {modale && (
              <div className="tab-fond absolute inset-0 flex items-center justify-center bg-black/60 p-6">
                <div className="tab-entre w-[360px] overflow-hidden rounded-2xl bg-white text-ink shadow-2xl">
                  <div className="flex items-center gap-2 bg-brand px-4 py-3 text-white">
                    <BellRing className="tab-cloche size-4" />
                    <p className="text-[13px] font-black">{d.nouvelle}</p>
                    <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black">
                      {d.commande.numero}
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold text-ink/60">
                      <ShoppingBag className="size-3" />
                      {d.livraison} · {d.commande.client}
                    </p>
                    <ul className="mt-2.5 grid gap-1.5">
                      {d.commande.plats.map((p) => (
                        <li key={p.nom} className="text-[12px]">
                          <span className="font-black">{p.qte}×</span> <span className="font-bold">{p.nom}</span>
                          {p.note && <span className="block pl-5 text-[10px] text-ink/50">{p.note}</span>}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-ink/50">{d.tempsPrep}</p>
                    <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                      {[10, 15, 20].map((n) => (
                        <span
                          key={n}
                          className={`rounded-lg py-1.5 text-center text-[11px] font-black transition-colors duration-300 ${
                            n === 15 && etape === 2 ? "bg-ink text-white" : "bg-ink/[0.06]"
                          }`}
                        >
                          {n} {d.minutes}
                        </span>
                      ))}
                    </div>
                    <div
                      className={`mt-3 flex items-center justify-between rounded-xl bg-[#06c167] px-4 py-3 text-white transition-transform duration-200 ${
                        etape === 2 ? "tab-appui" : ""
                      }`}
                    >
                      <span className="text-[13px] font-black">{d.accepter}</span>
                      <span className="text-[12px] font-black">{d.commande.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}

function Colonne({
  titre,
  nombre,
  accent,
  children,
}: {
  titre: string;
  nombre: number;
  accent: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-xl bg-white/[0.03] p-2">
      <p className="flex items-center justify-between px-1 text-[10px] font-black uppercase tracking-wider text-white/60">
        {titre}
        <span className="rounded-full px-1.5 text-[10px] text-ink" style={{ background: accent }}>
          {nombre}
        </span>
      </p>
      {children}
    </section>
  );
}

function Carte({
  numero,
  client,
  mode,
  articles,
  pied,
  couleurPied,
  icone,
  vive = false,
}: {
  numero: string;
  client: string;
  mode: string;
  articles: string;
  pied?: string;
  couleurPied?: string;
  icone?: React.ReactNode;
  vive?: boolean;
}) {
  return (
    <div className={`rounded-xl bg-[#1f1f1f] p-2.5 ring-1 ${vive ? "tab-vive ring-brand" : "ring-white/5"}`}>
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-black">{numero}</p>
        <p className="text-[9px] font-bold text-white/45">{mode}</p>
      </div>
      <p className="mt-0.5 truncate text-[11px] font-bold text-white/85">{client}</p>
      <p className="text-[9px] text-white/40">{articles}</p>
      {pied && (
        <p className="mt-1.5 flex items-center gap-1 text-[9px] font-black" style={{ color: couleurPied }}>
          {icone}
          {pied}
        </p>
      )}
    </div>
  );
}

/* « Moins d'animations » demandé par le système, lu sans effet de bord. */
function useMouvementReduit(): boolean {
  return useSyncExternalStore(
    (rappel) => {
      const requete = window.matchMedia("(prefers-reduced-motion: reduce)");
      requete.addEventListener("change", rappel);
      return () => requete.removeEventListener("change", rappel);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
