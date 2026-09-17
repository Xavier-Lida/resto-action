import { capterProvenance } from "@/lib/provenance";

/* LE PREMIER CODE QUI TOURNE DANS LE NAVIGATEUR.

   Convention de Next 16 (instrumentation-client.ts) : exécuté une fois par
   chargement complet, avant l'hydratation, et JAMAIS sur les navigations
   internes. C'est exactement ce qu'il faut pour capter la provenance : les
   UTM ne sont présents que sur l'URL d'atterrissage, et un composant React
   avec un effet aurait retourné la même question à chaque page.

   Doit rester léger — la doc veut moins de 16 ms — et ne jamais lancer :
   `capterProvenance` porte son propre try/catch. */
capterProvenance();
