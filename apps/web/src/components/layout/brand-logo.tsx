import Image from "next/image";

/**
 * Logo officiel (logo_para.jpg, 1418 × 1072, fond turquoise #009a96, jamais modifié).
 * Toujours posé sur une surface de la même couleur : le fond du fichier s'y fond.
 */
export function BrandLogo({ width, priority, className }: { width: number; priority?: boolean; className?: string }) {
  return (
    <Image
      src="/brand/logo_para.jpg"
      alt="Para-Institut Palm Club"
      width={1418}
      height={1072}
      priority={priority}
      sizes={`${width}px`}
      className={className}
      style={{ width, height: "auto" }}
    />
  );
}
