"use client";



export function BoutonImprimer() {
  return (
    <button type="button" onClick={() => window.print()} className="no-print inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink px-6 py-3 text-base font-black transition hover:bg-ink hover:text-white">
      Imprimer ou enregistrer en PDF
    </button>
  );
}
