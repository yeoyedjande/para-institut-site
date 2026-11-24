import { MatterStill } from "./still";

/** Studio de rendu des visuels de repli (scripts/render-posters.mjs). */
export default async function MatterStudio({ searchParams }: { searchParams: Promise<{ texture?: string }> }) {
  const { texture = "perle" } = await searchParams;
  return <MatterStill texture={texture} />;
}
