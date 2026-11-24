import { expect, test } from "@playwright/test";

test("ajout au panier depuis la boutique puis retrait", async ({ page }) => {
  await page.goto("/boutique");
  await expect(page.getByText("Catalogue de démonstration")).toBeVisible();
  await page.getByRole("button", { name: /Ajouter au panier : Sérum hydratant/ }).click();
  const drawer = page.getByRole("dialog", { name: "Votre panier" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText("Sérum hydratant")).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Valider la commande" })).toBeDisabled();
  await drawer.getByRole("button", { name: "Retirer" }).click();
  await expect(drawer.getByText("Votre panier est vide")).toBeVisible();
});

test("filtres de la boutique", async ({ page }) => {
  await page.goto("/boutique?categorie=corps");
  await expect(page.getByRole("button", { name: "Corps", pressed: true })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "produit" })).toHaveText("2 produits");
  await page.getByRole("button", { name: "Tout" }).click();
  await page.getByPlaceholder("Rechercher un produit").fill("brume");
  await expect(page.getByRole("status").filter({ hasText: "produit" })).toHaveText("1 produit");
});

test("fiche produit : quantité et ajout", async ({ page }) => {
  await page.goto("/boutique/serum-hydratant-demo");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sérum hydratant");
  await expect(page.getByText("Fiche de démonstration", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Augmenter la quantité" }).click();
  await page.getByRole("button", { name: "Ajouter au panier", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Votre panier" }).locator("output")).toHaveText("2");
});

test("recherche globale", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Rechercher" }).click();
  else await page.keyboard.press("/");
  const dialog = page.getByRole("dialog", { name: "Rechercher" });
  await dialog.getByRole("searchbox").fill("massage");
  await expect(dialog.getByRole("link", { name: /Massages/ })).toBeVisible();
});

test("demande de rendez-vous : jamais présentée comme confirmée", async ({ page }) => {
  await page.goto("/soins/reservation?famille=visage");
  await expect(page.getByRole("radio", { name: /Soins du visage/ })).toBeChecked();
  await page.getByRole("button", { name: /Continuer/ }).click();
  await page.getByRole("button", { name: /Continuer/ }).click();
  await expect(page.getByText("Indiquez une date souhaitée.")).toBeVisible();
  const future = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  await page.getByLabel("Date souhaitée").fill(future);
  await page.getByLabel("Moment de la journée").selectOption("matin");
  await page.getByRole("button", { name: /Continuer/ }).click();
  await page.getByLabel("Prénom").fill("Awa");
  await page.getByLabel("Téléphone (WhatsApp)").fill("+225 07 00 00 00 00");
  await page.getByLabel(/J'accepte d'être recontacté/).check();
  await page.getByRole("button", { name: /Préparer ma demande/ }).click();
  await expect(page.getByText("elle n'est pas encore envoyée")).toBeVisible();
  const link = page.getByRole("link", { name: /Envoyer au \+225 07 11 11 18 28/ });
  await expect(link).toHaveAttribute("href", /^https:\/\/wa\.me\/2250711111828\?text=.*Soins%20du%20visage/);
});

test("le design system n'est pas exposé en production", async ({ page }) => {
  const response = await page.goto("/design-system");
  expect(response?.status()).toBe(404);
});

test("pages principales accessibles", async ({ page }) => {
  for (const path of ["/soins", "/institut", "/actualites", "/contact", "/mentions-legales", "/confidentialite", "/compte"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});
