import { SITE_URL } from "@/lib/site";

/* Les nœuds JSON-LD que plusieurs pages partagent.

   UNE SEULE FICHE D'ENTREPRISE DANS TOUT LE GRAPHE. C'est la règle que suit
   déjà l'accueil : il déclare l'Organization, et /contact s'y rattache par
   `@id` au lieu d'en redéclarer une deuxième. Deux fiches concurrentes pour la
   même entreprise, c'est ce que les moteurs recollent le plus mal — ils ne
   savent pas laquelle fait foi. Avec une page de plateforme, quatre pages de
   fonctionnalité et des articles, la tentation de recopier le nœud partout
   devient forte ; d'où ces fabriques.

   Les `@id` sont ancrés sur la RACINE DE LA VERSION (`` en français, `/en` en
   anglais) : les deux langues déclarent chacune leur entité, sinon elles
   entreraient en collision sur la même identité. */

/* La référence, jamais la copie. */
export const refOrganisation = (racine: string) => ({
  "@id": `${SITE_URL}${racine}/#organization`,
});

/* Le fil d'Ariane. Il n'avait aucun sens tant que le site était plat — l'audit
   le notait « sans objet ». Il en prend un dès qu'une page vit sous une autre :
   il dit au moteur où la page se situe, et c'est lui qui produit le chemin
   affiché sous le titre dans les résultats à la place de l'URL brute.

   Le dernier élément garde son `item` : Google accepte les deux formes, et une
   liste dont tous les maillons portent une URL se relit plus facilement. */
export function filArianne(
  url: string,
  elements: { nom: string; chemin: string }[]
) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#fil`,
    itemListElement: elements.map(({ nom, chemin }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: nom,
      item: `${SITE_URL}${chemin}`,
    })),
  };
}

/* Le nœud d'un service vendu.

   `Service` et non `Product` : ce qui est vendu n'est pas une boîte mais une
   prestation continue, et `Service` accepte `provider` — c'est par là que la
   page se rattache à l'entreprise. Et surtout PAS de `Offer` avec un prix
   inventé ni d'`aggregateRating` : déclarer une note qu'aucun client n'a
   donnée, c'est du balisage mensonger, et Google le sanctionne. */
export function noeudService({
  url,
  racine,
  nom,
  description,
  typeService,
  langue,
  zoneServie,
  fonctionnalites,
}: {
  url: string;
  racine: string;
  nom: string;
  description: string;
  typeService: string;
  langue: string;
  zoneServie: string;
  fonctionnalites?: { nom: string; description: string; url: string }[];
}) {
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: nom,
    description,
    serviceType: typeService,
    inLanguage: langue,
    url,
    provider: refOrganisation(racine),
    areaServed: { "@type": "AdministrativeArea", name: zoneServie },
    /* Le catalogue n'apparaît que sur la page qui chapeaute les autres : une
       page de fonctionnalité qui listerait ses sœurs se déclarerait comme leur
       parent à toutes. */
    ...(fonctionnalites?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: nom,
            itemListElement: fonctionnalites.map((f) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: f.nom,
                description: f.description,
                url: f.url,
              },
            })),
          },
        }
      : {}),
  };
}

/* Le nœud d'un article.

   `author` pointe sur une personne nommée, pas sur la marque : c'est le signal
   E-E-A-T que cherchent les moteurs génératifs — qui parle, et qu'est-ce qui
   l'autorise à parler. Les deux fondateurs sont déjà déclarés en `founder` de
   l'entreprise ; le même `sameAs` LinkedIn les recolle en une seule personne
   dans le graphe.

   `dateModified` vaut `datePublished` tant que l'article n'a pas bougé : deux
   dates identiques ne mentent pas, une date de modification absente laisse le
   moteur deviner. */
export function noeudArticle({
  url,
  racine,
  titre,
  description,
  langue,
  publieLe,
  modifieLe,
  auteur,
  image,
}: {
  url: string;
  racine: string;
  titre: string;
  description: string;
  langue: string;
  publieLe: string;
  modifieLe: string;
  auteur: { nom: string; sameAs: string };
  image?: string;
}) {
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: titre,
    description,
    inLanguage: langue,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: publieLe,
    dateModified: modifieLe,
    author: { "@type": "Person", name: auteur.nom, sameAs: auteur.sameAs },
    publisher: refOrganisation(racine),
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
  };
}

/* Le nœud FAQPage.

   L'accueil le construisait à la main ; la plateforme et les quatre pages de
   fonctionnalité ont chacune leur FAQ. Six copies du même `mainEntity.map`,
   c'était six occasions d'oublier que les réponses doivent être reprises MOT
   POUR MOT du contenu visible — c'est la condition posée par Google, et la
   seule façon de la tenir est que les deux viennent de la même source.

   Google a restreint les résultats enrichis FAQ aux sites gouvernementaux et
   de santé en 2023 : ce balisage ne produit donc plus d'accordéon dans les
   SERP. Il reste utile, et c'est pourquoi il est maintenu — les moteurs qui
   rédigent une réponse (ChatGPT, Perplexity, les aperçus IA) s'appuient
   dessus pour apparier une question à sa réponse. */
export function noeudFaq({
  id,
  langue,
  items,
}: {
  id: string;
  langue: string;
  items: { q: string; a: string }[];
}) {
  return {
    "@type": "FAQPage",
    "@id": id,
    inLanguage: langue,
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
