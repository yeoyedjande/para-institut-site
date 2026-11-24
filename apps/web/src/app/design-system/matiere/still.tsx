"use client";

import { MatterCanvas } from "@/components/matter/matter-canvas";
import { MATERIALS, type TextureKey } from "@/components/matter/textures";

export function MatterStill({ texture }: { texture: string }) {
  const key = (texture in MATERIALS ? texture : "perle") as TextureKey;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "grid", placeItems: "center", background: "transparent" }}>
      <div id="still" style={{ width: 600, height: 600 }}>
        <MatterCanvas texture={key} still interactive={false} alt="" />
      </div>
    </div>
  );
}
