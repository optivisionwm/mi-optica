import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';


const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const artifactDirectory = path.join(repositoryRoot, 'artifacts', 'logo-3d');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = process.env.LOGO_3D_URL ?? 'http://127.0.0.1:5174/logo-3d-preview.html';


async function verifyViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('.status-ready').waitFor({ timeout: 15_000 });
  await page.waitForTimeout(750);

  const canvas = page.locator('.viewer-canvas canvas');
  const frameOne = await canvas.screenshot();
  await page.waitForTimeout(1_200);
  const frameTwo = await canvas.screenshot();
  const frameOneHash = crypto.createHash('sha256').update(frameOne).digest('hex');
  const frameTwoHash = crypto.createHash('sha256').update(frameTwo).digest('hex');
  const animationChanged = frameOneHash !== frameTwoHash;

  await page.getByRole('button', { name: 'Pausar giro' }).click();
  await page.getByRole('button', { name: 'Restablecer vista' }).click();
  await page.waitForTimeout(250);

  const layout = await page.evaluate(() => {
    const toolbar = document.querySelector('.preview-toolbar').getBoundingClientRect();
    const status = document.querySelector('.preview-status').getBoundingClientRect();
    const canvasBounds = document.querySelector('canvas').getBoundingClientRect();
    const buttons = [...document.querySelectorAll('button, .icon-button')].map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    });

    return {
      bodyHasHorizontalOverflow: document.body.scrollWidth > document.documentElement.clientWidth,
      canvasSize: { width: canvasBounds.width, height: canvasBounds.height },
      controlsInsideViewport: buttons.every((rect) =>
        rect.left >= 0 && rect.right <= window.innerWidth && rect.top >= 0 && rect.bottom <= window.innerHeight
      ),
      toolbarStatusOverlap: !(
        toolbar.bottom <= status.top ||
        status.bottom <= toolbar.top ||
        toolbar.right <= status.left ||
        status.right <= toolbar.left
      ),
      hasWebGl: Boolean(document.querySelector('canvas').getContext('webgl2')),
      selectedLabel: document.querySelector('.part-selector .is-active')?.textContent?.trim(),
    };
  });

  await page.screenshot({ path: path.join(artifactDirectory, `${name}.png`), fullPage: true });

  const renderedParts = [];
  if (name === 'desktop') {
    for (const part of ['Gafas', 'Optivision', 'W&M']) {
      await page.getByRole('button', { name: part, exact: true }).click();
      await page.locator('.status-ready').waitFor({ timeout: 15_000 });
      await page.waitForTimeout(250);
      const partScreenshot = await canvas.screenshot({
        path: path.join(artifactDirectory, `desktop-${part.toLowerCase().replace('&', 'm')}.png`),
      });
      renderedParts.push({ part, screenshotBytes: partScreenshot.length });
    }
  }
  await page.close();

  return {
    name,
    viewport,
    animationChanged,
    consoleErrors,
    pageErrors,
    renderedParts,
    ...layout,
  };
}


await fs.mkdir(artifactDirectory, { recursive: true });
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'],
});

try {
  const results = [];
  results.push(await verifyViewport(browser, 'desktop', { width: 1440, height: 900 }));
  results.push(await verifyViewport(browser, 'mobile', { width: 390, height: 844 }));
  await fs.writeFile(
    path.join(artifactDirectory, 'verification.json'),
    `${JSON.stringify(results, null, 2)}\n`,
    'utf8',
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
