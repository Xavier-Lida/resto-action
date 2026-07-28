# Resto Action — site vitrine

Landing page de [Resto Action](https://restoaction.ca) : entreprise québécoise au service des restaurants indépendants. On écoute les restaurateurs pis on règle leurs vrais problèmes. Un produit de Studios LT, Trois-Rivières.

Stack : Next.js 16 (App Router), Tailwind CSS v4, TypeScript.

## Développement

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # vérifier avant de déployer
```

Toutes les coordonnées (URL, téléphone, courriel) sont centralisées dans `src/lib/site.ts` — c'est le seul fichier à modifier pour les changer partout.

## TODO avant le déploiement

- [ ] Acheter **restoaction.ca** et **resto-action.ca** ; configurer resto-action.ca en redirection 308 vers restoaction.ca (réglages de domaine Vercel, pas de code).
- [ ] Migrer le courriel vers `contact@restoaction.ca` quand l'adresse existera (une ligne dans `src/lib/site.ts`).
- [ ] Confirmer la cohérence entre « concours de l'École d'entrepreneurship de Beauce » (texte) et le certificat « Défi CEED 2026 » (photo) ; ajouter un lien vers l'article s'il existe.
- [ ] Valider que la phrase « restos pilotes » reste vraie tant que la certification gouvernementale n'est pas obtenue.
- [ ] Vérifier que le lien de source (Restaurants Canada) affiche toujours les marges citées (3 à 9 %).
- [ ] Après le build : vérifier `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/icon.svg`, `/apple-icon`, `/llms.txt` ; valider le JSON-LD sur https://validator.schema.org/ et le test de résultats enrichis Google.
- [ ] Soumettre le sitemap à Google Search Console et Bing Webmaster Tools.

## Notes de marque

- Couleurs : `--color-brand: #ff3008` (⚠️ c'est le rouge exact de DoorDash — assumé pour l'instant, sujet à changement ; il ne vit qu'en variable CSS dans `globals.css`, plus en dur dans `public/logo.svg`, `public/logo-dark.svg` et `src/components/Buoy.tsx`).
- Typo : stack système Helvetica/Arial (volontaire — pas de webfont) + Caveat (manuscrite) pour les accents.
- Logos : `logo.svg` (fond transparent, surfaces claires) et `logo-dark.svg` (surfaces sombres, utilisé dans le footer).
- Analytics : Vercel Analytics (sans témoins, divulgué dans `/confidentialite` — pas de bandeau de consentement requis).
