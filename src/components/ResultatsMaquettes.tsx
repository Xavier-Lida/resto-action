import Image from "next/image";
import { Check, Gift, Mail, Plus, Search, ShoppingCart, Tag } from "lucide-react";
import type { CSSProperties } from "react";
import type { Textes } from "@/lib/textes/fr";

/* Les trois maquettes d'interface animées de la section « Résultats »
   (le quatrième onglet est une photo, il n'a pas de maquette).

   MINUTAGE. Chaque élément porte son instant de départ en millisecondes via
   --t, relevé sur la vidéo de référence image par image. Les formes
   d'animation vivent dans globals.css ; ici on ne pose que la structure et le
   moment. Les constantes ci-dessous sont donc à lire comme une partition :
   changer un chiffre déplace un geste, sans rien casser d'autre. */

const tempo = (ms: number, extra: Record<string, string> = {}) =>
  ({ "--t": `${ms}ms`, ...extra }) as CSSProperties;

/* ═══ 1 · Plus de trafic Google — onglet de 7,2 s ═══
   Cinq actes, relevés sur la référence image par image :

   1. la barre de recherche paraît AU MILIEU du panneau, vide, un curseur qui
      bat dedans ;
   2. elle MONTE à sa place ; le curseur s'éteint et la frappe part, lettre par
      lettre — jamais les deux à la fois, un trait vertical par-dessus les
      lettres les cache ;
   3. la plaque de résultats arrive et ses quatre squelettes tombent PENDANT la
      frappe — plus rien n'attend son tour ;
   4. la fiche du resto SORT DU BORD INFÉRIEUR de la plaque, se découvrant à
      mesure qu'elle remonte, et glisse tout en haut : chaque squelette dépassé
      cède un cran et le dernier sort du cadre. C'est la montée dans le
      classement, toute la métaphore SEO ;
   5. la plaque se resserre sur la fiche puis s'efface — la fiche reste seule.

   TOUT GLISSE. Les gestes durent 40 % de plus que la première version et
   suivent un ease-in-out franc (--res-glisse dans globals.css) au lieu des
   ressorts de la section : un ressort dépasse sa cible avant de se poser, ce
   qui rend vif — et c'est le contraire de ce qu'on cherche ici.

   Sauf la frappe : elle, on la veut vive — 70 ms par signe, la cadence d'une
   vraie main. Un texte qui s'écrit lentement ne paraît pas soigné, il paraît
   pénible.

   Deux silences seulement, tous deux APRÈS un geste achevé : 0,76 s pour lire
   la première position conquise, 0,65 s de pose finale. Cette pose était de
   1,75 s : c'est là qu'on a pris le temps donné aux gestes, parce que la fiche
   y est simplement immobile. */

export const DUREE_TRAFIC = 7200;

const T1 = {
  champ: 220, // la barre paraît, au milieu du panneau, vide
  curseurNait: 800, // le curseur bat dans le champ vide
  monte: 1150, // elle monte à sa place (900 ms) — posée à 2050
  boite: 1500, // la plaque arrive, vide, pendant que la barre finit de monter
  frappe: 2050, // la frappe démarre (70 ms par signe) — finie à 3240
  lignes: 1900, // 1er squelette, les suivants toutes les 150 ms
  montee: 3500, // la fiche franchit le bord et monte (1150 ms, quatre crans)
  cede: 3620, // chaque squelette cède un cran, 90 ms l'un après l'autre
  isolement: 5650, // la plaque se resserre sur la fiche, le décor s'efface
};

/* La frappe se joue LETTRE PAR LETTRE, une animation par caractère.
   Avant, c'était une découpe (clip-path) qui avançait par pas égaux de la
   largeur totale : comme les caractères n'ont pas tous la même largeur, le bord
   de la découpe tombait presque toujours AU MILIEU d'un glyphe et le coupait en
   deux verticalement. Un caractère par élément, c'est la seule façon d'être sûr
   que le dévoilement tombe sur une frontière de caractère — le CSS seul ne sait
   pas où finit une lettre. */
const PAS_FRAPPE = 70; // ms par signe : la requête change de longueur d'une
// langue à l'autre, donc la durée totale de la frappe aussi. C'est voulu — on
// tape à cadence constante, pas en un temps fixe.

