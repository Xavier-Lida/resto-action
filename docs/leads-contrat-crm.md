# La porte unique des leads : contrat entre le site et le CRM

Pour : Xavier · De : Guillaume (rédigé avec Claude) · Version 1, 18 nov. 2026
Statut : **le site est prêt, le CRM n'a rien à changer pour que ça marche**. Tant que `CRM_LEADS_URL` n'est pas posée, chaque lead arrive par courriel à l'équipe (objet « [Lead] … »), avec ce JSON en bas du message. Les 3 routes que tu connais déjà gardent leur adresse et leur format.

Le site n'a pas de base de données. **Le CRM est la source de vérité.**

---

## 1. En bref

- **Un seul point de sortie côté site** : `signalerLead(evenement)` dans `src/lib/leads/envoi.ts`. Tous les formulaires où un resto laisse un contact passent par elle.
- **Un lead a toujours le même format** (section 3), peu importe l'outil.
- **Ce qui existe ne change pas** : `signalerReservation`, `signalerFondateur` (`src/lib/crm.ts`) et `signalerReference` (`src/lib/references/envoi.ts`) sont appelées par la porte, pas remplacées. Une seule clé s'ajoute aux 2 premières : `lead` (section 5).
- **Une nouvelle route, facultative** : `CRM_LEADS_URL`, pour les sources que le CRM ne connaît pas encore (section 4).
- **L'équipe reçoit un courriel pour chaque lead**, que le CRM ait répondu ou non. Si le CRM refuse ou ne répond pas, le courriel dit « CRM en échec ».

## 2. Le transport

- **Requête** : `POST {CRM_LEADS_URL}`, en-têtes `Authorization: Bearer {CRM_INGESTION_SECRET}` et `Content-Type: application/json`. Même secret et même façon de faire que les 3 autres routes.
- **Corps** : le lead, tel quel (section 3).
- **Délai** : 10 secondes. Passé ce délai, le site considère que le CRM n'a pas répondu.
- **Réponses attendues** :

| Réponse | Sens | Ce que fait le site |
|---|---|---|
| `201 { "ok": true, "lead_id": "…" }` | Lead créé | Succès. Le courriel d'alerte part quand même, avec « Reçu par le CRM : oui ». |
| `200 { "ok": true, "deja_recu": true }` | Cet `id` est déjà là | Succès, rien d'autre. |
| `400` | Format refusé (version inconnue, champ manquant) | Le courriel part avec « CRM en échec ». |
| `401` / `403` | Mauvais secret | Idem. |
| `5xx`, ou pas de réponse en 10 s | Panne | Idem. |

  Le site ne lit que le code de statut (`2xx` = accepté). Le corps de la réponse sert au débogage.
- **Idempotence** : chaque lead porte un `id` (UUID) **créé dans le navigateur**. Un double clic, un rechargement ou un nouvel essai renvoie le même `id`. Le site filtre déjà les doublons qu'il voit (en mémoire, par instance), mais **c'est le CRM qui tranche** : contrainte unique sur `id`, et un `id` déjà reçu est ignoré.
- **Horloge** : `horodatage` est l'heure du serveur du site, écrite à l'heure de Montréal (America/Toronto) en ISO 8601 avec son décalage, par exemple `2026-11-18T14:32:07-05:00`. C'est un instant exact : `new Date(horodatage)` le relit sans perte.

## 3. Le lead (JSON exact)

