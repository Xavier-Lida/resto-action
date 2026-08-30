// Généré par scripts/preparer-demo-app.mjs — ne pas éditer à la main.
// Hauteurs en pixels de l'image, dans le repère 780 px de large.
export const GEOMETRIE = {
  "client": {
    "largeur": 780,
    "ecrans": {
      "accueil": {
        "hauteur": 1859,
        "tabbar": true
      },
      "menu": {
        "hauteur": 4541,
        "tabbar": true
      },
      "compte": {
        "hauteur": 1848,
        "tabbar": true
      },
      "panier": {
        "hauteur": 1594,
        "tabbar": false
      }
    },
    "tabbar": 228,
    "statusbar": 94,
    "contenu": 1366,
    "logo": true
  }
} as const;

export type Demo = keyof typeof GEOMETRIE;
