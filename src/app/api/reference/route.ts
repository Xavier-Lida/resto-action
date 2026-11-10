import { after, type NextRequest } from "next/server";
import { REFERENCES, REFERENCES_EN, type Profil } from "@/lib/contenu/references";
import { envoyerCourriel, type Courriel } from "@/lib/google/courriel";
import { assainirProvenance, decrireProvenance } from "@/lib/provenance";
import { PHONE_DISPLAY } from "@/lib/site";

/* UNE DEMANDE DU PROGRAMME DE RÉFÉRENCES (/references).

   Version simple, sans base de données : la demande part par courriel à
   l'équipe (GOOGLE_SUJET), et la personne reçoit un accusé de réception. Si
   le courriel à l'équipe échoue, on répond une erreur : une demande ne doit
   pas se perdre en silence. */
export const runtime = "nodejs";

const SANS_CACHE = { "Cache-Control": "no-store" };
const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PROFILS: Profil[] = ["resto", "fournisseur", "pro", "autre"];

const texte = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const refus = (code: string, statut = 400) => Response.json({ erreur: code }, { status: statut, headers: SANS_CACHE });
const echapper = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const tentatives = new Map<string, number[]>();
function tropDeTentatives(ip: string): boolean {
  const maintenant = Date.now();
  const recentes = (tentatives.get(ip) ?? []).filter((t) => maintenant - t < 10 * 60_000);
  recentes.push(maintenant);
  if (tentatives.size > 500) tentatives.clear();
  tentatives.set(ip, recentes);
  return recentes.length > 8;
}

export async function POST(requete: NextRequest): Promise<Response> {
  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return refus("invalide");
  }
  if (texte(corps.piege, 100)) return Response.json({ ok: true }, { headers: SANS_CACHE });

  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (tropDeTentatives(ip)) return refus("trop", 429);

  const d = {
    profil: (PROFILS.includes(corps.profil as Profil) ? corps.profil : "autre") as Profil,
    nom: texte(corps.nom, 120),
    entreprise: texte(corps.entreprise, 160),
    courriel: texte(corps.courriel, 160).toLowerCase(),
    telephone: texte(corps.telephone, 40),
    region: texte(corps.region, 120),
    restoEnTete: texte(corps.restoEnTete, 300),
    consentementRefere: corps.consentementRefere === true,
    consentementContact: corps.consentementContact === true,
    source: decrireProvenance(assainirProvenance(corps.provenance)),
  };
  if (!d.nom || !d.entreprise || !d.telephone || !COURRIEL.test(d.courriel) || !d.consentementContact) return refus("champs");
  // Un resto nommé exige l'affirmation qu'il veut être contacté.
  if (d.restoEnTete && !d.consentementRefere) return refus("consentement");

  const nomProfil = REFERENCES.profils.find((p) => p.id === d.profil)?.nom ?? d.profil;
  const lignes: [string, string][] = [
    ["Profil", nomProfil],
    ["Nom", d.nom],
    ["Resto ou entreprise", d.entreprise],
    ["Courriel", d.courriel],
    ["Téléphone", d.telephone],
    ["Ville ou région", d.region || "(non précisé)"],
    ["Resto en tête", d.restoEnTete || "(aucun pour l'instant)"],
    ["Le resto sait qu'on va le contacter", d.restoEnTete ? (d.consentementRefere ? "oui (affirmé par le référent)" : "non") : "s.o."],
    ["Provenance", d.source || "(directe)"],
  ];
  const equipe: Courriel = {
    a: process.env.GOOGLE_SUJET ?? "",
    sujet: `Référence : ${d.entreprise} (${nomProfil})`,
    texte: [`Nouvelle demande au programme de références (${corps.langue === "en" ? "/en/referrals, en anglais" : "/references"}).`, "", ...lignes.map(([k, v]) => `${k} : ${v}`), "", "À rappeler sous peu."].join("\n"),
    html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#191919;"><p>Nouvelle demande au programme de références${corps.langue === "en" ? " (en anglais)" : ""}.</p><table style="border-collapse:collapse;">${lignes
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:900;vertical-align:top;">${echapper(k)}</td><td style="padding:4px 0;">${echapper(v)}</td></tr>`)
      .join("")}</table><p>À rappeler sous peu.</p></div>`,
  };

  try {
    if (!equipe.a) throw new Error("GOOGLE_SUJET absent");
    await envoyerCourriel(equipe);
  } catch (erreur) {
    console.error("[reference] courriel à l'équipe refusé :", erreur instanceof Error ? erreur.message : erreur);
    return refus("envoi", 502);
  }

  // L'accusé de réception part après la réponse : la personne n'attend pas.
  const c = (corps.langue === "en" ? REFERENCES_EN : REFERENCES).courriel;
  const remplir = (v: string) => v.replace("{prenom}", d.nom.split(/\s+/)[0] ?? "").replace("{tel}", PHONE_DISPLAY);
  after(async () => {
    try {
      await envoyerCourriel({
        a: d.courriel,
        sujet: c.sujet,
        texte: [remplir(c.salut), "", c.corps, "", remplir(c.question), "", "Guillaume", "Resto Action"].join("\n"),
        html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#191919;"><p>${echapper(remplir(c.salut))}</p><p>${echapper(c.corps)}</p><p>${echapper(remplir(c.question))}</p><p>Guillaume<br>Resto Action</p></div>`,
      });
    } catch (erreur) {
      console.error("[reference] accusé de réception refusé :", erreur instanceof Error ? erreur.message : erreur);
    }
  });

  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
