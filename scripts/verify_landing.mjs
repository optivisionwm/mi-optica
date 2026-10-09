import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const output = path.resolve('artifacts/landing-local');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--enable-unsafe-swiftshader'] });
const reports = [];
const failures = [];
const check = (condition, label) => { if (!condition) failures.push(label); };
const viewports = process.env.LANDING_VIEWPORTS ? JSON.parse(process.env.LANDING_VIEWPORTS) : [[320, 640], [390, 844], [430, 932], [870, 715], [1440, 900], [1920, 1080], [390, 844, true]];
try {
  for (const [width, height, reduced = false] of viewports) {
    const name = `${width}x${height}${reduced ? '-reduced' : ''}`;
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 800, hasTouch: width < 800, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.SITE_URL || 'http://127.0.0.1:5174/', { waitUntil: 'load' });
    await page.locator('#preloader.hidden').waitFor({ state: 'attached' });
    await page.locator('.hero-logo-canvas.is-rendered').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1100);
    const initial = await page.evaluate(() => {
      const rect = selector => {
        const r = document.querySelector(selector).getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
      };
      return {
        nav: rect('#main-nav'), logo: rect('#hero-logo-shell'), copy: rect('.hero-copy'), hint: rect('#hero-scroll-hint'), brands: rect('#brand-carousel'),
        hero: rect('#hero-viewport'), action: rect('.hero-quote'), location: rect('.hero-location'), enterprise: rect('.hero-enterprise'),
        heading: rect('#hero h1'),
        whatsapp: document.querySelector('.hero-quote').href,
        enterprises: document.querySelector('.hero-enterprise').getAttribute('href'),
        enterpriseInNav: document.querySelector('.hero-enterprise').closest('#main-nav') !== null,
        menu: rect('#menu-toggle'),
        phone: document.querySelector('a[href^="tel:"]').getAttribute('href'),
        blankLinks: document.querySelectorAll('a[href="#"]').length,
        delivery: document.querySelector('.qs-proof-list').textContent,
        deliveryNote: document.querySelector('.delivery-note').textContent,
      };
    });
    check(initial.nav.bottom <= initial.logo.top, `${name}: nav overlaps logo`);
    check(initial.logo.bottom <= initial.copy.top + 1, `${name}: logo overlaps copy`);
    check(initial.copy.bottom < initial.hint.top, `${name}: copy overlaps hint`);
    check(initial.enterpriseInNav && initial.enterprise.top >= initial.nav.top && initial.enterprise.bottom <= initial.nav.bottom && initial.enterprise.right <= width - 16, `${name}: enterprise link must sit in the right header`);
    if (width < 1024) {
      check(initial.enterprise.right <= initial.menu.left - 8 && Math.abs((initial.enterprise.top + initial.enterprise.height / 2) - (initial.menu.top + initial.menu.height / 2)) <= 3, `${name}: enterprise link must align beside menu without overlap`);
    }
    check(Math.abs(initial.logo.left + initial.logo.width / 2 - width / 2) < 1, `${name}: logo must stay horizontally centered`);
    if (width === 870 && height === 715) {
      check(initial.logo.top + initial.logo.height / 2 > height * .4 && initial.copy.top > height * .6 && initial.action.bottom > height * .79, `${name}: annotated elements must be lower in the hero`);
    }
    check(initial.hint.bottom < initial.brands.top, `${name}: hint overlaps brands`);
    check(initial.hint.bottom <= initial.location.top && initial.location.bottom < initial.brands.top, `${name}: location must sit between hint and brands`);
    check(initial.heading.width <= 1, `${name}: rejected headline is visible`);
    check(initial.brands.bottom <= height, `${name}: brands below viewport`);
    check(initial.action.left >= 16 && initial.action.right <= width - 16, `${name}: CTA exceeds width`);
    check(initial.action.bottom < height, `${name}: CTA below initial viewport`);
    check(initial.whatsapp.startsWith('https://wa.me/56992803368'), `${name}: WhatsApp destination`);
    check(initial.enterprises === '#operativos', `${name}: enterprise destination`);
    check(initial.blankLinks === 0, `${name}: placeholder links`);
    check(initial.delivery.includes('Monofocales: 2 días hábiles') && initial.delivery.includes('Bifocales y multifocales: 5 días hábiles') && initial.deliveryNote.includes('desde la compra'), `${name}: delivery terms`);
    await page.screenshot({ path: path.join(output, `${name}-hero.png`) });
    const canvas = page.locator('.hero-logo-canvas canvas');
    await canvas.evaluate(el => { el.style.background = 'rgb(1, 2, 3)'; });
    const bounds = await canvas.boundingBox();
    // Integer bounds exclude the photographed background at fractional screenshot edges.
    const clip = { x: Math.ceil(bounds.x), y: Math.ceil(bounds.y), width: Math.floor(bounds.x + bounds.width) - Math.ceil(bounds.x), height: Math.floor(bounds.y + bounds.height) - Math.ceil(bounds.y) };
    const first = await page.screenshot({ clip, path: path.join(output, `${name}-canvas-a.png`) });
    const pixels = await page.evaluate(async encoded => {
      const img = new Image();
      img.src = `data:image/png;base64,${encoded}`;
      await img.decode();
      const scratch = document.createElement('canvas');
      scratch.width = img.width; scratch.height = img.height;
      const ctx = scratch.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, img.width, img.height).data;
      let count = 0, minX = img.width, maxX = 0, minY = img.height, maxY = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] + data[i + 1] + data[i + 2] < 90) continue;
        const x = (i / 4) % img.width, y = Math.floor(i / 4 / img.width);
        count++; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
      return { count, minX, maxX, minY, maxY, width: img.width, height: img.height };
    }, first.toString('base64'));
    check(pixels.count > 100, `${name}: blank logo canvas`);
    check(pixels.minX > 0 && pixels.maxX < pixels.width - 1 && pixels.minY > 0 && pixels.maxY < pixels.height - 1, `${name}: clipped logo model`);
    await page.waitForTimeout(700);
    const second = await page.screenshot({ clip, path: path.join(output, `${name}-canvas-b.png`) });
    const changedPixels = await page.evaluate(async images => {
      const frames = [];
      for (const encoded of images) {
        const img = new Image(); img.src = `data:image/png;base64,${encoded}`; await img.decode();
        const scratch = document.createElement('canvas'); scratch.width = img.width; scratch.height = img.height;
        const ctx = scratch.getContext('2d'); ctx.drawImage(img, 0, 0);
        frames.push(ctx.getImageData(0, 0, img.width, img.height).data);
      }
      let changed = 0;
      for (let i = 0; i < frames[0].length; i += 4) {
        if (Math.abs(frames[0][i] - frames[1][i]) + Math.abs(frames[0][i + 1] - frames[1][i + 1]) + Math.abs(frames[0][i + 2] - frames[1][i + 2]) > 24) changed++;
      }
      return changed;
    }, [first.toString('base64'), second.toString('base64')]);
    const moving = changedPixels > 30;
    check(reduced ? !moving : moving, `${name}: unexpected logo motion`);
    if (!reduced) {
      const box = await canvas.boundingBox();
      await canvas.dispatchEvent('pointermove', { pointerType: 'mouse', clientX: box.x + box.width * .85, clientY: box.y + box.height * .2 });
      await page.waitForTimeout(400);
      await canvas.screenshot({ path: path.join(output, `${name}-logo-interaction.png`) });
      await canvas.dispatchEvent('pointerleave', { pointerType: 'mouse' });
    }
    await canvas.evaluate(el => { el.style.background = ''; });
    if (!reduced) {
      const lens = await page.locator('#hero-viewport').evaluate(el => ({ x: parseFloat(el.style.getPropertyValue('--lens-x')), y: parseFloat(el.style.getPropertyValue('--lens-y')) }));
      await page.evaluate(() => window.scrollTo(0, innerHeight * .55));
      await page.waitForTimeout(1400);
      const entry = await page.locator('#hero-logo-shell').evaluate(el => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, width: r.width, opacity: Number(getComputedStyle(el).opacity) };
      });
      check(Math.hypot(entry.x - lens.x, entry.y - lens.y) < Math.hypot(initial.logo.left + initial.logo.width / 2 - lens.x, initial.logo.top + initial.logo.height / 2 - lens.y) * .18, `${name}: logo must enter the lens opening`);
      check(entry.width < initial.logo.width * .2 && entry.opacity > .5, `${name}: logo must shrink before fading out`);
      await page.screenshot({ path: path.join(output, `${name}-lens-entry.png`) });
      await page.evaluate(() => window.scrollTo(0, innerHeight * .82));
      await page.waitForTimeout(1200);
      const portal = await page.locator('#hero-viewport').evaluate(el => {
        const style = getComputedStyle(el);
        const x = parseFloat(style.getPropertyValue('--lens-x')), y = parseFloat(style.getPropertyValue('--lens-y'));
        return {
          radius: parseFloat(style.getPropertyValue('--portal-radius')),
          farthestCorner: Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)),
          navOverHero: document.getElementById('main-nav').classList.contains('is-over-hero'),
        };
      });
      check(portal.radius > portal.farthestCorner && !portal.navOverHero, `${name}: arriving section must not be obscured by the portal`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1400);
      const restored = await page.locator('#hero-logo-shell').boundingBox();
      check(Math.abs(restored.width - initial.logo.width) < 1, `${name}: logo scale must restore on reverse scroll`);
    }
    if (width < 1024) {
      await page.locator('#menu-toggle').click();
      check(await page.locator('#menu-toggle').getAttribute('aria-expanded') === 'true', `${name}: menu state`);
      await page.locator('#mobile-menu a[href="#contacto"]').click();
      check(await page.locator('#menu-toggle').getAttribute('aria-expanded') === 'false', `${name}: menu closes`);
    } else {
      await page.locator('#main-nav a[href="#contacto"]').click();
    }
    await page.waitForTimeout(1700);
    await page.screenshot({ path: path.join(output, `${name}-contact.png`) });
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#ct-right').getBoundingClientRect().top + scrollY - 112));
    await page.waitForTimeout(850);
    await page.screenshot({ path: path.join(output, `${name}-contact-controls.png`) });
    const contact = await page.evaluate(() => ['ct-left', 'ct-right'].map(id => {
      const el = document.getElementById(id), r = el.getBoundingClientRect();
      return { id, left: r.left, right: r.right, opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform };
    }));
    for (const block of contact) {
      check(block.left >= 16 && block.right <= width - 16 && Number(block.opacity) === 1, `${name}: contact outside viewport or hidden`);
      if (width < 1024) check(Math.abs(block.left - (width - block.right)) < 1, `${name}: contact not centered`);
    }
    const whatsappStyle = await page.evaluate(() => {
      const hero = document.querySelector('.hero-quote'), contact = document.querySelector('#ct-right .btn-whatsapp');
      return {
        shared: hero.classList.contains('whatsapp-flow') && contact.classList.contains('whatsapp-flow'),
        heroFlow: getComputedStyle(hero, '::before').animationName,
        contactFlow: getComputedStyle(contact, '::before').animationName,
        radius: getComputedStyle(contact).borderRadius,
      };
    });
    check(whatsappStyle.shared && whatsappStyle.heroFlow === whatsappStyle.contactFlow && whatsappStyle.radius === '999px', `${name}: WhatsApp buttons must share the rounded green motion design`);
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#quienes-somos').offsetTop - 96));
    await page.waitForTimeout(850);
    await page.screenshot({ path: path.join(output, `${name}-delivery.png`) });
    const portrait = page.locator('.qs-model-portrait');
    await portrait.scrollIntoViewIfNeeded();
    await portrait.evaluate(img => img.decode());
    await page.waitForTimeout(750);
    check(await portrait.evaluate(img => img.naturalWidth >= 1000 && img.naturalHeight > img.naturalWidth), `${name}: portrait asset missing or too small`);
    check(await page.locator('#qs-image-container canvas').count() === 0, `${name}: rejected sunglasses still mounted`);
    await page.screenshot({ path: path.join(output, `${name}-portrait.png`) });
    await page.locator('.nav-home').click();
    await page.waitForTimeout(1700);
    const returned = await page.evaluate(() => ({ y: scrollY, hero: Number(getComputedStyle(document.querySelector('#hero-main')).opacity), brands: Number(getComputedStyle(document.querySelector('#brand-carousel')).opacity), wayfinding: Number(getComputedStyle(document.querySelector('#hero-wayfinding')).opacity) }));
    check(returned.y < 2 && returned.hero > .99 && returned.brands > .99 && returned.wayfinding > .99, `${name}: return to hero`);
    check(errors.length === 0, `${name}: page errors ${errors.join(', ')}`);
    reports.push({ name, initial, contact, returned, pixels, moving, changedPixels, errors });
    console.log(`${name}: inspected`);
    await page.close();
  }
  await fs.writeFile(path.join(output, 'verification.json'), JSON.stringify({ reports, failures }, null, 2));
  assert.deepEqual(failures, []);
  console.log('PASS all layout, navigation, delivery and motion checks');
} finally {
  await browser.close();
}
