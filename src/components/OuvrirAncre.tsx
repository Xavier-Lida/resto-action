"use client";

import { useEffect } from "react";

/* Un lien vers une question de FAQ (#faq-…) doit l'ouvrir, même rangée sous
   « Voir toutes les questions » : on ouvre la question et chaque `details`
   parent, puis on y descend. */
function ouvrir() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const cible = document.getElementById(id);
  if (!(cible instanceof HTMLDetailsElement)) return;
  for (let el: HTMLElement | null = cible; el; el = el.parentElement) {
    if (el instanceof HTMLDetailsElement) el.open = true;
  }
  cible.scrollIntoView({ block: "start" });
}

export default function OuvrirAncre() {
  useEffect(() => {
    ouvrir();
    window.addEventListener("hashchange", ouvrir);
    return () => window.removeEventListener("hashchange", ouvrir);
  }, []);
  return null;
}
