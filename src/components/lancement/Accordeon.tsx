"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/** Accordéon sur cellulaire; toujours ouvert sur ordinateur. */
export function Accordeon({
  titre,
  ouvert = false,
  children,
}: {
  titre: string;
  ouvert?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(ouvert);
  return (
    <div className="rounded-3xl bg-bone md:rounded-none md:bg-transparent">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:pointer-events-none md:px-0 md:py-0"
      >
        <h3 className="font-display text-xl font-black leading-tight md:text-2xl">{titre}</h3>
        <ChevronDown
          className={`size-6 shrink-0 transition-transform md:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`${open ? "block" : "hidden"} px-5 pb-5 md:block md:px-0 md:pb-0`}>{children}</div>
    </div>
  );
}
