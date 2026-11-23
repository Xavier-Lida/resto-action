"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import { Camera, Check, Copy, Download, ImageUp, Phone } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import BoutonAppel from "@/components/lancement/BoutonAppel";
import CurseurAvantApres from "@/components/studio/CurseurAvantApres";
import { lienAppel, lienReservation } from "@/lib/contenu/grand-lancement";
import { STUDIO_TEXTES as T, type RaisonRefus } from "@/lib/contenu/studio";
import { fr } from "@/lib/format";
import { garderContact, lieuGarde, mesurerLead, nouvelIdLead, usePreremplir } from "@/lib/leads/client";
import { lireProvenance } from "@/lib/provenance";
import { STUDIO } from "@/lib/site";
import { dixChiffres, formaterTelephone } from "@/lib/telephone";

/* LE STUDIO PHOTO (/studio) : UN ÉCRAN À LA FOIS, UNE ACTION PAR ÉCRAN.

     « depart »    : le nom du resto, la ville, la photo. Un bouton.
     « attente »   : la barre de progression et 2 questions facultatives.
     « refus »     : le premier contrôle n'a pas voulu de la photo. Un bouton.
     « resultat »  : l'avant et l'après (aperçu réduit), les 2 mentions, puis
                     le formulaire. Un bouton : « Envoie-moi mes photos ».
     « livraison » : les 2 formats, la publication, « Fais-en 4 autres », et
                     SEULEMENT ICI la suite : le bloc, la ligne de la mise en
                     service et les 2 boutons. Jamais à côté du formulaire.

   AUCUN BOUTON N'EST JAMAIS ÉTEINT : s'il manque quelque chose, on le dit à
   côté du champ. Pas de compte à rebours ni de compteur de places.

   La photo part du navigateur directement vers le magasin privé; le reste se
   passe sur le serveur (src/lib/studio/). Rien de secret ici : ni clé, ni
   consigne. Textes : src/lib/contenu/studio.ts. `ligneMise` vient du serveur
   (miseEnService()) : vide dès le 19 décembre, et la ligne disparaît. */

const champ =
  "mt-1 w-full rounded-xl border-2 border-bone bg-white px-3.5 py-3 text-base font-bold outline-none transition-colors focus:border-brand";
const etiquette = "block text-sm font-bold text-ink/70";
const carte = "rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-8";
const boutonRouge =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none";
const boutonSecondaire =
  "inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink px-6 py-3 text-base font-black text-ink transition hover:bg-ink hover:text-white";

type Ecran = "depart" | "attente" | "refus" | "resultat" | "livraison";
type EtapeAttente = keyof typeof T.etapes;
type Travail = { id: string; jeton: string };

/** Où en est la barre à chaque étape (en %). Elle avance doucement vers l'étape suivante. */
const CIBLES: Record<EtapeAttente, number> = { envoi: 4, reception: 18, controle: 30, retouche: 46, verification: 78, formats: 92 };
const ORDRE: EtapeAttente[] = ["envoi", "reception", "controle", "retouche", "verification", "formats"];

const TYPES: Record<string, "jpg" | "png" | "heic"> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heic",
};