```json
{
  "id": "6f0d3c2a-2b1e-4d1c-9d6a-0f3f1d7c9b21",
  "version": 1,
  "type": "lead",
  "source": "calcul-60",
  "horodatage": "2026-11-18T14:32:07-05:00",
  "langue": "fr",
  "contact": {
    "prenom": "Marie",
    "nom": null,
    "cellulaire": "8195550100",
    "courriel": null
  },
  "resto": {
    "nom": "Pizzeria du Coin",
    "ville": "Shawinigan",
    "google_place_id": "ChIJN1t_tDeuEmsRUsoyG83frY4"
  },
  "donnees": {},
  "consentement": {
    "texte": "J'accepte de recevoir des textos de Resto Action au sujet de mon calcul. Je peux me désabonner en tout temps.",
    "coche": true,
    "horodatage": "2026-11-18T14:32:07-05:00"
  },
  "provenance": {
    "page": "/calcul",
    "page_arrivee": "/p/CHEZTI",
    "site_origine": "l.facebook.com",
    "utm": { "source": "facebook", "medium": "cpc", "campaign": "lancement-hiver", "content": null, "term": null },
    "video": null,
    "reference": {
      "code": "CHEZTI",
      "type": "client",
      "nom": "Chez Ti-Jean",
      "representant": null,
      "source": "lien",
      "premier_contact": "2026-11-02T14:10:00.000Z"
    }
  },
  "cle_resto": "tel:8195550100"
}
```

| Champ | Valeurs | Notes |
|---|---|---|
| `id` | UUID | Créé dans le navigateur. Si le navigateur n'en envoie pas, le serveur en crée un. |
| `version` | `1` | Monte si le format change. Le CRM refuse une version inconnue (400). |
| `type` | `lead` | Toujours. Distingue ce corps de celui des autres routes. |
| `source` | `calcul-60` · `classement` · `studio` · `reference` · `reserve-ta-place` · `reservation` · `dossier-releve` · `contact` | Voir la section 4. |
| `langue` | `fr` · `en` | |
| `contact.prenom` | texte | Quand le formulaire demande un nom complet, il est coupé : le premier mot ici, le reste dans `nom`. |
| `contact.cellulaire` | **10 chiffres**, ou `null` | Un seul format : `8195550100`. Jamais d'espace, de tiret, de parenthèse ni de `+1`. |
| `contact.cellulaire_saisi` | texte, facultatif | Présent seulement si ce qui a été tapé ne se ramène pas à 10 chiffres (numéro étranger). `cellulaire` vaut alors `null`. |
| `contact.courriel` | texte en minuscules, ou `null` | |
| `resto.google_place_id` | identifiant de lieu Google, ou `null` | **Le même** pour le Calcul, le Classement et le Studio quand le resto a choisi sa fiche : le CRM peut mettre les 3 sur la même fiche. |
| `donnees` | objet | Propre à la source (section 4). |
| `consentement` | objet, ou `null` | `null` quand le formulaire n'a pas de case. `texte` est le texte **exact** de la case, copié par le serveur depuis le fichier de contenu (jamais reçu du navigateur). `coche` dit si elle était cochée. |
| `provenance.page` | chemin | La page du formulaire. |
| `provenance.page_arrivee` | chemin, ou `null` | La première page de la visite. |
| `provenance.site_origine` | domaine, ou `null` | Le site d'où il vient. |
| `provenance.utm` | 5 clés | `null` quand il n'y en a pas. |
| `provenance.video` | identifiant, ou `null` | S'il a regardé la vidéo sur le site. |
| `provenance.reference` | objet, ou `null` | Le code de référence (témoin de 30 jours, le premier contact gagne). Voir la section 6. |
| `cle_resto` | `tel:{10 chiffres}` · `google:{place_id}` · `nom:{nom}\|{ville}` | Dans cet ordre : le cellulaire, sinon l'identifiant Google, sinon le nom et la ville (minuscules, sans accents ni ponctuation). **Le site ne fusionne rien** : il envoie la clé, et le CRM décide. |

## 4. Les sources : par où elles arrivent, et leurs données

