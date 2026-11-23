/* heic-convert n'a pas de types : voici la seule forme qu'on utilise
   (src/lib/studio/moteur-sharp.ts). */
declare module "heic-convert" {
  export default function convert(options: {
    buffer: Buffer | Uint8Array | ArrayBuffer;
    format: "JPEG" | "PNG";
    /** Entre 0 et 1, pour le JPEG. */
    quality?: number;
  }): Promise<ArrayBuffer>;
}
