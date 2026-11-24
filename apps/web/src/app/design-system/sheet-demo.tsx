"use client";

import { useState } from "react";
import { Button, Sheet } from "@para/ui";

export function SheetDemo() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <Button variant="secondary" onClick={() => setModal(true)}>
        Ouvrir une modale
      </Button>
      <Button variant="secondary" onClick={() => setDrawer(true)}>
        Ouvrir un tiroir
      </Button>
      <Sheet open={modal} onClose={() => setModal(false)} title="Modale">
        <p>Focus piégé, fermeture par Échap ou clic sur l&apos;arrière-plan, focus restitué.</p>
      </Sheet>
      <Sheet open={drawer} onClose={() => setDrawer(false)} title="Tiroir" variant="drawer" footer={<Button block onClick={() => setDrawer(false)}>Fermer</Button>}>
        <p>Utilisé pour le panier et les filtres mobiles.</p>
      </Sheet>
    </div>
  );
}
