import type { NextRequest } from "next/server";
import { traiterLienReference } from "@/lib/references/lien";

/* Lien court de « Réfère un resto ». Tout se passe dans src/lib/references/lien.ts. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(requete: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return traiterLienReference(requete, code);
}
