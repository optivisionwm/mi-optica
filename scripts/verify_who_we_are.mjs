import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

// Verifica "Quiénes Somos": retrato en arco, sello, tarjeta de cristales y plazos.
const output = path.resolve('artifacts/who-we-are');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--enable-unsafe-swiftshader'],
});
const results = [];
try {
  for (const [width, height, reduced = false] of [[1440, 900], [1024, 768], [390, 844], [390, 844, true]]) {
    const name = `${width}x${height}${reduced ? '-reduced' : ''}`;
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    await page.goto(process.env.WHO_URL || 'http://127.0.0.1:5174/');
    await page.locator('#preloader.hidden').waitFor({ state: 'attached' });
    const portrait = page.locator('#quienes-somos .qs-model');
    await portrait.evaluate(img => img.decode());
    // Lleva la sección al tope, como queda al terminar la transición del lente.
    await page.evaluate(() => window.scrollTo(0, document.getElementById('quienes-somos').offsetTop));
    await page.waitForTimeout(1_500);
    const state = await page.evaluate(() => {
      const section = document.getElementById('quienes-somos');
      const rect = (el) => el.getBoundingClientRect();
      const img = section.querySelector('.qs-model');
      const arch = section.querySelector('.qs-arch');
      const seal = section.querySelector('.qs-seal');
      const badge = section.querySelector('.qs-badge');
      return {
        naturalWidth: img.naturalWidth,
        archRadius: getComputedStyle(arch).borderTopLeftRadius,
        sealText: section.querySelector('.qs-seal textPath').textContent,
        sealInside: rect(seal).right <= innerWidth && rect(seal).left >= 0,
        badgeInside: rect(badge).left >= 0 && rect(badge).right <= innerWidth,
        delivery: section.querySelector('.qs-stats').textContent,
        note: section.querySelector('.delivery-note').textContent,
        paragraphs: [...section.querySelectorAll('.qs-copy p')].map(p => p.textContent.trim()),
        overflow: document.documentElement.scrollWidth - innerWidth,
        sectionTop: Math.round(rect(section).top),
      };
    });
    assert.ok(state.naturalWidth >= 1000, 'Portrait must load at usable resolution');
    assert.ok(parseFloat(state.archRadius) > 100, 'Portrait must sit in an arch');
    assert.ok(state.sealText.includes('MALL APUMANQUE'));
    assert.ok(state.sealInside, 'Seal must stay inside the viewport');
    assert.ok(state.badgeInside, 'Lens badge must stay inside the viewport');
    assert.ok(state.delivery.includes('Monofocales') && state.delivery.includes('2') && state.delivery.includes('días hábiles'));
    assert.ok(state.delivery.includes('Bifocales y multifocales') && state.delivery.includes('5'));
    assert.ok(state.note.includes('desde la compra'));
    assert.ok(state.paragraphs[1].startsWith('En Optivision W&M'));
    assert.ok(state.overflow <= 0, 'No horizontal overflow');
    await page.screenshot({ path: path.join(output, `${name}-top.png`) });
    await page.locator('#quienes-somos').screenshot({ path: path.join(output, `${name}-section.png`) });
    results.push({ name, state });
    console.log(`PASS who-we-are ${name}`);
    await page.close();
  }
  await fs.writeFile(path.join(output, 'verification.json'), JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