| Source | Formulaire | Route d'aujourd'hui | Avec `CRM_LEADS_URL` |
|---|---|---|---|
| `calcul-60` | Le Calcul 60 secondes (accueil et `/calcul`) | `CRM_FONDATEUR_URL`, étape `dossier`, `source: "calcul-60"` | **`CRM_LEADS_URL`** |
| `classement` | Ton rang sur Google | `CRM_FONDATEUR_URL`, étape `dossier`, `source: "classement"` | **`CRM_LEADS_URL`** |
| `studio` | Le Studio Photo (`/studio`) | `CRM_FONDATEUR_URL`, étape `dossier`, `source: "studio"` | **`CRM_LEADS_URL`** |
| `contact` | La maquette gratuite; l'ancien formulaire de références (`/en/referrals`) | `CRM_FONDATEUR_URL`, étape `maquette` (la maquette seulement) | **`CRM_LEADS_URL`** |
| `dossier-releve` | Le Dossier pour ton associé (calculateur avec relevé) | `CRM_FONDATEUR_URL`, étape `dossier` | inchangé |
| `reserve-ta-place` | `/reserver`, étape 1 puis étape 4 | `CRM_FONDATEUR_URL`, étapes `prospect` et `reservation` | inchangé |
| `reservation` | Un rendez-vous à l'agenda (`/contact`) | `CRM_INGESTION_URL` | inchangé |
| `reference` | Les 3 formulaires de `/refere-un-resto` | `CRM_REFERENCES_URL` | inchangé |

**La règle** : dès que `CRM_LEADS_URL` est posée, les 4 premières sources arrivent là, au format de la section 3, **et plus par `CRM_FONDATEUR_URL`** (pas de double fiche). Les 4 autres gardent leur route. Sans route branchée pour une source, seul le courriel part.

### 4.1 `calcul-60`

Les 3 chiffres entrés, la réponse (recalculée par le serveur) et le lien du dossier.

```json
"donnees": {
  "commandes_par_semaine": 50,
  "commande_moyenne": 30,
  "taux_commission": 0.25,
  "par_semaine": 375,
  "par_annee": 19500,
  "lien_dossier": "https://www.restoaction.ca/calcul/dossier?c=50&m=30&t=25"
}
```
`consentement` : la case est obligatoire, `coche` vaut toujours `true`.

### 4.2 `classement`

```json
"donnees": {
  "type_libelle": "pizzerias",
  "type": "pizza_restaurant",
  "test_bouton": "plateforme",
  "fiche": "https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4"
}
```
- `test_bouton` : `plateforme` · `chez-moi` · `pas-de-bouton` · `null` (pas répondu). C'est la réponse à « Clique sur Commander en ligne. Tu tombes où? ».
- `resto.google_place_id` est toujours rempli pour cette source.
- **Le rang, le nombre d'avis et la note ne sont pas envoyés.** Le site les calcule à la demande et ne les garde pas : les règles de Google permettent de garder l'identifiant de lieu, pas ses données. Guillaume refait la recherche avant d'écrire au resto.
- `consentement` : la case est obligatoire, `coche` vaut toujours `true`.

### 4.3 `studio`

```json
"donnees": {
  "originale": "https://www.restoaction.ca/api/studio/suivi/image?id=…&vue=originale",
  "retouche": "https://www.restoaction.ca/api/studio/suivi/image?id=…&vue=vertical",
  "moteur": "ia",
  "verdict_controle": "oui",
  "reponse_1": "DoorDash, Uber Eats",
  "reponse_2": "50 à 150",
  "exemple_permis": false,
  "publication": "…"
}
```
- `moteur` : `ia` (retouche par IA) ou `correction` (correction sans génération).
- `verdict_controle` : `oui` · `non` · `incertain` · `sans objet` (le contrôle « est-ce le même plat? »).
- `reponse_1` et `reponse_2` : les plateformes utilisées et le volume de commandes, ou `null`.
- Les liens des photos cessent de répondre quand la photo est effacée (30 jours), sauf si `exemple_permis` est vrai.
- Les données de cette source sont écrites par `src/app/api/studio/contact/route.ts`.

### 4.4 `reference`

`donnees` est **l'événement complet de « Réfère un resto »**, exactement celui que `signalerReference` envoie à `CRM_REFERENCES_URL` (voir `docs/references-contrat-crm.md`, section 2). Son `id` est celui du lead.