/** L'extension qu'on enverra, ou null si le format ne passe pas. Un HEIC arrive parfois sans type. */
function extensionDe(fichier: File): "jpg" | "png" | "heic" | null {
  if (TYPES[fichier.type]) return TYPES[fichier.type];
  const nom = fichier.name.toLowerCase();
  if (/\.(heic|heif)$/.test(nom)) return "heic";
  if (/\.jpe?g$/.test(nom)) return "jpg";
  if (/\.png$/.test(nom)) return "png";
  return null;
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Manque({ id, children }: { id: string; children: ReactNode }) {
  return children ? (
    <p id={id} role="alert" className="mt-1.5 text-sm font-bold text-brand">
      {children}
    </p>
  ) : null;
}

function Pastille({ actif, onClick, children }: { actif: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={`rounded-full px-4 py-2.5 text-sm font-black transition ${actif ? "bg-brand text-white" : "bg-bone text-ink hover:bg-ink hover:text-white"}`}
    >
      {children}
    </button>
  );
}

export default function Studio({ ligneMise, pret }: { ligneMise: string; pret: boolean }) {
  const id = useId();
  const [ecran, setEcran] = useState<Ecran>("depart");

  // Le départ.
  const [resto, setResto] = useState("");
  const [ville, setVille] = useState("");
  const [fichier, setFichier] = useState<File | null>(null);
  const [piege, setPiege] = useState("");
  const [manques, setManques] = useState<{ resto?: string; ville?: string; photo?: string }>({});
  const [panne, setPanne] = useState("");

  // L'attente.
  const [etape, setEtape] = useState<EtapeAttente>("envoi");
  const [progression, setProgression] = useState(0);
  const [plateformes, setPlateformes] = useState<string[]>([]);
  const [commandes, setCommandes] = useState("");

  // Le résultat.
  const [travail, setTravail] = useState<Travail | null>(null);
  const [refus, setRefus] = useState<RaisonRefus>("illisible");
  const [repli, setRepli] = useState(false);

  // Le formulaire.
  const [prenom, setPrenom] = useState("");
  const [cellulaire, setCellulaire] = useState("");
  const [textos, setTextos] = useState(false);
  const [exemple, setExemple] = useState(false);
  const [manquesF, setManquesF] = useState<{ prenom?: string; cellulaire?: string; textos?: string }>({});
  const [envoi, setEnvoi] = useState(false);
  const [panneF, setPanneF] = useState("");

  // La livraison.
  const [publication, setPublication] = useState("");
  const [restantes, setRestantes] = useState(0);
  const [copie, setCopie] = useState(false);
  /** La photo précédente, déjà suivie du formulaire : c'est elle qui porte le cellulaire pour « Fais-en 4 autres ». */
  const [suite, setSuite] = useState<Travail | null>(null);

  const garde = usePreremplir((g) => {
    setResto((v) => v || g.resto || "");
    setVille((v) => v || g.ville || "");
    setPrenom((v) => v || g.prenom || "");
    setCellulaire((v) => v || g.cellulaire || "");
  });

  const vivant = useRef(true);
  const occupe = useRef(false);
  const idLead = useRef("");
  const choisir = useRef<HTMLInputElement>(null);
  const prendre = useRef<HTMLInputElement>(null);
  const haut = useRef<HTMLDivElement>(null);
  useEffect(() => {
    vivant.current = true;
    return () => {
      vivant.current = false;
    };
  }, []);

  function aller(suivant: Ecran) {
    setEcran(suivant);
    // Chaque écran commence en haut : sur un cell, on ne doit pas arriver au milieu.
    requestAnimationFrame(() => haut.current?.scrollIntoView({ block: "start" }));
  }

  function recevoirFichier(f: File | undefined) {
    if (!f) return;
    if (!extensionDe(f)) return setManques((m) => ({ ...m, photo: T.manque.format }));
    if (f.size > STUDIO.tailleMaxMo * 1024 * 1024) return setManques((m) => ({ ...m, photo: T.manque.taille }));
    setFichier(f);
    setManques((m) => ({ ...m, photo: undefined }));
  }

  async function lire<R>(reponse: Response): Promise<R & { erreur?: string }> {
    try {
      return (await reponse.json()) as R & { erreur?: string };
    } catch {
      return { erreur: "panne" } as R & { erreur?: string };
    }
  }

  function messagePanne(code: string | undefined, statut: number): string {
    if (code === "trop") return T.erreurs.trop;
    if (code === "limite") return T.erreurs.limite;
    if (statut === 404) return T.erreurs.indisponible;
    return T.erreurs.panne;
  }

  // ─── Le départ : la photo part, la retouche se lance, on suit où elle en est ───
  async function retoucher(e: FormEvent) {
    e.preventDefault();
    if (occupe.current) return;
    const m = {
      resto: resto.trim() ? undefined : T.manque.resto,
      ville: ville.trim() ? undefined : T.manque.ville,
      photo: fichier ? undefined : T.manque.photo,
    };
    setManques(m);
    setPanne("");
    if (m.resto || m.ville || m.photo || !fichier) return;
    if (!pret) return setPanne(T.erreurs.indisponible);

    occupe.current = true;
    setEtape("envoi");
    setProgression(0);
    aller("attente");

    // La barre avance doucement vers l'étape suivante : elle ne reste jamais figée.
    let cible = CIBLES.reception;
    const avance = window.setInterval(() => {
      setProgression((p) => (p < cible - 1 ? p + Math.max(0.15, (cible - p) / 40) : p));
    }, 250);
    const etapeRecue = (suivante: EtapeAttente) => {
      const i = ORDRE.indexOf(suivante);
      cible = i + 1 < ORDRE.length ? CIBLES[ORDRE[i + 1]] : 99;
      setEtape(suivante);
      setProgression((p) => Math.max(p, CIBLES[suivante]));
    };
    const echouer = (message: string) => {
      setPanne(message);
      aller("depart");
    };

    try {
      const extension = extensionDe(fichier) ?? "jpg";
      const depose = await upload(`studio/televersements/photo.${extension}`, fichier, {
        access: "private",
        handleUploadUrl: "/api/studio/televersement",
        contentType: extension === "jpg" ? "image/jpeg" : extension === "png" ? "image/png" : "image/heic",
        onUploadProgress: ({ percentage }) => setProgression((p) => Math.max(p, (percentage / 100) * CIBLES.reception)),
      });
      if (!vivant.current) return;
      etapeRecue("reception");

      const depart = await fetch("/api/studio/retouche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chemin: depose.pathname, resto: resto.trim(), ville: ville.trim(), piege, suite }),
      });
      const lance = await lire<Travail>(depart);
      if (!depart.ok || !lance.id) return echouer(messagePanne(lance.erreur, depart.status));
      const t: Travail = { id: lance.id, jeton: lance.jeton };
      idLead.current = nouvelIdLead();

      type Etat = {
        etat: "en-cours" | "pret" | "refusee" | "erreur";
        etape: EtapeAttente;
        refus: RaisonRefus | null;
        repli: boolean;
        contact: boolean;
        publication: string | null;
        restantes: number | null;
      };
      const limite = Date.now() + 5 * 60_000;
      let rates = 0;
      while (vivant.current && Date.now() < limite) {
        await pause(2000);
        let etat: Etat & { erreur?: string };
        try {
          const r = await fetch(`/api/studio/retouche?id=${t.id}&jeton=${t.jeton}`, { cache: "no-store" });
          etat = await lire<Etat>(r);
          if (!r.ok) throw new Error("etat");
        } catch {
          // Un tunnel, un écran verrouillé : on redemande, quelques fois.
          if (++rates > 8) break;
          continue;
        }
        rates = 0;
        if (etat.etat === "en-cours") {
          if (ORDRE.indexOf(etat.etape) > 0) etapeRecue(etat.etape);
          continue;
        }
        if (etat.etat === "refusee") {
          setRefus(etat.refus ?? "illisible");
          setFichier(null);
          return aller("refus");
        }
        if (etat.etat === "pret") {
          setProgression(100);
          setTravail(t);
          setRepli(etat.repli);
          setManquesF({});
          setPanneF("");
          if (etat.contact) {
            // « Fais-en 4 autres » : le formulaire est déjà rempli, les formats sont là.
            setPublication(etat.publication ?? "");
            setRestantes(etat.restantes ?? 0);
            setSuite(t);
            return aller("livraison");
          }
          return aller("resultat");
        }
        break;
      }
      if (vivant.current) echouer(T.erreurs.panne);
    } catch {
      if (vivant.current) echouer(T.erreurs.panne);
    } finally {
      window.clearInterval(avance);
      occupe.current = false;
    }
  }

  // ─── Le formulaire : « Envoie-moi mes photos » ───
  async function envoyer(e: FormEvent) {
    e.preventDefault();
    if (envoi || !travail) return;
    const m = {
      prenom: prenom.trim() ? undefined : T.manque.prenom,
      cellulaire: dixChiffres(cellulaire) ? undefined : T.manque.cellulaire,
      textos: textos ? undefined : T.manque.textos,
    };
    setManquesF(m);
    setPanneF("");
    if (m.prenom || m.cellulaire || m.textos) return;

    setEnvoi(true);
    try {
      const r = await fetch("/api/studio/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...travail,
          idLead: idLead.current,
          prenom: prenom.trim(),
          cellulaire,
          consentementTextos: textos,
          consentementExemple: exemple,
          plateformes,
          commandes,
          placeId: lieuGarde(garde, resto),
          provenance: lireProvenance() ?? undefined,
          piege,
        }),
      });
      const d = await lire<{ ok: boolean; publication: string; restantes: number }>(r);
      if (!r.ok || !d.ok) {
        if (d.erreur === "prenom") setManquesF({ prenom: T.manque.prenom });
        else if (d.erreur === "cellulaire") setManquesF({ cellulaire: T.manque.cellulaire });
        else if (d.erreur === "consentement") setManquesF({ textos: T.manque.textos });
        else setPanneF(messagePanne(d.erreur, r.status));
        return;
      }
      setPublication(d.publication);
      setRestantes(d.restantes);
      setSuite(travail);
      garderContact({ prenom: prenom.trim(), resto: resto.trim(), ville: ville.trim(), cellulaire });
      mesurerLead("studio");
      aller("livraison");
    } catch {
      setPanneF(T.erreurs.panne);
    } finally {
      setEnvoi(false);
    }
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(publication);
      setCopie(true);
      window.setTimeout(() => vivant.current && setCopie(false), 2500);
    } catch {
      // Presse-papiers refusé : le texte reste à l'écran, à sélectionner à la main.
    }
  }

  function recommencer() {
    setFichier(null);
    setManques({});
    setPanne("");
    setTravail(null);
    aller("depart");
  }

  const image = (vue: string, telecharger = false) =>
    travail ? `/api/studio/image?id=${travail.id}&jeton=${travail.jeton}&vue=${vue}${telecharger ? "&telecharger=1" : ""}` : "";

  return (
    <section className="bg-white px-3 pt-3 md:px-5 md:pt-5 lg:px-6 lg:pt-6">
      <div ref={haut} className="scroll-mt-24 rounded-[2rem] bg-bone px-4 py-12 md:px-5 md:py-20 lg:rounded-[3rem]">
        <div className="mx-auto max-w-2xl">
          {/* ─── A. LE DÉPART ─── */}
          {ecran === "depart" && (
            <>
              <h1 className="text-center font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">{fr(T.titre)}</h1>
              <p className="mx-auto mt-4 max-w-xl text-center text-lg text-ink/70">{fr(T.sousTitre)}</p>

              <form onSubmit={retoucher} noValidate className={`relative mt-8 ${carte}`}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={etiquette}>
                    {T.champs.resto}
                    <input
                      className={champ}
                      type="text"
                      autoComplete="organization"
                      value={resto}
                      onChange={(e) => setResto(e.target.value)}
                      aria-invalid={Boolean(manques.resto)}
                      aria-describedby={manques.resto ? `${id}-resto` : undefined}
                    />
                    <Manque id={`${id}-resto`}>{manques.resto}</Manque>
                  </label>
                  <label className={etiquette}>
                    {T.champs.ville}
                    <input
                      className={champ}
                      type="text"
                      autoComplete="address-level2"
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      aria-invalid={Boolean(manques.ville)}
                      aria-describedby={manques.ville ? `${id}-ville` : undefined}
                    />
                    <Manque id={`${id}-ville`}>{manques.ville}</Manque>
                  </label>
                </div>
                <input type="text" name="site" value={piege} onChange={(e) => setPiege(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" className="absolute left-[-9999px] size-px opacity-0" />

                {/* La photo : la choisir, ou la prendre avec son cell. */}
                <input
                  ref={choisir}
                  type="file"
                  accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(e) => {
                    recevoirFichier(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <input
                  ref={prendre}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(e) => {
                    recevoirFichier(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <div className="mt-5 rounded-2xl border-2 border-dashed border-ink/15 p-4">
                  {fichier ? (
                    <p className="flex items-center gap-2 font-bold">
                      <Check className="size-5 shrink-0 text-brand" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">{fichier.name}</span>
                      <button type="button" onClick={() => choisir.current?.click()} className="shrink-0 text-sm font-bold text-ink/70 underline underline-offset-4 hover:text-brand">
                        {T.changerPhoto}
                      </button>
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => choisir.current?.click()} className={boutonSecondaire}>
                        <ImageUp className="size-5" aria-hidden="true" />
                        {T.boutonChoisir}
                      </button>
                      <button type="button" onClick={() => prendre.current?.click()} className={boutonSecondaire}>
                        <Camera className="size-5" aria-hidden="true" />
                        {T.boutonPrendre}
                      </button>
                    </div>
                  )}
                  <p className="mt-3 text-sm font-bold text-ink">{fr(T.conseil)}</p>
                  <p className="mt-1 text-sm text-ink/60">{fr(T.formatsAcceptes)}</p>
                  <Manque id={`${id}-photo`}>{manques.photo}</Manque>
                </div>

                {panne && (
                  <p role="alert" className="mt-4 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
                    {fr(panne)}
                  </p>
                )}
                <button type="submit" className={`mt-5 ${boutonRouge}`}>
                  {T.boutonRetoucher}
                </button>
              </form>
            </>
          )}

          {/* ─── C1. L'ATTENTE ─── */}
          {ecran === "attente" && (
            <div className={carte}>
              <h2 className="font-display text-xl font-black md:text-2xl" aria-live="polite">
                {T.etapes[etape]}
              </h2>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progression)}
                className="mt-5 h-3 overflow-hidden rounded-full bg-bone"
              >
                <div className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out" style={{ width: `${progression}%` }} />
              </div>

              <p className="mt-8 text-sm text-ink/60">{T.facultatif}</p>
              <p id={`${id}-q1`} className="mt-3 font-display text-lg font-black">{fr(T.questionPlateformes)}</p>
              <div role="group" aria-labelledby={`${id}-q1`} className="mt-3 flex flex-wrap gap-2">
                {T.listePlateformes.map((p, i) => {
                  const aucune = i === T.listePlateformes.length - 1;
                  const actif = plateformes.includes(p);
                  return (
                    <Pastille
                      key={p}
                      actif={actif}
                      onClick={() =>
                        setPlateformes((liste) =>
                          aucune
                            ? actif ? [] : [p]
                            : actif
                              ? liste.filter((x) => x !== p)
                              : [...liste.filter((x) => x !== T.listePlateformes.at(-1)), p],
                        )
                      }
                    >
                      {p}
                    </Pastille>
                  );
                })}
              </div>
              <p id={`${id}-q2`} className="mt-6 font-display text-lg font-black">{fr(T.questionCommandes)}</p>
              <div role="group" aria-labelledby={`${id}-q2`} className="mt-3 flex flex-wrap gap-2">
                {T.listeCommandes.map((c) => (
                  <Pastille key={c} actif={commandes === c} onClick={() => setCommandes((v) => (v === c ? "" : c))}>
                    {c}
                  </Pastille>
                ))}
              </div>
            </div>
          )}

          {/* ─── Le premier contrôle n'a pas voulu de la photo ─── */}
          {ecran === "refus" && (
            <div className={carte}>
              <p role="status" className="font-display text-xl font-black leading-snug md:text-2xl">{fr(T.refus[refus])}</p>
              <button type="button" onClick={recommencer} className={`mt-6 ${boutonRouge}`}>
                {T.boutonAutrePhoto}
              </button>
            </div>
          )}

          {/* ─── C2 à C4. LE RÉSULTAT, PUIS LE FORMULAIRE ─── */}
          {ecran === "resultat" && travail && (
            <>
              <CurseurAvantApres avant={image("avant")} apres={image("apres")} libelles={{ avant: T.avant, apres: T.apres, curseur: T.curseur }} />
              {repli && <p className="mt-5 rounded-2xl bg-white px-5 py-4 font-bold">{fr(T.messageRepli)}</p>}
              <p className="mt-5 text-sm leading-relaxed text-ink/80">{fr(T.mentionIA)}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{fr(T.mentionUsage)}</p>

              <form onSubmit={envoyer} noValidate className={`relative mt-8 ${carte}`}>
                <h2 className="font-display text-xl font-black md:text-2xl">{fr(T.formulaireTitre)}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <label className={etiquette}>
                    {T.champs.prenom}
                    <input
                      className={champ}
                      type="text"
                      autoComplete="given-name"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      aria-invalid={Boolean(manquesF.prenom)}
                      aria-describedby={manquesF.prenom ? `${id}-prenom` : undefined}
                    />
                    <Manque id={`${id}-prenom`}>{manquesF.prenom}</Manque>
                  </label>
                  <label className={etiquette}>
                    {T.champs.cellulaire}
                    <input
                      className={champ}
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={cellulaire}
                      onChange={(e) => setCellulaire(formaterTelephone(e.target.value))}
                      aria-invalid={Boolean(manquesF.cellulaire)}
                      aria-describedby={manquesF.cellulaire ? `${id}-cell` : undefined}
                    />
                    <Manque id={`${id}-cell`}>{manquesF.cellulaire}</Manque>
                  </label>
                </div>
                {/* La case des textos est obligatoire : sans elle, le formulaire ne part pas, et il le dit ici. */}
                <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                  <input
                    type="checkbox"
                    checked={textos}
                    onChange={(e) => setTextos(e.target.checked)}
                    aria-invalid={Boolean(manquesF.textos)}
                    aria-describedby={manquesF.textos ? `${id}-textos` : undefined}
                    className="mt-0.5 size-5 shrink-0 accent-brand"
                  />
                  <span>{fr(T.consentementTextos)}</span>
                </label>
                <div className="pl-8">
                  <Manque id={`${id}-textos`}>{manquesF.textos}</Manque>
                </div>
                {/* La 2e case : facultative, jamais cochée d'avance. */}
                <label className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                  <input type="checkbox" checked={exemple} onChange={(e) => setExemple(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-brand" />
                  <span>{fr(T.consentementExemple)}</span>
                </label>
                <p className="mt-2 pl-8 text-sm">
                  <Link href={T.lienConfidentialite.href} className="font-bold text-ink/70 underline underline-offset-4 hover:text-brand">
                    {T.lienConfidentialite.label}
                  </Link>
                </p>
                {panneF && (
                  <p role="alert" className="mt-4 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
                    {fr(panneF)}
                  </p>
                )}
                <button type="submit" aria-busy={envoi} className={`mt-5 ${boutonRouge}`}>
                  {T.boutonEnvoyer}
                </button>
              </form>
            </>
          )}

          {/* ─── C5 et D. LA LIVRAISON, PUIS LA SUITE ─── */}
          {ecran === "livraison" && travail && (
            <>
              <div className={carte}>
                <h2 className="font-display text-xl font-black md:text-2xl">{fr(T.livraisonTitre.replace("{prenom}", prenom.trim()))}</h2>
                {repli && <p className="mt-4 rounded-2xl bg-bone px-5 py-4 text-sm font-bold">{fr(T.messageRepli)}</p>}
                {/* L'avant et l'après restent ici : pour les photos 2 à 5, on arrive directement à cet écran. */}
                <div className="mt-5">
                  <CurseurAvantApres avant={image("avant")} apres={image("apres")} libelles={{ avant: T.avant, apres: T.apres, curseur: T.curseur }} />
                </div>
                <div className="mt-5 grid grid-cols-2 items-start gap-3">
                  {(["carre", "vertical"] as const).map((vue) => (
                    <a key={vue} href={image(vue, true)} download={`resto-action-${vue}.jpg`} className="group block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image(vue)} alt="" className={`block w-full rounded-2xl bg-bone ${vue === "carre" ? "aspect-square" : "aspect-[4/5]"}`} />
                      <span className="mt-2 flex items-center gap-1.5 text-sm font-black underline-offset-4 group-hover:underline">
                        <Download className="size-4 shrink-0" aria-hidden="true" />
                        {T.telecharger[vue]}
                      </span>
                    </a>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-ink/80">{fr(T.mentionIA)}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{fr(T.mentionUsage)}</p>

                {publication && (
                  <>
                    <h3 className="mt-7 font-display text-lg font-black">{T.publicationTitre}</h3>
                    <p className="mt-3 whitespace-pre-line rounded-2xl bg-bone px-5 py-4 leading-relaxed">{publication}</p>
                    <button type="button" onClick={copier} className={`mt-3 ${boutonSecondaire}`}>
                      {copie ? <Check className="size-5" aria-hidden="true" /> : <Copy className="size-5" aria-hidden="true" />}
                      <span aria-live="polite">{copie ? T.copie : T.copier}</span>
                    </button>
                  </>
                )}

                {restantes > 0 ? (
                  <button type="button" onClick={recommencer} className={`mt-6 ${boutonRouge}`}>
                    {T.boutonAutres(restantes)}
                  </button>
                ) : (
                  <p className="mt-6 font-bold">{fr(T.limiteAtteinte)}</p>
                )}
              </div>

              {/* D. La suite : seulement ici, après l'envoi du formulaire. */}
              <div className={`mt-6 ${carte}`}>
                <p className="font-display text-xl font-black leading-snug md:text-2xl">{fr(T.suite)}</p>
                {ligneMise && (
                  <p className="mt-5 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-black text-brand">{fr(ligneMise)}</p>
                )}
                <div className="mt-6 flex flex-col gap-4">
                  <BoutonReserver href={lienReservation()} libelle={T.boutonReserver} taille="md" className="w-full text-ink [&>a]:w-full [&>a>span:first-child]:text-center" />
                  <BoutonAppel href={lienAppel()} ou="studio" className="w-full">
                    <Phone className="size-4" aria-hidden="true" />
                    {T.boutonAppel}
                  </BoutonAppel>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
