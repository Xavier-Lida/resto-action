import type { RaisonRefus } from "@/lib/contenu/studio";
import { STUDIO } from "@/lib/site";
import { ouiClair, rapportProche, type Boite, type Verdict } from "@/lib/studio/cadrage";
import { CONTROLE_D_ESSAI, deuxiemeControle, essaiSansIA, premierControle } from "@/lib/studio/controle";
import { moteurIAPret, retoucherIA } from "@/lib/studio/moteur-ia";
import { corriger, dimensions, format, normaliser, reduire } from "@/lib/studio/moteur-sharp";
import { ecrireFiche, ecrirePhoto, lire, lireFiche, noterDepense, plafondAtteint, supprimer } from "@/lib/studio/stockage";
import type { Etape, Fiche, RaisonRepli } from "@/lib/studio/types";

/* LE STUDIO PHOTO : la retouche d'une photo, du début à la fin, sans personne.

     1. On range la photo reçue (HEIC → JPEG, à l'endroit, sans métadonnées).
     2. PREMIER CONTRÔLE : un plat? pas de visage? assez nette, assez claire?
        Sinon on s'arrête : on ne retouche pas, on demande une autre photo.
     3. LA RETOUCHE PAR IA, avec la consigne de Guillaume, mot pour mot.
     4. DEUXIÈME CONTRÔLE : l'originale contre la retouche. Pas de oui clair :
        on refait la retouche UNE fois. Encore non : on livre la correction
        sans génération, avec le message prévu.
     5. La correction sans génération sert aussi quand le moteur d'IA est en
        panne ou quand le plafond de dépenses du jour est atteint. Elle est
        préparée dès le début, en parallèle : elle est toujours prête.
     6. Les 2 formats (1080 × 1080 et 1080 × 1350), sans couper le plat.

   Tourne APRÈS la réponse au visiteur (`after()` dans la route) : la page
   interroge la fiche, réécrite à chaque étape. Cette fonction ne lève jamais. */

const VISION = 1568;
const SOURCE_IA = 2048;
const APERCU = 900;

const INCERTAIN: Verdict & { boite?: Boite } = {
  meme_plat: "incertain",
  memes_aliments: false,
  memes_portions: false,
  meme_assiette: false,
  rien_ajoute: false,
  rien_enleve: false,
  differences: ["Le contrôle n'a pas répondu."],
};