```json
"donnees": {
  "id": "6f0d3c2a-2b1e-4d1c-9d6a-0f3f1d7c9b21",
  "version": 1,
  "horodatage": "2026-11-18T19:32:07.204Z",
  "type": "reference.recue",
  "langue": "fr",
  "page": "/refere-un-resto",
  "source": "formulaire",
  "referent": { "code": "CHEZTI", "type": "client", "nom": "Chez Ti-Jean", "representant": null },
  "refere": { "resto_nom": "Pizzeria du Coin", "contact_prenom": "Marie", "contact_nom": "Tremblay", "telephone": "(819) 555-0100", "courriel": null, "ville": "Shawinigan" },
  "consentement_contact": { "donne": true, "texte": "Cette personne m'a dit qu'elle voulait en savoir plus sur Resto Action, et je l'ai prévenue que quelqu'un de l'équipe allait la contacter.", "horodatage": "2026-11-18T19:32:07.204Z" },
  "referent_contact": { "nom": "Jean Gagnon", "entreprise": "Chez Ti-Jean", "courriel": "jean@chezti.ca", "telephone": null, "code_saisi": null }
}
```
- Trois types passent par cette source : `reference.recue`, `lien.demande` et `partenaire.candidature`.
- `contact` et `resto` du lead désignent **qui appeler** : le resto présenté (`reference.recue`), le demandeur (`lien.demande`), le candidat (`partenaire.candidature`).
- `provenance.reference` vaut `null` : le référent est dans les données.
- Cette source n'arrive jamais par `CRM_LEADS_URL`. Le CRM la reçoit sur `CRM_REFERENCES_URL`, au format de `references-contrat-crm.md`, sans la couche « lead ».

### 4.5 `reserve-ta-place`

Deux leads par resto, avec **deux `id` différents et la même `cle_resto`** : l'étape 1 (un lead chaud à rappeler s'il décroche), puis l'étape 4 (la réservation).

Étape 1 :
```json
"donnees": { "etape": "prospect" },
"consentement": null
```

Étape 4 :
```json
"donnees": {
  "etape": "reservation",
  "menu": "https://pizzeriaducoin.ca/menu",
  "service": "livraison+cueillette",
  "plateformes": "doordash, ubereats",
  "commandes": "50 à 150",
  "conditions": "2026-11-18",
  "accord_coche": true,
  "accord_texte": "J'ai lu le prix tout compris. Ma réservation est gratuite : ma place est confirmée à la signature de mon bon d'accord, et la mise en service se paie à ce moment-là."
},
"consentement": {
  "texte": "J'accepte de recevoir des textos de Resto Action au sujet de mon lancement. Je peux me désabonner en tout temps.",
  "coche": false,
  "horodatage": "2026-11-18T14:32:07-05:00"
}
```
- `consentement` est la case des textos, **facultative** : `coche` peut être `false`. La case d'accord, obligatoire, est dans `donnees`.
- `conditions` : la version des conditions affichées.

### 4.6 `reservation`

```json
"donnees": {
  "debut": "2026-11-20T15:00:00.000Z",
  "fin": "2026-11-20T15:15:00.000Z",
  "meet": "https://meet.google.com/abc-defg-hij",
  "message": "On est sur DoorDash depuis 2 ans.",
  "google_event_id": "abc123def456"
},
"consentement": null
```
`resto.ville` vaut `null` : l'agenda ne la demande pas.

### 4.7 `dossier-releve`

```json
"donnees": {
  "lien_dossier": "https://www.restoaction.ca/dossier-associe?d=eyJyZWxldmUiOnsi…",
  "releve": { "plateforme": "doordash", "periodeJours": 30, "nbLivraison": 140, "nbCueillette": 27, "ventes": 5000, "commissions": 1250, "autresFrais": 0 },
  "hypotheses": { "partApp": 0.6, "prixAjustes": false, "nouvellesCommandes": 40, "aliments": 0.3, "tauxCueilletteUber": 0.1 }
},
"consentement": {
  "texte": "J'accepte de recevoir des textos de Resto Action.",
  "coche": true,
  "horodatage": "2026-11-18T14:32:07-05:00"
}
```
- `releve` et `hypotheses` : les objets de `src/lib/calcul.ts` (types `Releve` et `Hypotheses`), tels quels. Si ces types gagnent une clé, elle apparaît ici sans changement de version.
- `consentement` est **facultatif** ici : `coche` peut être `false`.
- `contact` : le cellulaire **ou** le courriel (un des deux suffit).

