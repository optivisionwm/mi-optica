import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const output = path.resolve('artifacts/who-we-are');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--enable-unsafe-swiftshader'],
});
const results = [];
try {
  for (const [width, height, reduced = false] of [[1440, 900], [390, 844], [390, 844, true]]) {
    const name = `${width}x${height}${reduced ? '-reduced' : ''}`;
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    await page.goto(process.env.WHO_URL || 'http://127.0.0.1:5174/');
    await page.locator('#preloader.hidden').waitFor({ state: 'attached' });
    const portrait = page.locator('.qs-model-portrait');
    await portrait.scrollIntoViewIfNeeded();
    await portrait.evaluate(img => img.decode());
    await page.waitForTimeout(800);
    const state = await portrait.evaluate(img => {
      const rect = img.getBoundingClientRect();
      const section = document.getElementById('quienes-somos');
      return {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        left: rect.left,
        right: rect.right,
        viewport: innerWidth,
        oldCanvasCount: section.querySelectorAll('canvas').length,
        delivery: section.querySelector('.qs-proof-list').textContent,
        note: section.querySelector('.delivery-note').textContent,
        opacity: Number(getComputedStyle(document.getElementById('qs-image-container')).opacity),
        portraitOpacity: Number(getComputedStyle(img).opacity),
        backdropPosition: getComputedStyle(document.getElementById('qs-image-container')).position,
        backdropLayer: Number(getComputedStyle(document.getElementById('qs-image-container')).zIndex),
        textLayer: Number(getComputedStyle(document.querySelector('.qs-content')).zIndex),
        transparentPixels: (() => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const context = canvas.getContext('2d');
          context.drawImage(img, 0, 0);
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
          let transparent = 0;
          for (let i = 3; i < pixels.length; i += 4) if (pixels[i] < 10) transparent++;
          return transparent / (pixels.length / 4);
        })(),
      };
    });
    assert.ok(state.naturalWidth >= 1000 && state.naturalHeight > state.naturalWidth, 'Portrait must load at usable resolution');
    assert.ok(state.left >= 0 && state.right <= state.viewport, 'Decorative backdrop must not overflow the viewport');
    assert.equal(state.oldCanvasCount, 0, 'The replaced sunglasses scene must not mount');
    assert.equal(state.opacity, 1);
    assert.equal(state.backdropPosition, 'absolute', 'Portrait must not occupy a separate content row');
    assert.ok(state.backdropLayer < state.textLayer, 'Text must remain in front of the portrait');
    assert.ok(state.portraitOpacity >= .12 && state.portraitOpacity <= .28, 'Backdrop must remain subtle');
    assert.ok(state.transparentPixels > .1, 'Removed background must have real transparency');
    assert.ok(state.delivery.includes('Monofocales: 2 días hábiles'));
    assert.ok(state.delivery.includes('Bifocales y multifocales: 5 días hábiles'));
    assert.ok(state.note.includes('desde la compra'));
    await page.screenshot({ path: path.join(output, `${name}-portrait.png`) });
    results.push({ name, state });
    console.log(`PASS portrait and delivery ${name}`);
    await page.close();
  }
  await fs.writeFile(path.join(output, 'verification.json'), JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
