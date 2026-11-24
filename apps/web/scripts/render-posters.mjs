/**
 * Rend les visuels de repli de la scène « matière » depuis le studio /design-system/matiere
 * (serveur de développement requis), puis les encode en AVIF et WebP (640 et 1200 px, transparence).
 *
 *   pnpm --filter @para/web dev   # dans un autre terminal
 *   node scripts/render-posters.mjs [http://localhost:3000]
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../public/media/matter");
const base = process.argv[2] ?? "http://localhost:3000";
const textures = ["perle", "serum", "creme", "gel", "huile"];

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 800, height: 800 }, deviceScaleFactor: 2 });

for (const texture of textures) {
  await page.goto(`${base}/design-system/matiere?texture=${texture}`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html,body{background:transparent!important} header,footer,#menu-mobile,.skip-link{display:none!important}" });
  await page.waitForFunction(() => document.querySelector("#still [data-live]") !== null, null, { timeout: 30000 });
  await page.waitForTimeout(300);
  const png = await page.locator("#still").screenshot({ omitBackground: true });
  for (const size of [640, 1200]) {
    const img = sharp(png).resize(size, size);
    await img.clone().webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(path.join(out, `${texture}-${size}.webp`));
    await img.clone().avif({ quality: 55, effort: 6 }).toFile(path.join(out, `${texture}-${size}.avif`));
  }
  console.log(`✓ ${texture}`);
}
await browser.close();