/* La plaque tient quatre crans, et la fiche attend juste sous son bord
   inférieur : la scène est donc plus haute que la plaque d'une fiche.
   Un cran vaut exactement la hauteur d'une ligne (py-2 + une vignette de
   2,25 rem) : les lignes se touchent, comme une vraie liste de résultats.
   MARGE, c'est l'air qu'on laisse autour de la fenêtre écrêtante pour que
   l'ombre de la fiche ne soit pas rognée — voir plus bas.
   CRAN ET PLAQUE SONT AUSSI DANS globals.css, sous #resultats (--res-cran,
   --res-plaque) : elles bougent ensemble ou pas du tout. */
const CRANS = 4;
const CRAN = "3.25rem";
const PLAQUE = "13rem"; // CRANS × CRAN
const SCENE = "16.5rem"; // PLAQUE + une fiche qui attend dessous
const MARGE = "1.5rem"; // = les -inset-x-6 / -top-6 / inset-x-6 de la fenêtre

export function MaquetteTrafic({ t }: { t: Textes }) {
  const RECHERCHE = t.maquettes.recherche;
  return (
    <div className="w-full max-w-[20rem] font-ui">
      {/* Trois couches pour la barre, une propriété chacune — deux animations
          de transform sur un même élément s'écraseraient : la montée
          (transform), la sortie de décor (opacité), l'entrée (opacité).
          aria-hidden comme la plaque et la fiche : la requête est découpée en
          un élément par lettre, qu'un lecteur d'écran épellerait. Le message de
          l'onglet est porté par son titre, pas par cette fausse interface. */}
      <div className="res-champ-monte" aria-hidden="true" style={tempo(T1.monte)}>
        <div className="res-champ-sortie" style={tempo(T1.isolement)}>
          <div
            className="res-champ flex items-center gap-2.5 rounded-full bg-white px-4 py-3 shadow-[0_8px_24px_-12px_rgba(25,25,25,0.35)]"
            style={tempo(T1.champ)}
          >
            <Search className="size-4 shrink-0 text-ink/40" />
            <span className="relative">
              {/* Chaque lettre attend son tour. Elles sont toutes là dès le
                  départ, simplement transparentes : la largeur du champ ne
                  bouge donc pas d'un caractère à l'autre. */}
              <span className="block text-sm font-semibold leading-5 text-ink">
                {[...RECHERCHE].map((signe, i) => (
                  <span
                    key={i}
                    className="res-lettre"
                    style={tempo(T1.frappe + i * PAS_FRAPPE)}
                  >
                    {/* Espace insécable : une espace ordinaire, seule dans
                        son élément, pourrait se faire réduire à zéro. */}
                    {signe === " " ? "\u00a0" : signe}
                  </span>
                ))}
              </span>
              {/* Le curseur ne bat que dans le champ VIDE : il dit qu'on va
                  écrire là, puis s'éteint 120 ms avant la première lettre. Il
                  ne suit plus la frappe — sa position se calait sur la découpe
                  par pas égaux alors que les caractères n'ont pas tous la même
                  largeur, si bien qu'il dérivait par-dessus une lettre déjà
                  écrite et la cachait. Il reste donc à gauche, là où le premier
                  caractère va paraître.
                  Trois couches, une propriété chacune : naissance et mort
                  animent toutes deux l'opacité, et sur un seul élément le fill
                  both de la seconde imposerait son état de départ dès l'instant
                  zéro, écrasant la première. */}
              <span
                className="res-curseur absolute left-0 top-0 h-5 w-px"
                style={tempo(T1.curseurNait)}
              >
                <span
                  className="res-curseur-mort block size-full"
                  style={tempo(T1.frappe - 100)}
                >
                  <span className="res-curseur-clignote block size-full bg-ink" />
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-4" style={{ height: SCENE }}>
        {/* A · la plaque et ses squelettes. Trois enveloppes, une propriété
            chacune : le déplacement qui la garde collée à la fiche pendant
            qu'elle se referme, son effacement, puis la plaque elle-même — qui
            porte deux animations (entrée en opacité, resserrement en hauteur)
            parce qu'elles ne se disputent pas la même propriété. */}
        <div className="res-boite-place" style={tempo(T1.isolement)}>
          <div
            className="res-boite-sortie"
            style={tempo(T1.isolement + 260)}
          >
            {/* La hauteur de la plaque vit dans globals.css, pas ici : c'est
                elle qui se resserre, et « mouvement réduit » doit pouvoir la
                figer refermée — un style en ligne l'en empêcherait. */}
            <div
              aria-hidden="true"
              className="res-boite relative overflow-hidden rounded-2xl bg-ink/[0.045]"
              style={tempo(T1.boite, { "--t2": `${T1.isolement}ms` })}
            >
              {Array.from({ length: CRANS }, (_, cran) => (
                <div
                  key={cran}
                  style={tempo(T1.cede + cran * 90, {
                    top: `calc(${cran} * ${CRAN})`,
                  })}
                  className="res-cede absolute inset-x-0"
                >
                  <div
                    className="res-ligne flex items-center gap-3 px-3 py-2"
                    style={tempo(T1.lignes + cran * 150)}
                  >
                    <div className="size-9 shrink-0 rounded-lg bg-ink/10" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2 w-2/5 rounded-full bg-ink/15" />
                      <div className="h-2 w-4/5 rounded-full bg-ink/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* B · la fiche du resto, dans sa FENÊTRE.
            La fiche ne paraît pas en fondu : elle se DÉCOUVRE en franchissant
            le bord inférieur du contenant, comme si elle avait toujours été
            dans la liste, simplement plus bas. Il faut donc un ancêtre
            IMMOBILE qui écrête — un clip-path posé sur la fiche voyagerait
            avec elle au lieu de rester sur le bord, et la remettre dans la
            plaque ne marche pas non plus : la plaque se resserre puis
            s'efface, elle emporterait la fiche avec elle.
            La fenêtre ne sert donc qu'à UN bord, celui du bas, posé pile sur
            le bord inférieur de la plaque (elle commence MARGE plus haut et
            mesure PLAQUE + MARGE). Les trois autres bords sont écartés de
            MARGE pour ne pas rogner l'ombre portée de la fiche. */}
        <div
          aria-hidden="true"
          className="absolute -inset-x-6 -top-6 z-10 overflow-hidden"
          style={{ height: `calc(${PLAQUE} + ${MARGE})` }}
        >
          {/* Montée et couronnement animent tous deux transform, donc chacun a
              son élément. inset-x-6 rend à la fiche la largeur de la plaque,
              que les -inset-x-6 de la fenêtre lui avaient élargie. */}
          <div
            className="res-monte absolute inset-x-6"
            style={tempo(T1.montee, { top: `calc(${PLAQUE} + ${MARGE})` })}
          >
            <div className="res-couronne rounded-xl" style={tempo(T1.isolement)}>
              <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-[0_6px_16px_-8px_rgba(25,25,25,0.25)]">
                <div className="size-9 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    draggable={false}
                    src="/resultats-pizza.webp"
                    alt=""
                    width={512}
                    height={512}
                    unoptimized
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8rem] font-semibold leading-none">
                    Ton restaurant
                  </p>
                  <div className="mt-2 h-2 w-4/5 rounded-full bg-ink/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ 2 · Plus de ventes en ligne — onglet de 9,8 s ═══
   Un plat ajouté toutes les 1,6 s, le premier à 1,7 s. La pile descend, donc
   c'est toujours la carte du BAS qui est dans la fente active : les plats sont
   listés de haut en bas et l'ordre d'ajout remonte la liste — La Gotham
   d'abord, la Salade César en dernier.

   L'ENCHAÎNEMENT D'UN PLAT, relevé sur la référence image par image (analyse de
   pixels, pas à l'œil : la vidéo est dans le scratchpad). Tout est compté
   depuis l'instant du crochet, et c'est ce qui rend le geste cohérent — la
   carte tombe, et la pilule réagit en l'avalant :

     T          le « + » de la carte devient un crochet vert ;
     T + 460    la pile commence à descendre, carte du bas en tête ;
     T + 520    la pilule du panier grossit et s'éclaircit, puis revient ;
     T + 760    la pastille s'incrémente et le montant roule ;
     T + 1600   crochet du plat suivant.

   Le montant roule en odomètre : chaque colonne de chiffre est sa propre
   fente, décalée de 45 ms sur la précédente. */

/* Le dernier plat part à 8880 et a fini de rentrer à 9360 : il porte les 320 ms
   de décalage du domino, comme toutes les cartes du haut. D'où ces 10,0 s, qui
   laissent 640 ms de pose sur la pilule seule — le même compte que l'onglet 1. */
export const DUREE_VENTES = 10000;

const PREMIER_AJOUT = 1700;
const PAS_AJOUT = 1600; // la cadence relevée sur la référence (~1560 ms)
const ajout = (rang: number) => PREMIER_AJOUT + rang * PAS_AJOUT;
const DECALAGE_COLONNE = 45;

/* Les retards de la référence, comptés depuis le crochet. */
const RETARD_DESCENTE = 460;
const RETARD_PULSE = 520;
const RETARD_CHIFFRES = 760;

/* « Ton panier » entre avec le panneau et doit céder la fente PILE quand le
   premier montant arrive : sa fenêtre vaut donc tout ce temps-là. res-valeur
   sort dans ses derniers 16 %, la sortie finit donc juste à l'arrivée des
   chiffres — ni trou, ni chevauchement. */
const FENETRE_LIBELLE = PREMIER_AJOUT + RETARD_CHIFFRES - 100;

/* La descente. Un cran dure 480 ms, et chaque carte part 80 ms après sa voisine
   du dessous : c'est ce retard qui fait le domino — les écarts entre cartes
   s'ouvrent pendant la course, puis se referment. Mesuré sur la référence,
   où l'écart entre deux cartes voisines passe de 223 à 278 px.

   DUREE_TOTALE_DESCENTE est la fenêtre du premier départ à la dernière arrivée.
   C'est elle, et non la durée de l'onglet, qui sert d'échelle au keyframe : les
   crans y tombent alors sur des pourcentages réguliers (480/5280 = 9,09 % de
   course, 1600/5280 = 30,30 % de pas), et rien ne casse si la durée de l'onglet
   bouge. Changer DUREE_DESCENTE ou PAS_AJOUT oblige en revanche à recalculer
   les pourcentages de res-descend dans globals.css. */
const DUREE_DESCENTE = 480;
const DECALAGE_DESCENTE = 80;
/* CINQ crans, pas quatre : le dernier plat rentre dans le panier comme les
   autres, et l'onglet se referme sur la pilule seule — c'est ce que fait la
   référence. D'où 4 × PAS_AJOUT et non 3. */
const DUREE_TOTALE_DESCENTE = 4 * PAS_AJOUT + DUREE_DESCENTE; // 6880 ms

/* Les vignettes des plats. Elles ne se traduisent pas — seuls les noms et les
   prix viennent du dictionnaire — mais l'ordre des deux tableaux doit
   correspondre : c'est ce qui apparie une image à son plat. */
const IMAGES_PLATS = [
  "/resultats-salade.webp",
  "/resultats-pain-ail.webp",
  "/resultats-poutine.webp",
  "/resultats-ailes.webp",
  "/resultats-gotham.webp",
];

/* Les totaux cumulés — 34,00 → 48,99 → 61,98 → 75,97 → 87,96 $ — rangés par
   COLONNE de chiffre : COLONNES[c][k] est le chiffre c du k-ième total. */
const COLONNES = [
  ["3", "4", "6", "7", "8"],
  ["4", "8", "1", "5", "7"],
  ["0", "9", "9", "9", "9"],
  ["0", "9", "8", "7", "6"],
];
const ETATS = COLONNES[0].length;

/* Une fente d'odomètre : les valeurs se relaient dans un cadre à
   overflow-hidden, la dernière reste. `depart(k)` donne l'instant du k-ième
   relais ; le jumeau invisible fige la largeur du cadre. */
function Fente({
  valeurs,
  depart,
  jumeau,
  className = "",
}: {
  valeurs: string[];
  depart: (k: number) => number;
  jumeau: string;
  className?: string;
}) {
  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className}`}>
      <span className="invisible block">{jumeau}</span>
      {valeurs.map((valeur, k) => (
        <span
          key={k}
          style={tempo(depart(k), { "--res-pas": `${PAS_AJOUT}ms` })}
          className={`${k === valeurs.length - 1 ? "res-valeur-fin" : "res-valeur"} absolute inset-0 grid place-items-center`}
        >
          {valeur}
        </span>
      ))}
    </span>
  );
}

/* Une colonne de l'odomètre : sa fente roule 45 ms après la précédente, et le
   tout attend RETARD_CHIFFRES après le crochet — le panier ne se met à jour
   qu'une fois la carte tombée dedans. */
function Colonne({ c }: { c: number }) {
  return (
    <Fente
      valeurs={COLONNES[c]}
      jumeau="0"
      depart={(k) => ajout(k) + RETARD_CHIFFRES + c * DECALAGE_COLONNE}
    />
  );
}

export function MaquetteVentes({ t }: { t: Textes }) {
  const PLATS = t.maquettes.plats;
  return (
    <div className="w-full max-w-[20rem] font-ui">
      {/* Le dégradé du haut estompe les plats qui attendent leur tour, et
          l'overflow écrête ceux qui sont partis.
          LES 11,25 REM VALENT EXACTEMENT TROIS PAS de 3,75 rem : une carte au
          cran 3 commence donc pile sur le bord d'écrêtage, et un plat qui
          descend s'efface derrière ce bord au lieu d'en dépasser. J'avais
          creusé ce conteneur à 12,5 rem pour loger une ombre portée — sans
          ombre (voir res-carte), il n'y a plus rien à loger, et la bande en
          trop laissait voir un liseré de la carte suivante entre la carte
          active et la pilule. */}
      <div className="h-[11.25rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_35%)]">
        {PLATS.map((plat, i) => {
          // Rang d'ajout : la carte du bas passe la première.
          const rang = PLATS.length - 1 - i;
          /* La vie de la carte : elle s'éclaire en arrivant dans la fente, reste
             claire pendant son crochet, puis s'efface en s'en allant. La fenêtre
             de res-carte dure 1900 ms et son zéro tombe 900 ms AVANT le crochet
             — la carte atteint la fente à −660 ms et commence à repartir à
             +460, tout tient donc dedans. Compte à ne pas perdre : avec l'ancien
             −PAS_AJOUT, la carte était éteinte 194 ms avant son propre crochet,
             et le crochet vert se posait sur une carte déjà partie. */
          const debut = ajout(rang) - 900;
          return (
            /* Deux enveloppes, une propriété chacune : la descente (transform)
               et la vie de la carte (opacité, ombre) s'écraseraient sur un même
               élément. La descente est décalée de DECALAGE_DESCENTE par cran de
               rang : la carte la plus basse encore visible mène toujours, à
               chaque cran, sans qu'on ait à le dire cran par cran. */
            <div
              key={plat.nom}
              aria-hidden="true"
              className="res-descend"
              style={tempo(
                PREMIER_AJOUT + RETARD_DESCENTE + rang * DECALAGE_DESCENTE,
                { "--res-descente": `${DUREE_TOTALE_DESCENTE}ms` }
              )}
            >
              <div
                style={tempo(debut)}
                className="res-carte mb-2 flex h-[3.25rem] items-center gap-3 rounded-xl bg-white px-3"
              >
                <Image
                  draggable={false}
                  src={IMAGES_PLATS[i]}
                  alt=""
                  width={512}
                  height={512}
                  unoptimized
                  className="size-9 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8rem] font-semibold leading-none">
                    {plat.nom}
                  </p>
                  <p className="mt-1.5 text-[0.7rem] leading-none text-ink/50">
                    {plat.prix}
                  </p>
                </div>
                {/* Le « + » devient un crochet vert. Les deux icônes cohabitent
                    et se croisent en fondu — une seule ne pourrait pas changer
                    de forme —, et elles héritent le --t du bouton. Les couleurs
                    de repos sont posées ici pour que « animations réduites » ait
                    quelque chose à afficher. */}
                <span
                  className="res-bouton relative grid size-7 shrink-0 place-items-center rounded-full bg-bone text-ink"
                  style={tempo(ajout(rang))}
                >
                  <Plus className="res-bouton-plus absolute size-3.5" />
                  <Check className="res-bouton-crochet absolute size-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* La pilule grossit et s'éclaircit à chaque plat accepté, puis revient à
          son état : une seule règle jouée cinq fois, une par plat, plutôt qu'un
          keyframe géant qui encoderait les cinq pouls. */}
      <div
        className="res-pilule mt-3 flex items-center gap-3 rounded-full bg-ink px-4 py-3 text-white"
        style={tempo(PREMIER_AJOUT + RETARD_PULSE, {
          "--res-pas": `${PAS_AJOUT}ms`,
        })}
      >
        <ShoppingCart aria-hidden="true" className="size-4 shrink-0" />
        <span className="relative block flex-1 text-center text-sm font-semibold">
          {/* « Ton panier » tient la place jusqu'au premier montant, puis cède
              la fente. Son départ est calé pour que sa sortie finisse juste
              avant l'arrivée des chiffres : les deux ne se croisent jamais. */}
          <span className="absolute inset-0 overflow-hidden">
            <span
              style={tempo(100, { "--res-pas": `${FENETRE_LIBELLE}ms` })}
              className="res-valeur absolute inset-0 grid place-items-center"
            >
              {t.maquettes.panier}
            </span>
          </span>
          {/* Le montant : « Tu gardes » et « $ » sont statiques, seules les
              colonnes de chiffres roulent — chacune 45 ms après la
              précédente, c'est ce décalage qui fait l'odomètre. */}
          <span
            className="res-apparait relative tabular-nums"
            style={tempo(PREMIER_AJOUT + RETARD_CHIFFRES)}
          >
            {t.maquettes.montant.avant}
            <Colonne c={0} />
            <Colonne c={1} />
            {t.maquettes.montant.separateur}
            <Colonne c={2} />
            <Colonne c={3} />
            {t.maquettes.montant.apres}
          </span>
        </span>
        {/* La pastille de comptage n'existe qu'à partir du premier montant : une
            pastille rouge vide à côté de « Ton panier » ne voudrait rien dire. */}
        <span
          style={tempo(PREMIER_AJOUT + RETARD_CHIFFRES)}
          className="res-apparait grid size-6 shrink-0 place-items-center rounded-full bg-[var(--res-compte)] text-xs font-bold"
        >
          <Fente
            valeurs={Array.from({ length: ETATS }, (_, k) => String(k + 1))}
            jumeau="0"
            depart={(k) => ajout(k) + RETARD_CHIFFRES}
          />
        </span>
      </div>
    </div>
  );
}

/* ═══ 3 · Plus de commandes répétées — onglet de 6,85 s ═══
   Les huit étapes arrivent pleines et blanches avec le panneau — la référence
   ne les éteint pas. Ce qui vit : un petit tiret qui descend le fil, le trait
   qui se remplit derrière lui, et l'icône de chaque étape qui prend la
   couleur de marque à son passage, avec un léger pop. C'est le passage du
   tiret qui raconte la relance, pas une cascade d'apparitions. */

export const DUREE_RELANCES = 6850;

const DEPART_PARCOURS = 800; // le tiret naît sur la première étape
const PARCOURS = 4800; // il met 4,8 s à rejoindre la dernière

/* La structure du parcours — le genre de chaque jalon et son icône — vit ici ;
   les mots viennent du dictionnaire. LES HUIT JALONS SONT STRUCTURELS : le
   tableau PASSAGES ci-dessous donne l'instant où le tiret atteint chacun, il
   est calculé pour huit. En ajouter ou en retirer un oblige à le recalculer.
   Le premier jalon est l'avatar de la cliente, d'où le décalage d'un rang
   entre ce tableau et `t.maquettes.etapes`, qui n'en compte que sept. */
const etapes = (t: Textes) => {
  const [attente1, offre, suggestions, recommande, attente2, fetes, habituee] =
    t.maquettes.etapes;
  return [
    { cle: "cliente", genre: "avatar" as const, texte: t.maquettes.cliente },
    { cle: "attente-1", genre: "note" as const, texte: attente1 },
    { cle: "offre", genre: "pastille" as const, icone: Tag, texte: offre },
    {
      cle: "suggestions",
      genre: "pastille" as const,
      icone: Mail,
      texte: suggestions,
    },
    { cle: "recommande", genre: "note" as const, texte: recommande },
    { cle: "attente-2", genre: "note" as const, texte: attente2 },
    { cle: "fetes", genre: "pastille" as const, icone: Gift, texte: fetes },
    { cle: "habituee", genre: "note" as const, texte: habituee },
  ];
};

/* L'instant où le tiret atteint chaque étape. Comme il ACCÉLÈRE, ces instants
   ne sont pas régulièrement espacés : ce sont les temps où la courbe
   cubic-bezier(0.5, 0.15, 0.75, 1) — celle du tiret, dans globals.css —
   atteint chaque huitième du parcours. Un espacement régulier ferait s'allumer
   les icônes à côté du tiret, et c'est justement ce raccord qui donne
   l'impression qu'il les réveille au passage.
   Si la courbe change, ce tableau doit être recalculé avec elle. */
const PASSAGES = [0, 1200, 1882, 2395, 2899, 3365, 3950, 4800];
const passage = (i: number) => DEPART_PARCOURS + PASSAGES[i];

const OMBRE_ETAPE = "shadow-[0_10px_28px_-14px_rgba(25,25,25,0.6)]";

export function MaquetteRelances({ t }: { t: Textes }) {
  const ETAPES = etapes(t);
  const parcours = tempo(DEPART_PARCOURS, {
    "--res-parcours": `${PARCOURS}ms`,
  });

  return (
    <div className="relative w-full max-w-[20rem] font-ui" aria-hidden="true">
      {/* La lumière voyage seule, par-dessus toute la colonne : elle doit
          traverser les segments ET les composantes, elle ne peut donc pas
          vivre dans le flux comme eux. Le fil, lui, n'est plus ici — il est
          découpé en segments posés entre les jalons, plus bas. */}
      <div className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2">
        <div
          className="res-pulse absolute left-1/2 h-4 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.55)]"
          style={parcours}
        />
      </div>

      {/* LE FIL EST DÉCOUPÉ, un segment par intervalle : dans la référence il
          s'arrête avant chaque texte et chaque bulle, et ne passe jamais
          derrière. Chaque segment étant un enfant du flux, il occupe son
          intervalle sans qu'on ait à connaître la hauteur des jalons — c'est
          ce qui tient quand le texte change de langue.

          Les segments sont blancs de bout en bout : relevé sur la référence,
          le dernier est déjà blanc à 3,0 s alors que la lumière ne l'atteint
          qu'à 7,5 s. Rien ne se remplit derrière elle. */}
      <div className="relative flex flex-col items-center gap-1">
        {ETAPES.flatMap((etape, i) => {
          let contenu;

          if (etape.genre === "note") {
            contenu = (
              <p className="text-center text-[0.7rem] leading-none text-white/70">
                {etape.texte}
              </p>
            );
          } else if (etape.genre === "avatar") {
            contenu = (
              <div
                className={`flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 ${OMBRE_ETAPE}`}
              >
                <Image
                  draggable={false}
                  src="/resultats-avatar.webp"
                  alt=""
                  width={320}
                  height={320}
                  unoptimized
                  className="size-8 rounded-full object-cover"
                />
                <span>
                  <span className="block text-[0.6rem] uppercase leading-none tracking-widest text-ink/45">
                    {t.maquettes.nouvelleCliente}
                  </span>
                  <span className="mt-1 block text-[0.8rem] font-semibold leading-none text-ink">
                    {etape.texte}
                  </span>
                </span>
              </div>
            );
          } else {
            const Icone = etape.icone;
            contenu = (
              <div
                className={`flex items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4 ${OMBRE_ETAPE}`}
              >
                {/* L'icône s'allume au passage de la lumière ; ses couleurs de
                    repos (celles du balisage) sont l'état allumé, pour que
                    « animations réduites » montre le parcours accompli. */}
                <span
                  className="res-icone-allumee grid size-6 shrink-0 place-items-center rounded-full bg-brand/10 text-brand"
                  style={tempo(passage(i))}
                >
                  <Icone className="size-3.5" />
                </span>
                <span className="text-[0.8rem] leading-none text-ink">
                  {etape.texte}
                </span>
              </div>
            );
          }

          /* Deux enveloppes : res-etape porte l'entrée du panneau, res-gonfle
             le gonflement au passage. Les deux animent transform, elles ne
             peuvent pas tenir sur le même élément. */
          const jalon = (
            <div key={etape.cle} className="res-etape">
              <div className="res-gonfle" style={tempo(passage(i))}>
                {contenu}
              </div>
            </div>
          );

          if (i === 0) return [jalon];
          return [
            <span
              key={`fil-${etape.cle}`}
              className="h-3 w-px shrink-0 bg-white/45"
            />,
            jalon,
          ];
        })}
      </div>
    </div>
  );
}

/* ═══ 4 · Plus de téléchargements — onglet de 5,0 s ═══
   Pas de maquette : la photo porte le panneau. C'est aussi pour ça que c'est
   l'onglet le plus court du cycle — il n'y a rien à regarder se faire. */
export const DUREE_APP = 5000;
