/**
 * Captures de contrôle qualité visuel (docs/quality/VISUAL_QA_REPORT.md).
 * Prérequis : build de production servi sur BASE (pnpm build && pnpm start --port 3100).
 *   node scripts/qa-screenshots.mjs [http://127.0.0.1:3100]
 * - pleine page, préférence « moins d'animations » (sections empilées, visuels de repli) : 6 résolutions
 * - captures ciblées avec animations et WebGL (SwiftShader) : héros, transition des univers, laboratoire
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../../../docs/quality/screenshots");
const base = process.argv[2] ?? "http://127.0.0.1:3100";
const VIEWPORTS = [
  [360, 800],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
];
const IGNORED = [/GPU stall/, /GL Driver Message/, /WebGL: /, /software WebGL/];

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const report = [];

async function save(buffer, name, width) {
  const file = path.join(out, `${name}.webp`);
  await sharp(buffer).resize({ width: Math.min(width, 1440), withoutEnlargement: true }).webp({ quality: 72 }).toFile(file);
  return path.basename(file);
}

async function settle(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

for (const [width, height] of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && !IGNORED.some((r) => r.test(m.text())) && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of ["/", "/boutique", "/boutique/serum-hydratant-demo", "/soins", "/soins/reservation"]) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    await settle(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const slug = route === "/" ? "accueil" : route.slice(1).replaceAll("/", "_");
    const file = await save(await page.screenshot({ fullPage: true }), `${slug}-${width}x${height}`, width);
    report.push({ route, viewport: `${width}x${height}`, overflow, file });
  }
  report.push({ viewport: `${width}x${height}`, consoleErrors: errors });
  await context.close();
}

// Captures ciblées avec animations et WebGL
for (const [width, height] of [
  [1440, 900],
  [390, 844],
]) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  // Sans GPU dans l'environnement de QA, la scène est forcée (rendu logiciel)
  await page.goto(base + "/?webgl=force", { waitUntil: "networkidle" });
  await page.waitForSelector("[data-live]", { timeout: 20000 }).catch(() => null);
  await page.waitForTimeout(1200);
  await save(await page.screenshot(), `motion-hero-${width}`, width);
  const top = await page.evaluate(() => {
    const el = document.querySelector('[aria-labelledby="univers-title"]');
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
  const span = await page.evaluate(() => {
    const el = document.querySelector('[aria-labelledby="univers-title"]');
    return el ? el.offsetHeight - window.innerHeight : 0;
  });
  for (const [label, ratio] of [
    ["institut", 0.05],
    ["transition", 0.5],
    ["parapharmacie", 0.9],
  ]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(top + span * ratio));
    await page.waitForTimeout(700);
    await save(await page.screenshot(), `motion-univers-${label}-${width}`, width);
  }
  await page.locator("#lab-title").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -60));
  await page.waitForTimeout(2500);
  await save(await page.screenshot(), `motion-lab-serum-${width}`, width);
  await page.getByRole("tab", { name: /Huile/ }).click();
  await page.waitForTimeout(2200);
  await save(await page.screenshot(), `motion-lab-huile-${width}`, width);
  await context.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 1));
