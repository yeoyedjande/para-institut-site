import { formatXof, type Product } from "@para/contracts";
import type { TextureKey } from "@/components/matter/textures";

export const AVAILABILITY_TONE = { IN_STOCK: "success", LOW_STOCK: "warning", OUT_OF_STOCK: "neutral", ON_REQUEST: "brand" } as const;

/** Les familles « baume » et « brume » réutilisent les visuels les plus proches. */
export function textureVisual(texture: Product["texture"]): TextureKey {
  if (texture === "baume") return "creme";
  if (texture === "brume") return "gel";
  return texture;
}

export function priceLabel(product: Pick<Product, "priceXof">): string {
  return product.priceXof === null ? "Prix communiqué en boutique" : formatXof(product.priceXof);
}
