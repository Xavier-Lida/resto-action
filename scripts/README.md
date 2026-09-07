# scripts

## `preparer-demo-app.mjs`

Fabrique les assets des démos animées de la section « Nos produits » —
`public/demo-app/<démo>/` et `src/lib/demo-app-geometrie.ts` — à partir des
captures brutes.

```sh
node scripts/preparer-demo-app.mjs             # captures lues dans ~/Downloads
SOURCE=/chemin/vers/les/captures node scripts/preparer-demo-app.mjs
QUALITE=70 node scripts/preparer-demo-app.mjs  # si le total dépasse 400 Ko
```

Une démo peut déclarer son propre dossier (`source`, relatif à la racine du
site) : c'est le cas de Resto Go, dont les captures vivent dans
`scripts/captures/livreur/` (gitignoré). Les autres lisent `SOURCE`.

Une démo dont les captures manquent **garde** son entrée dans
`demo-app-geometrie.ts` : relancer le script pour une seule app n'efface pas
les autres du site.

Après chaque exécution, **relire les PNG de `scripts/.demo-verif/<démo>/`** :
ce sont les assemblages en pleine résolution. Pour l'app cliente, les compteurs
de section du menu en sont le contrôle — PANUOZZO 6, MAKLOUB 5, PUCCIA 5. Si un
plat est dupliqué ou tronqué, c'est un raccord qui a mal tourné.

Le script refuse de continuer quand une corrélation est douteuse : une capture
remplacée par une autre qui ne recouvre pas la précédente fait échouer
l'exécution plutôt que d'écrire une image fausse.

### Ajouter une démo

Seules les apps déclarées dans `DEMOS` sont préparées, et **une démo dont les
captures manquent est sautée avec un avertissement, pas une erreur** — une
entrée peut donc rester en place avant que les photos existent. Côté site, toute
démo sans assets affiche un cadre d'attente, qui s'efface de lui-même dès que
le script produit les fichiers.

Pour Resto Action, le jour venu :

1. déposer les captures dans le dossier source ;
2. remplir l'entrée `cuisine` de `DEMOS` — `livreur` sert de modèle. La boîte
   `pilule` se mesure sur la capture dont le fond **derrière** la barre est
   uni : c'est la seule où la silhouette est calculable. Mettre `pilule: null`
   si l'app n'a pas de barre flottante ;
3. ajouter la timeline correspondante à `TIMELINES`, en haut de
   `src/components/DemoApp.tsx` ;
4. relancer le script, puis relire le PNG de vérification.

### Refaire les captures de Resto Go

Les captures actuelles (7 septembre 2026) viennent de l'iPhone de Xavier,
prises à la main sur le compte livreur de démo. La voie automatisée ci-dessous
est écrite mais n'a pas encore tourné : ce jour-là, aucun simulateur iPhone
neuf n'a fini de démarrer sur le Mac.

Elle sort du simulateur iOS, pas d'un téléphone. Le parcours est joué par
`integration_test/captures_site_test.dart` dans le dépôt `resto-action-livraison`,
contre le vrai backend de test ; à chaque état, l'app pose un marqueur dans son
conteneur et attend qu'un script hôte prenne la capture pleine
(`xcrun simctl io <udid> screenshot`, barre d'état comprise) et l'efface. À
l'état « en attente », ce même script sème l'offre avec
`API_URL=https://api-test.restoaction.ca node outils/seeder-offre.mjs` — le
livreur doit déjà être en ligne, sinon l'offre n'est réservée à personne — et
dépose le code de remise dans `tmp/captures/code`.

Prendre un simulateur **iPhone 17e** (1170 × 2532, le format attendu ; l'iPhone
17 fait 1206 × 2622), fixer sa barre d'état, purger les courses fantômes du
livreur démo, puis lancer :

```sh
xcrun simctl status_bar <udid> override --time 9:41 --dataNetwork wifi --wifiMode active \
  --wifiBars 3 --cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100
node outils/seeder-demo.mjs
node outils/nettoyer-demo.mjs --garder-livrees --confirmer
flutter test integration_test/captures_site_test.dart -d <udid> \
  --dart-define=GUIDAGE_AUTO=false --dart-define=POSITION_SIMULEE=46.3432,-72.5430
```

Le script hôte tient en une boucle : `xcrun simctl get_app_container <udid>
com.restoaction.livraison data` donne le conteneur, `tmp/captures/<nom>` y
apparaît, capture vers `scripts/captures/livreur/<nom>.png`, suppression du
marqueur ; `fin` termine.

Les mesures codées en dur (bandes 141 / 2190, découpe du logo) valent pour des
captures iPhone @3x de 1170 × 2532. Un autre appareil demande de les reprendre.

## `verifier-categories.sh`

Voir l'en-tête du fichier.
