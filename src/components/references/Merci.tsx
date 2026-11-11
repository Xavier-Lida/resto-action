import { Check } from "lucide-react";

export default function Merci({ texte }: { texte: string }) {
  return (
    <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-ink/5 md:p-12" role="status">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-ciel text-white shadow-[0_0_0_6px_rgba(25,211,240,0.25)]">
        <Check className="size-7" aria-hidden="true" />
      </span>
      <p className="mx-auto mt-6 max-w-md font-display text-xl font-black md:text-2xl">{texte}</p>
    </div>
  );
}