### 4.8 `contact`

La maquette gratuite :
```json
"donnees": { "demande": "maquette", "menu": "https://pizzeriaducoin.ca/menu", "adresse": "123 rue Principale, Shawinigan" },
"consentement": null
```

L'ancien formulaire de références (`/en/referrals`) :
```json
"donnees": {
  "demande": "programme de références (ancien formulaire)",
  "profil": "Fournisseur",
  "entreprise": "Friteuses Mauricie",
  "region": "Mauricie",
  "resto_en_tete": "Pizzeria du Coin, Shawinigan",
  "consentement_refere": true
},
"consentement": { "texte": "I agree that Resto Action may contact me about the referral program.", "coche": true, "horodatage": "2026-11-18T14:32:07-05:00" }
```
Pour ce formulaire, `resto.nom` est ce que la personne a écrit dans « Resto ou entreprise ».

## 5. Ce qui s'ajoute aux 2 POST existants

`signalerReservation` (`CRM_INGESTION_URL`) et `signalerFondateur` (`CRM_FONDATEUR_URL`) gardent toutes leurs clés. **Une clé s'ajoute, facultative : `lead`**, avec le lead complet de la section 3.

```json
{
  "type": "fondateur",
  "etape": "reservation",
  "prospect": { "nom": "Marie Tremblay", "courriel": "marie@pizzeriaducoin.ca", "telephone": "(819) 555-0100", "restaurant": "Pizzeria du Coin", "ville": "Shawinigan", "langue": "fr" },
  "app": { "menu": "…", "service": "livraison+cueillette" },
  "qualification": { "plateformes": "doordash", "commandes": "50 à 150" },
  "reservation": { "consentementTextos": false, "conditions": "2026-11-18" },
  "provenance": { "source": "facebook", "medium": "cpc", "page": "/" },
  "reference": { "code": "CHEZTI", "type": "client", "nom": "Chez Ti-Jean", "representant": null, "source": "lien", "premier_contact": "2026-11-02T14:10:00.000Z" },
  "lead": { "id": "…", "version": 1, "type": "lead", "source": "reserve-ta-place", "…": "…" }
}
```

- Le CRM peut ignorer `lead` : rien ne casse.
- S'il la lit, il y trouve ce que les anciennes clés n'ont pas : l'`id` (idempotence), le texte et l'heure du consentement, la page du formulaire et la `cle_resto`.
- **Nouveau** : la clé `reference` voyage maintenant dans **tous** les envois à `CRM_FONDATEUR_URL` (le Calcul, le Classement, le Studio, le dossier, la maquette), plus seulement dans la réservation.
- `prospect.telephone` reste comme chaque route l'écrit aujourd'hui (souvent « (819) 555-0100 »). Le format à 10 chiffres est dans `lead.contact.cellulaire`.

## 6. Le code de référence et les leads

- **Le code voyage avec tous les leads**, peu importe l'outil : `provenance.reference`. La règle n'a pas changé : un témoin de 30 jours, et le premier contact gagne.
- **Un référent peut envoyer un resto droit à un outil** : `/p/CODE?vers=calcul`, `?vers=classement` ou `?vers=studio` (pareil pour `/f/CODE`). Le site pose le code, puis mène à l'outil. Sans `vers`, rien ne change. Un code inconnu est ignoré en silence.
- **Un lead qui porte un code compte comme une référence par lien.** En plus du lead, le site envoie `reference.attribuee` à `CRM_REFERENCES_URL` (si elle est posée), **une seule fois par resto** : l'`id` de cet événement est tiré du code et de la `cle_resto`, donc le même resto qui remplit le Calcul puis le Classement produit deux fois le même `id`, et le CRM ignore le 2e. Voir `docs/references-contrat-crm.md`, section 2.2.
- **Aucun crédit ni commission n'est promis ou calculé par le site.** Les règles de « Réfère un resto » ne changent pas : c'est le CRM (et Guillaume) qui tranche les doublons et l'attribution.
- Sans CRM des références, aucun courriel séparé ne part : l'alerte [Lead] porte « Référé par {nom} ({type}) » et la ligne « À vérifier dans le CRM : doublon? ».

