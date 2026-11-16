// Recorre la transición del hero (cristal WebGL) y guarda capturas por etapa.
// Uso: LENS_URL=http://localhost:4173/ node scripts/verify_lens_glass.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'artifacts', 'lens-glass');
const url = process.env.LENS_URL ?? 'http://localhost:4173/';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'],
});

try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.locator('#preloader.hidden').waitFor({ state: 'attached', timeout: 15_000 });
    const glReady = name === 'desktop'
      ? await page.locator('#hero-viewport.has-lens-gl').waitFor({ state: 'attached', timeout: 20_000 }).then(() => true, () => false)
      : false;
    const height = await page.evaluate(() => document.getElementById('hero-viewport').offsetHeight);
    for (const step of [0, 0.2, 0.4, 0.55, 0.7, 0.85, 0.95, 1]) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(height * step));
      await page.waitForTimeout(1_100);
      await page.screenshot({ path: path.join(output, `${name}-${String(Math.round(step * 100)).padStart(3, '0')}.png`) });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1_200);
    await page.screenshot({ path: path.join(output, `${name}-back.png`) });
    console.log(JSON.stringify({ name, glReady, errors }));
    await page.close();
  }
} finally {
  await browser.close();
}
