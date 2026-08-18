/* Le bloc JSON-LD, écrit une fois.

   Il était recopié dans Accueil, PageContact et PageConfidentialite, avec à
   chaque fois le même `dangerouslySetInnerHTML` et le même échappement des
   chevrons. Trois copies, c'est déjà deux occasions d'en corriger une seule ;
   avec les pages de plateforme et les articles à venir, ç'aurait été quinze.

   POURQUOI L'ÉCHAPPEMENT. Le contenu d'un `script` n'est pas du HTML : le
   navigateur y cherche la suite `</script`, et la trouve n'importe où, même au
   milieu d'une chaîne JSON. Un texte contenant `</script>` couperait donc la
   balise en deux et le reste du JSON tomberait dans la page. Échapper chaque
   `<` en `\u003c` règle le cas — le JSON reste valide, la balise reste entière. */
export default function DonneesStructurees({ json }: { json: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(json).replace(/</g, "\\u003c"),
      }}
    />
  );
}
