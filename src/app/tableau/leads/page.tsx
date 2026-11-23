import type { Metadata } from "next";
import { MessageSquare, Phone } from "lucide-react";
import { retirerLead, suivreLead } from "@/app/tableau/leads/actions";
import { ordinal } from "@/lib/classement";
import { TEXTO_SUIVI_CLASSEMENT } from "@/lib/contenu/classement";
import { TEXTO_SUIVI_STUDIO } from "@/lib/contenu/studio";
import { TEXTOS_LEADS } from "@/lib/contenu/leads";
import { argent, fr, pourcent } from "@/lib/format";
import { carnetPret, tousLesLeads } from "@/lib/mini-crm/carnet";
import { LIBELLES_STATUT, remplir, STATUTS, type LeadMini, type Statut } from "@/lib/mini-crm/fiche";
import { STUDIO } from "@/lib/site";
import { dixChiffres } from "@/lib/telephone";

/* LE MINI CRM (/tableau/leads, 23 nov. 2026) : le suivi des contacts laissés
   au Studio Photo, à « Ton rang sur Google » et au Calcul 60 secondes.

   Pour chaque resto : qui, son cellulaire, ses 2 réponses, ses photos, son rang
   sur Google s'il l'a demandé, son calcul et son dossier s'il l'a demandé, où
   on en est (statut), une note, et ce qui s'est
   passé. Deux boutons pour agir :
   TEXTER (le texto est déjà écrit, il s'ouvre dans l'app Messages de celui qui
   lit : rien ne part tout seul) et APPELER.

   PROTÉGÉ par src/proxy.ts, comme tout /tableau (TABLEAU_MDP). Hors du plan du
   site, fermé aux robots. Les fiches vivent dans le magasin privé
   (src/lib/mini-crm/carnet.ts). Pensé pour un cellulaire d'abord. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mini CRM : les contacts du site",
  robots: { index: false, follow: false },
};

const quand = (iso: string) =>
  new Date(iso).toLocaleString("fr-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" });

const TONS: Record<Statut, string> = {
  nouveau: "bg-brand text-white",
  contacte: "bg-yellow-200 text-ink",
  "rendez-vous": "bg-ink text-white",
  client: "bg-green-200 text-ink",
  "pas-interesse": "bg-bone text-ink/60",
};

const champ = "mt-1 w-full rounded-xl border-2 border-bone bg-white px-3 py-2.5 text-base font-bold outline-none focus:border-brand";
const boutonAction =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-black transition";

function Contact({ lead }: { lead: LeadMini }) {
  const dix = dixChiffres(lead.cellulaire);
  const c = lead.classement;
  const rangConnu = c && c.rang !== null && c.total !== null;
  /* Le gabarit de Guillaume s'il l'a écrit, sinon le texte proposé (à relire).
     Un resto arrivé par « Ton rang sur Google » reçoit le texto de son
     classement. Sans rang gardé, le texto s'ouvre vide : on n'écrit pas une
     phrase trouée. */
  const k = lead.calcul;
  /* Un resto arrivé par le Calcul 60 secondes reçoit le texto de son dossier,
     avec le lien de sa page ({lien}). */
  const textoDossier = k ? remplir(TEXTOS_LEADS["calcul-60"], lead, { lien: k.lienDossier }) : "";
  const texto =
    lead.source === "calcul-60"
      ? textoDossier
      : lead.source === "classement"
        ? rangConnu
          ? remplir(TEXTOS_LEADS.classement || TEXTO_SUIVI_CLASSEMENT, lead, {
              rang: ordinal(c.rang as number),
              total: String(c.total),
              type: c.type,
            })
          : ""
        : remplir(TEXTOS_LEADS.studio || TEXTO_SUIVI_STUDIO, lead);
  return (
    <li id={lead.cle} className="scroll-mt-6 rounded-[1.5rem] border border-ink/10 bg-white p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="font-display text-lg font-black">
          {lead.resto} <span className="font-sans text-sm font-bold text-ink/60">({lead.ville})</span>
        </h2>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${TONS[lead.statut]}`}>{LIBELLES_STATUT[lead.statut]}</span>
      </div>
      <p className="mt-1 text-base">
        <span className="font-black">{lead.prenom}</span> · <span className="tabular-nums">{lead.cellulaire}</span>
      </p>
      <p className="mt-1 text-sm text-ink/60">
        Arrivé le {quand(lead.creeLe)}
        {lead.photos.length > 0 && (
          <>
            {" "}
            · {lead.photos.length} photo{lead.photos.length > 1 ? "s" : ""}
          </>
        )}
        {lead.plateformes && <> · Plateformes : {lead.plateformes}</>}
        {lead.commandes && <> · Commandes par semaine : {lead.commandes}</>}
      </p>
      {c && (
        <p className="mt-1 text-sm text-ink/60">
          Rang sur Google, le {quand(c.quand)} :{" "}
          <span className="font-black text-ink">
            {rangConnu ? `${ordinal(c.rang as number)} sur ${c.total} ${c.type}` : `non gardé (${c.type})`}
          </span>
          {c.testBouton && <> · Test du bouton « Commander en ligne » : {c.testBouton}</>} ·{" "}
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${c.placeId}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold underline underline-offset-4"
          >
            Sa fiche sur <span translate="no">Google Maps</span>
          </a>
        </p>
      )}

      {k && (
        <p className="mt-1 text-sm text-ink/60">
          Calcul 60 secondes, le {quand(k.quand)} :{" "}
          <span className="font-black text-ink">{fr(`${argent(k.parAnnee)} par année`)}</span>{" "}
          {fr(`(${k.commandes} commandes par semaine, commande moyenne de ${argent(k.panier)}, ${pourcent(k.taux)} de commission, ${argent(k.parSemaine)} par semaine)`)} ·{" "}
          <a href={k.lienDossier} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-4">
            Son dossier
          </a>
          {dix && textoDossier && lead.source !== "calcul-60" && (
            <>
              {" "}
              ·{" "}
              <a href={`sms:+1${dix}?&body=${encodeURIComponent(textoDossier)}`} className="font-bold underline underline-offset-4">
                Texter son dossier
              </a>
            </>
          )}
        </p>
      )}

      {dix && (
        <div className="mt-4 flex gap-2">
          <a href={texto ? `sms:+1${dix}?&body=${encodeURIComponent(texto)}` : `sms:+1${dix}`} className={`${boutonAction} bg-brand text-white`}>
            <MessageSquare className="size-5" aria-hidden="true" />
            Texter
          </a>
          <a href={`tel:+1${dix}`} className={`${boutonAction} border-2 border-ink text-ink hover:bg-ink hover:text-white`}>
            <Phone className="size-5" aria-hidden="true" />
            Appeler
          </a>
        </div>
      )}
      <p className="mt-2 rounded-xl bg-bone px-3 py-2 text-sm text-ink/70">
        {texto ? <>Le texto qui s&apos;ouvre : « {texto} »</> : <>Le texto s&apos;ouvre vide{lead.source === "classement" ? <> : le rang n&apos;a pas été gardé</> : null}.</>}
      </p>

      {lead.photos.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {lead.photos.slice(0, STUDIO.photosParResto).map((id) => (
            <a key={id} href={`/studio/suivi#${id}`} className="block w-24 shrink-0">
              {/* Des images privées, servies par notre route protégée : pas d'optimiseur d'images ici. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/studio/suivi/image?id=${id}&vue=apres`} alt="Photo retouchée" loading="lazy" className="aspect-square w-full rounded-xl bg-bone object-cover" />
              {lead.photosExemple.includes(id) && <span className="mt-1 block text-[0.7rem] font-black text-ink/60">Exemple permis</span>}
            </a>
          ))}
        </div>
      )}

      <form action={suivreLead} className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_auto] sm:items-end">
        <input type="hidden" name="cle" value={lead.cle} />
        <label className="block text-sm font-bold text-ink/70">
          Où on en est
          <select name="statut" defaultValue={lead.statut} className={champ}>
            {STATUTS.map((s) => (
              <option key={s} value={s}>
                {LIBELLES_STATUT[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-bold text-ink/70">
          Note
          <textarea name="note" defaultValue={lead.note} rows={2} maxLength={2000} className={`${champ} font-normal`} />
        </label>
        <button type="submit" className="rounded-full bg-ink px-6 py-3 text-base font-black text-white transition hover:bg-brand">
          Enregistre
        </button>
      </form>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-bold text-ink/70">Ce qui s&apos;est passé, le consentement, supprimer</summary>
        <ul className="mt-2 space-y-1 text-ink/70">
          {lead.journal.map((j, i) => (
            <li key={i}>
              {quand(j.quand)} : {j.quoi}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-ink/70">
          Case cochée le {quand(lead.consentement.horodatage)} : « {lead.consentement.texte} »
        </p>
        <form action={retirerLead} className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-bone px-3 py-3">
          <input type="hidden" name="cle" value={lead.cle} />
          <label className="flex items-center gap-2 font-bold">
            <input type="checkbox" name="confirme" value="oui" className="size-5 accent-brand" />
            Oui, supprime ce contact
          </label>
          <button type="submit" className="rounded-full border-2 border-ink px-4 py-2 font-black transition hover:bg-ink hover:text-white">
            Supprime
          </button>
        </form>
      </details>
    </li>
  );
}

export default async function MiniCrm() {
  if (!carnetPret()) {
    return (
      <main className="mx-auto max-w-3xl p-6" lang="fr-CA">
        <h1 className="font-display text-2xl font-black">Mini CRM</h1>
        <p className="mt-4">Le magasin privé n&apos;est pas branché (BLOB_READ_WRITE_TOKEN) : aucun contact à montrer.</p>
      </main>
    );
  }

  const leads = await tousLesLeads();
  const compte = (s: Statut) => leads.filter((l) => l.statut === s).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8" lang="fr-CA">
      <h1 className="font-display text-2xl font-black md:text-3xl">Mini CRM</h1>
      <p className="mt-2 text-sm text-ink/70">
        Les restos qui ont laissé leur cellulaire au Studio Photo, à « Ton rang sur Google » ou au Calcul 60 secondes. Aucun texto ne part tout seul : c&apos;est toi qui écris.{" "}
        <a href="/studio/suivi" className="font-bold underline underline-offset-4">
          Voir les retouches
        </a>
      </p>

      <dl className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {STATUTS.map((s) => (
          <div key={s} className="rounded-2xl bg-bone px-3 py-3">
            <dt className="text-xs font-bold text-ink/60">{LIBELLES_STATUT[s]}</dt>
            <dd className="mt-1 font-display text-xl font-black tabular-nums">{compte(s)}</dd>
          </div>
        ))}
      </dl>

      {leads.length === 0 && <p className="mt-8">Aucun contact pour l&apos;instant.</p>}

      <ul className="mt-8 space-y-5">
        {leads.map((l) => (
          <Contact key={l.cle} lead={l} />
        ))}
      </ul>
    </main>
  );
}
