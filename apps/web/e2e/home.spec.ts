import { expect, test } from "@playwright/test";

const IGNORED = [/GPU stall/, /GL Driver Message/, /WebGL: /, /Automatic fallback to software WebGL/];

test("l'accueil s'affiche sans erreur console et présente les actions principales", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" && !IGNORED.some((r) => r.test(m.text()))) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Votre peau.");
  await expect(page.getByRole("link", { name: /Découvrir la boutique/ })).toHaveAttribute("href", "/boutique");
  await expect(page.getByRole("link", { name: "Réserver un soin" })).toHaveAttribute("href", "/soins/reservation");
  await expect(page.getByRole("img", { name: "Para-Institut Palm Club" }).first()).toBeVisible();
  for (const title of ["La texture, première sensation.", "Un temps pour soi.", "Chaque peau a sa lumière.", "Parlons de votre peau."]) {
    await expect(page.getByRole("heading", { name: title })).toBeAttached();
  }
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

test("aucun débordement horizontal", async ({ page }) => {
  for (const width of [360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `largeur ${width}`).toBeLessThanOrEqual(0);
  }
});

test("les numéros WhatsApp vérifiés sont présents dans le pied de page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href^="https://wa.me/2250711111828"]').first()).toBeAttached();
  await expect(page.locator('a[href^="https://wa.me/2250711111831"]').first()).toBeAttached();
});

test("sans WebGL, les visuels statiques restent affichés", async ({ page }) => {
  await page.goto("/?webgl=0");
  await page.waitForTimeout(3000);
  const hero = page.locator("section").first();
  await expect(hero.getByRole("img", { name: /goutte de matière nacrée/ })).toBeVisible();
  expect(await page.locator("[data-live]").count()).toBe(0);
});

test("rendu logiciel (sans GPU) : visuel statique, aucune animation continue", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("load");
  await page.locator("#lab-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  expect(await page.locator("[data-live]").count()).toBe(0);
});

test("avec WebGL, la scène 3D remplace le visuel de repli", async ({ page, isMobile }) => {
  // L'environnement de test n'a pas de GPU : la scène est forcée en rendu logiciel
  await page.goto("/?webgl=force");
  await page.waitForLoadState("load");
  if (isMobile) {
    // Mobile : héros statique (aucun téléchargement de Three.js au chargement)…
    await page.waitForTimeout(2500);
    expect(await page.locator("[data-live]").count()).toBe(0);
    // …la scène démarre quand le laboratoire entre dans l'écran
    await page.locator("#lab-title").scrollIntoViewIfNeeded();
  }
  await expect(page.locator("[data-live]").first()).toBeAttached({ timeout: 15_000 });
});

test("préférence « moins d'animations » : pas de défilement collant ni de scène 3D", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForTimeout(2500);
  expect(await page.locator("[data-enhanced]").count()).toBe(0);
  expect(await page.locator("[data-live]").count()).toBe(0);
  await expect(page.getByRole("heading", { name: /La parapharmacie/ })).toBeVisible();
  await context.close();
});

test("lien d'évitement vers le contenu", async ({ page, isMobile }) => {
  test.skip(isMobile, "navigation clavier testée sur ordinateur");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Aller au contenu" });
  await expect(skip).toBeFocused();
});

test("onglets du laboratoire de la matière au clavier", async ({ page, isMobile }) => {
  test.skip(isMobile, "navigation clavier testée sur ordinateur");
  await page.goto("/");
  const first = page.getByRole("tab", { name: /Sérum/ });
  await first.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("tab", { name: /Crème/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Crème");
});