## 7. Ce que le site attend du CRM

1. **Garder l'`id` et refuser les doublons** : contrainte unique sur `id`, `200 { "deja_recu": true }` pour un `id` déjà reçu.
2. **Garder le lead en entier** (une colonne `jsonb` suffit), en plus des colonnes utiles : source, horodatage, contact, resto, `cle_resto`.
3. **Garder le consentement tel quel** : le texte exact, cochée ou non, la date et l'heure. C'est la preuve.
4. **Garder la provenance** : la page, les UTM, le site d'origine et le code de référence.
5. **Décider de la fusion** avec `cle_resto` et `resto.google_place_id` : un même resto qui fait le Calcul, le Classement et le Studio doit pouvoir finir sur une seule fiche, avec ses 3 leads. Le site, lui, ne fusionne rien.
6. **Répondre en moins de 10 secondes**, par un code `2xx` quand c'est accepté.
7. **Ne rien envoyer au resto de lui-même** à la réception d'un lead : ni texto, ni courriel. C'est Guillaume qui écrit.
8. **Accepter des sources nouvelles** sans casser : une source inconnue se range telle quelle, le format de l'enveloppe ne change pas.

### Une table possible (PostgreSQL / Supabase)

```sql
create table site_leads (
  id uuid primary key,                       -- l'id du lead, créé dans le navigateur (idempotence)
  version int not null,
  source text not null,                      -- 'calcul-60', 'classement', 'studio', …
  recu_le timestamptz not null,              -- lead.horodatage
  langue text not null,
  prenom text,
  nom text,
  cellulaire text check (cellulaire ~ '^[0-9]{10}$'),
  courriel text,
  resto_nom text not null,
  ville text,
  google_place_id text,
  cle_resto text not null,
  consentement_texte text,
  consentement_coche boolean,
  consentement_le timestamptz,
  reference_code text,
  lead jsonb not null,                       -- le lead en entier
  resto_id uuid references restos(id),       -- rempli par le CRM quand il fusionne
  cree_le timestamptz not null default now()
);
create index on site_leads (cle_resto);
create index on site_leads (google_place_id);
create index on site_leads (source, recu_le desc);
```

## 8. Le courriel d'alerte

Pour chaque lead, un courriel part à l'équipe par Gmail (`src/lib/google/courriel.ts`), à l'adresse de `LEADS_COURRIEL_EQUIPE`.

- **Objet** : `[Lead] {source} : {resto}, {ville}`. Le même préfixe pour toutes les sources.
- **En haut** : 2 liens, Appeler et Texter. Texter ouvre le texto déjà écrit pour cette source (`src/lib/contenu/leads.ts`).
- **Ensuite** : tout le lead, ce que le CRM a répondu, le lien du dossier ou des photos, le consentement, la provenance, « Référé par » s'il y a lieu, et ce JSON.
- **Le visiteur voit un succès seulement si le CRM ou le courriel a pris le lead.** Sinon il voit un message honnête avec notre numéro, et le lead entier est écrit au journal du serveur (`[leads] LEAD NON TRANSMIS`).
- Aucun texto ni courriel ne part au resto depuis la porte.

## 9. Les variables (Vercel)

| Variable | Rôle | Aujourd'hui |
|---|---|---|
| `LEADS_COURRIEL_EQUIPE` | La boîte qui reçoit les alertes [Lead]. | **À poser par Guillaume.** Tant qu'elle manque : `REFERENCES_COURRIEL_EQUIPE` pour une référence, sinon `GOOGLE_SUJET`. |
| `CRM_LEADS_URL` | La route du CRM pour `calcul-60`, `classement`, `studio` et `contact`. | Vide : le courriel suffit. |
| `CRM_INGESTION_SECRET` | Le secret partagé, le même pour toutes les routes. | Inchangé. |
| `CRM_INGESTION_URL`, `CRM_FONDATEUR_URL`, `CRM_REFERENCES_URL` | Les 3 routes existantes. | Inchangées. |
