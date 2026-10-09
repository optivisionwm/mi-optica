import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const output = path.resolve('artifacts/mobile-transition');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--enable-unsafe-swiftshader'],
});
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

try {
  for (const width of [320, 390, 430]) {
    const page = await browser.newPage({
      viewport: { width, height: 744 }, isMobile: true, hasTouch: true,
    });
    await page.goto(process.env.SITE_URL || 'http://127.0.0.1:5174/', { waitUntil: 'load' });
    await page.locator('#preloader.hidden').waitFor({ state: 'attached' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 150));
    await page.waitForTimeout(1100);

    // A mobile toolbar can change height without changing width or scroll position.
    for (const height of [844, 744]) {
      await page.setViewportSize({ width, height });
      const coverage = await page.locator('#hero-viewport').evaluate(el => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, height: innerHeight };
      });
      check(coverage.top <= 1 && coverage.bottom >= height - 1,
        `${width}x${height}: immediate pin coverage ${JSON.stringify(coverage)}`);
      await page.waitForTimeout(1200);
      const settled = await page.locator('#hero-viewport').evaluate(el => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return { top: rect.top, bottom: rect.bottom, radius: parseFloat(style.getPropertyValue('--portal-radius')) };
      });
      check(settled.top <= 1 && settled.bottom >= height - 1 && settled.radius === 0,
        `${width}x${height}: next section exposed before the lens opens`);
      await page.screenshot({ path: path.join(output, `${width}x${height}-early-scroll.png`) });
    }

    await page.evaluate(() => window.scrollTo(0, innerHeight * .82));
    await page.waitForTimeout(1400);
    const portal = await page.locator('#hero-viewport').evaluate(el => {
      const style = getComputedStyle(el);
      const x = parseFloat(style.getPropertyValue('--lens-x'));
      const y = parseFloat(style.getPropertyValue('--lens-y'));
      return {
        radius: parseFloat(style.getPropertyValue('--portal-radius')),
        farthest: Math.hypot(Math.max(x, el.offsetWidth - x), Math.max(y, el.offsetHeight - y)),
      };
    });
    check(portal.radius > portal.farthest, `${width}: lens transition does not finish`);
    await page.evaluate(() => window.scrollTo(0, innerHeight * .2));
    await page.waitForTimeout(1400);
    check(await page.locator('#hero-viewport').evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue('--portal-radius')) === 0),
      `${width}: reverse scroll does not close the portal`);

    await page.evaluate(() => window.scrollTo(0, document.getElementById('quienes-somos').offsetTop - 100));
    await page.waitForTimeout(850);
    const copy = await page.locator('.qs-copy').evaluate(el => {
      const paragraphs = [...el.querySelectorAll('p')];
      const brand = el.querySelector('strong');
      const range = document.createRange();
      range.selectNodeContents(brand);
      return {
        paragraphs: paragraphs.map(p => p.textContent.trim()),
        brandLines: new Set([...range.getClientRects()].map(r => Math.round(r.top))).size,
        whiteSpace: getComputedStyle(brand).whiteSpace,
        width: document.documentElement.scrollWidth,
      };
    });
    check(copy.paragraphs.length >= 2 && copy.paragraphs[1].startsWith('En Optivisión W&M'),
      `${width}: company introduction must start a separate paragraph`);
    check(copy.brandLines === 1 && copy.whiteSpace === 'nowrap', `${width}: company name wraps`);
    check(copy.width <= width, `${width}: horizontal overflow`);
    await page.screenshot({ path: path.join(output, `${width}-who.png`) });
    console.log(`${width}: checked toolbar expansion, reverse scroll and typography`);
    await page.close();
  }
  assert.deepEqual(failures, []);
  console.log('PASS mobile transition and paragraph checks');
} finally {
  await browser.close();
}
