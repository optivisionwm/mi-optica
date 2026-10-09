import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--enable-unsafe-swiftshader'],
});
try {
  for (const width of [320, 360, 390, 430]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    await page.goto(process.env.SITE_URL || 'http://127.0.0.1:5174/');
    await page.locator('#preloader.hidden').waitFor({ state: 'attached' });
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#contacto').offsetTop));
    await page.waitForTimeout(1700);
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#ct-right').getBoundingClientRect().top + scrollY - 120));
    await page.waitForTimeout(800);
    const layout = await page.evaluate(() => {
      const blocks = ['ct-left', 'ct-right'].map(id => {
        const rect = document.getElementById(id).getBoundingClientRect();
        return { id, left: rect.left, right: rect.right, opacity: getComputedStyle(document.getElementById(id)).opacity };
      });
      const phone = document.querySelector('#ct-right a[href^="tel:"]');
      const number = phone.previousElementSibling.lastElementChild;
      return { blocks, numberHeight: number.getBoundingClientRect().height, lineHeight: parseFloat(getComputedStyle(number).lineHeight) };
    });
    for (const block of layout.blocks) {
      assert.ok(Math.abs(block.left - (width - block.right)) < 1, `${width}px: ${block.id} is not centered: ${JSON.stringify(block)}`);
      assert.ok(block.left >= 16 && block.right <= width - 16, `${width}px: ${block.id} exceeds margins`);
      assert.equal(Number(block.opacity), 1);
    }
    assert.ok(layout.numberHeight <= layout.lineHeight + 1, `${width}px: phone number wraps`);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#contacto').offsetTop));
    await page.waitForTimeout(900);
    assert.equal(await page.locator('#ct-right').evaluate(el => Number(getComputedStyle(el).opacity)), 1);
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#quienes-somos').offsetTop - 96));
    await page.waitForTimeout(1000);
    assert.equal(await page.locator('#main-nav').evaluate(el => el.classList.contains('is-over-hero')), false, `${width}px: navigation contrast after scrolling back`);
    console.log(`PASS contact ${width}px, including return scroll`);
    await page.close();
  }
} finally {
  await browser.close();
}
