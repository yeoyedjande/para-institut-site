import { preload } from "react-dom";
import { POSTERS, type TextureKey } from "@/components/matter/textures";

/** Image fixe d'une texture (rendue depuis la scène 3D), en AVIF/WebP responsives. */
/** Précharge un visuel candidat au LCP (AVIF, haute priorité) : découvert dès l'en-tête HTML. */
export function preloadPoster(texture: TextureKey, sizes: string) {
  const base = POSTERS[texture];
  preload(`${base}-1200.avif`, { as: "image", type: "image/avif", fetchPriority: "high", imageSrcSet: `${base}-640.avif 640w, ${base}-1200.avif 1200w`, imageSizes: sizes });
}

export function Poster({ texture, alt, className, sizes = "(max-width: 768px) 80vw, 40vw", eager }: { texture: TextureKey; alt: string; className?: string; sizes?: string; eager?: boolean }) {
  const base = POSTERS[texture];
  if (eager) preloadPoster(texture, sizes);
  return (
    <picture className={className}>
      <source srcSet={`${base}-640.avif 640w, ${base}-1200.avif 1200w`} type="image/avif" sizes={sizes} />
      <source srcSet={`${base}-640.webp 640w, ${base}-1200.webp 1200w`} type="image/webp" sizes={sizes} />
      <img src={`${base}-1200.webp`} alt={alt} width={1200} height={1200} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" />
    </picture>
  );
}
