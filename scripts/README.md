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

Pour Resto Action ou Resto Go, le jour venu :

1. déposer les captures dans le dossier source ;
2. remplir l'entrée `cuisine` (ou `livreur`) de `DEMOS` — le gabarit est en
   commentaire juste en dessous de `client`. La boîte `pilule` se mesure sur la
   capture dont le fond **derrière** la barre est uni : c'est la seule où la
   silhouette est calculable. Mettre `pilule: null` si l'app n'a pas de barre
   flottante ;
3. ajouter la timeline correspondante à `TIMELINES`, en haut de
   `src/components/DemoApp.tsx` ;
4. relancer le script, puis relire le PNG de vérification.

Les mesures codées en dur (bandes 141 / 2190, découpe du logo) valent pour des
captures iPhone @3x de 1170 × 2532. Un autre appareil demande de les reprendre.

## `verifier-categories.sh`

Voir l'en-tête du fichier.
