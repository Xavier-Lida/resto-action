"use client";

import { useState } from "react";
import { preconnect } from "react-dom";
import Image from "next/image";
import { Play } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";
import { noterVideoVue } from "@/lib/provenance";

/* UNE VIDÉO YOUTUBE QUI NE COÛTE RIEN TANT QU'ON NE LA REGARDE PAS.

   L'iframe de YouTube, posée telle quelle, fait venir près d'un mégaoctet de
   JavaScript, une dizaine de requêtes et les témoins de Google DÈS LE
   CHARGEMENT de la page — pour une vidéo que la plupart des visiteurs ne
   lanceront pas. Ici, tant que personne n'appuie sur lecture, il n'y a qu'une
   image servie par nous et un lien. L'iframe n'est montée qu'au clic : avant,
   la page ne demande strictement rien à Google.

   C'EST UN LIEN, PAS UN BOUTON. Sans JavaScript (ou avant l'hydratation), le
   clic mène à la vidéo sur YouTube au lieu de ne rien faire ; et un robot y
   trouve une adresse à suivre. Avec JavaScript, le clic est intercepté et la
   vidéo joue sur place.

   youtube-nocookie.com : le mode de confidentialité renforcée de YouTube, qui
   ne dépose rien avant la lecture. C'est ce que la politique de
   confidentialité promet — les deux se changent ensemble.

   La boîte a son rapport 16:9 dès le HTML (`aspect-video`) : ni l'image ni
   l'iframe ne déplacent quoi que ce soit en arrivant. */

const ORIGINE = "https://www.youtube-nocookie.com";

export default function LecteurVideo({
  id,
  miniature,
  titre,
  lire,
  langue,
}: {
  id: string;
  miniature: string;
  /** Le `title` de l'iframe : ce qu'un lecteur d'écran annonce du lecteur. */
  titre: string;
  /** Le nom accessible du lien de lecture. */
  lire: string;
  /** La langue de la PAGE (`fr-CA`, `en-CA`), pour l'interface du lecteur. */
  langue: string;
}) {
  const [lance, setLance] = useState(false);
  const hl = langue.slice(0, 2);

  if (lance) {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      playsinline: "1",
      hl,
    });
    /* La vidéo est en français. Sur la page anglaise, on demande à YouTube
       d'afficher des sous-titres anglais s'il en a ; s'il n'en a pas, le
       paramètre est sans effet. */
    if (hl !== "fr") {
      params.set("cc_load_policy", "1");
      params.set("cc_lang_pref", hl);
    }
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
        <iframe
          /* Le focus suit le clic : sans ça, il resterait sur un lien qui
             vient de disparaître, et le clavier repartirait du haut de page. */
          ref={(el) => el?.focus()}
          src={`${ORIGINE}/embed/${id}?${params}`}
          title={titre}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          /* Exigé par YouTube : sans referrer, le lecteur refuse de jouer
             (erreur 153). */
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      </div>
    );
  }

  /* La connexion s'ouvre quand l'intention se dessine — la souris arrive, le
     clavier s'arrête dessus — et pas avant : la poignée de main TLS est faite
     quand le clic tombe, sans que le chargement de la page l'ait payée. */
  const prechauffer = () => preconnect(ORIGINE);

  return (
    <a
      href={`https://youtu.be/${id}`}
      aria-label={lire}
      onPointerEnter={prechauffer}
      onFocus={prechauffer}
      onClick={(e) => {
        // Clic du milieu, Cmd/Ctrl-clic : la personne veut YouTube dans un
        // autre onglet, on la laisse faire.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        noterVideoVue(id);
        try {
          sendGAEvent("event", "video_lecture", { video_id: id });
        } catch {
          // Mesure bloquée : la vidéo joue quand même.
        }
        setLance(true);
      }}
      className="group relative block aspect-video overflow-hidden rounded-2xl bg-black outline-offset-4"
    >
      <Image
        draggable={false}
        src={miniature}
        alt=""
        fill
        sizes="(min-width: 1024px) 660px, 100vw"
        className="object-cover transition duration-500 group-hover:scale-[1.02]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center bg-ink/10 transition-colors group-hover:bg-ink/0"
      >
        <span className="grid size-16 place-items-center rounded-full bg-brand text-white shadow-lg transition group-hover:scale-110 group-active:scale-95 md:size-20">
          <Play className="size-7 translate-x-0.5 fill-current md:size-9" />
        </span>
      </span>
    </a>
  );
}