export async function executer(id: string): Promise<void> {
  const fiche = await lireFiche(id);
  if (!fiche || fiche.etat !== "en-cours") return;
  const debut = Date.parse(fiche.creeLe) || Date.now();
  let cout = 0;

  const avancer = async (etape: Etape) => {
    fiche.etape = etape;
    await ecrireFiche(fiche);
  };
  const finir = async (suite: Partial<Fiche>) => {
    Object.assign(fiche, suite, { dureeMs: Date.now() - debut, coutUsd: Math.round(cout * 1e6) / 1e6 });
    await Promise.all([ecrireFiche(fiche), noterDepense(id, cout)]);
  };
  const refuser = (refus: RaisonRefus, motif: string) => finir({ etat: "refusee", refus, motif });

  try {
    // 1. La photo reçue.
    const brut = await lire(fiche.televersement, true);
    if (!brut) return await refuser("illisible", "Le fichier téléversé est introuvable.");
    let originale: Buffer;
    try {
      originale = await normaliser(brut);
    } catch {
      await supprimer(fiche.televersement);
      return await refuser("illisible", "Le fichier n'est pas une image lisible.");
    }
    const [avant] = await Promise.all([reduire(originale, APERCU), ecrirePhoto(id, "originale", originale)]);
    await Promise.all([ecrirePhoto(id, "avant", avant), supprimer(fiche.televersement)]);

    // 5. La correction sans génération part tout de suite : elle sera prête quoi qu'il arrive.
    const correction = corriger(originale).catch(() => null);

    // 2. Premier contrôle.
    await avancer("controle");
    const vueOriginale = await reduire(originale, VISION);
    // L'essai sans IA (poste de développement seulement) : aucun contrôle, voir controle.ts.
    const essai = essaiSansIA();
    const c1 = essai ? { reponse: CONTROLE_D_ESSAI, coutUsd: 0 } : await premierControle(vueOriginale, fiche.resto, fiche.ville);
    cout += c1.coutUsd;
    if (!c1.reponse) return await finir({ etat: "erreur", motif: "Le premier contrôle n'a pas répondu." });
    const vu = c1.reponse;
    if (vu.visage) return await refuser("visage", vu.motif);
    if (!vu.est_plat) return await refuser("pas-un-plat", vu.motif);
    if (vu.qualite !== "bonne") return await refuser(vu.qualite, vu.motif);
    fiche.motif = vu.motif;
    fiche.publication = vu.publication.trim();

    // 3 et 4. La retouche par IA, contrôlée, refaite une fois au besoin.
    let retenue: Buffer | null = null;
    let boite: Boite = vu.boite;
    let repli: RaisonRepli | undefined;

    // Sans deuxième contrôle, rien de généré ne peut être livré : l'essai sans IA livre la correction.
    if (essai || !moteurIAPret()) repli = "panne";
    else if (await plafondAtteint()) repli = "plafond";

    if (!repli) {
      const d = await dimensions(originale);
      const rapport = rapportProche(d.largeur, d.hauteur);
      const source = await reduire(originale, SOURCE_IA, 92);

      for (let essai = 1; essai <= 2 && !retenue; essai++) {
        await avancer("retouche");
        fiche.essais = essai;
        let jpeg: Buffer;
        try {
          const r = await retoucherIA(source, rapport);
          cout += r.coutUsd;
          if (!r.ok) {
            // Le moteur a répondu par du texte. S'il dit que la photo ne peut pas
            // être sauvée (c'est sa consigne), on le dit au visiteur. Sinon c'est
            // une panne comme une autre.
            if (/sombre|dark/i.test(r.dit)) return await refuser("sombre", `Le moteur d'IA : ${r.dit}`);
            if (/flou|blur/i.test(r.dit)) return await refuser("floue", `Le moteur d'IA : ${r.dit}`);
            repli = "panne";
            break;
          }
          // Repasser par sharp enlève les métadonnées que le moteur aurait écrites.
          jpeg = await reduire(r.jpeg, 3000, 92);
        } catch (erreur) {
          console.error("[studio] moteur d'IA :", erreur instanceof Error ? erreur.name : "erreur inconnue");
          repli = "panne";
          break;
        }

        await avancer("verification");
        let verdict: (Verdict & { boite?: Boite }) | null = null;
        try {
          const c2 = await deuxiemeControle(vueOriginale, await reduire(jpeg, VISION));
          cout += c2.coutUsd;
          verdict = c2.reponse;
        } catch (erreur) {
          console.error("[studio] deuxième contrôle :", erreur instanceof Error ? erreur.name : "erreur inconnue");
        }
        const { boite: boiteRetouche, ...sansBoite } = verdict ?? INCERTAIN;
        fiche.verdicts.push(sansBoite);
        if (ouiClair(verdict)) {
          retenue = jpeg;
          if (boiteRetouche) boite = boiteRetouche;
        }
      }
      if (!retenue && !repli) repli = "controle";
    }

    // 5. Sans retouche retenue : la correction sans génération.
    const finale = retenue ?? (await correction);
    if (!finale) return await finir({ etat: "erreur", motif: "Ni la retouche ni la correction n'ont abouti." });

    // 6. Les 2 formats et l'aperçu.
    await avancer("formats");
    const [apres, carre, vertical] = await Promise.all([
      reduire(finale, APERCU),
      format(finale, boite, STUDIO.formats.carre),
      format(finale, boite, STUDIO.formats.vertical),
    ]);
    await Promise.all([ecrirePhoto(id, "apres", apres), ecrirePhoto(id, "carre", carre), ecrirePhoto(id, "vertical", vertical)]);

    await finir({ etat: "pret", moteur: retenue ? "ia" : "correction", repli: retenue ? undefined : repli });
  } catch (erreur) {
    console.error("[studio] retouche :", erreur instanceof Error ? `${erreur.name} ${erreur.message}` : "erreur inconnue");
    try {
      await finir({ etat: "erreur", motif: "Panne pendant la retouche." });
    } catch {
      // Le magasin lui-même ne répond pas : la page finira par afficher la panne.
    }
  }
}
