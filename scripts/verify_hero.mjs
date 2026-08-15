import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';


const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const outputDirectory = path.join(repositoryRoot, 'artifacts', 'hero');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = process.env.HERO_URL ?? 'http://127.0.0.1:5174/';


function hash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}


async function inspectViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('#preloader.hidden').waitFor({ timeout: 15_000 });
  await page.locator('.hero-logo-canvas.is-rendered').waitFor({ timeout: 15_000 });
  await page.waitForTimeout(500);

  const initial = await page.evaluate(() => {
    const hero = document.querySelector('#hero');
    const viewportElement = document.querySelector('#hero-viewport');
    const logo = document.querySelector('#hero-logo-shell');
    const hint = document.querySelector('#hero-scroll-hint');
    const photo = document.querySelector('#hero-photo-sharp');
    const nav = document.querySelector('#main-nav');
    const brands = document.querySelector('#brand-carousel');
    const logoRect = logo.getBoundingClientRect();
    const hintRect = hint.getBoundingClientRect();
    const brandsRect = brands.getBoundingClientRect();

    return {
      heroHeight: hero.getBoundingClientRect().height,
      viewportHeight: viewportElement.getBoundingClientRect().height,
      logoRect: { x: logoRect.x, y: logoRect.y, width: logoRect.width, height: logoRect.height },
      hintInsideViewport: hintRect.bottom <= window.innerHeight && hintRect.left >= 0,
      hintText: hint.textContent.trim(),
      photoNaturalSize: { width: photo.naturalWidth, height: photo.naturalHeight },
      photoObjectPosition: getComputedStyle(photo).objectPosition,
      navOverHero: nav.classList.contains('is-over-hero'),
      navLogoVisible: getComputedStyle(document.querySelector('#nav-logo')).visibility === 'visible'
        && Number(getComputedStyle(document.querySelector('#nav-logo')).opacity) > 0,
      brandLogoCount: brands.querySelectorAll('img').length,
      brandsBelowHint: brandsRect.top > hintRect.bottom && brandsRect.bottom <= window.innerHeight,
      horizontalOverflowClipped: ['hidden', 'clip'].includes(getComputedStyle(document.body).overflowX),
      logoTouchAction: getComputedStyle(document.querySelector('.hero-logo-canvas')).touchAction,
      canvasSize: {
        width: document.querySelector('.hero-logo-canvas canvas').getBoundingClientRect().width,
        height: document.querySelector('.hero-logo-canvas canvas').getBoundingClientRect().height,
      },
    };
  });

  const canvas = page.locator('.hero-logo-canvas canvas');
  const firstLogoFrame = await canvas.screenshot();
  const firstBrandTransform = await page.locator('.marquee-track').evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(900);
  const secondLogoFrame = await canvas.screenshot();
  const secondBrandTransform = await page.locator('.marquee-track').evaluate((element) => getComputedStyle(element).transform);
  const logoRotates = hash(firstLogoFrame) !== hash(secondLogoFrame);
  const brandsMove = firstBrandTransform !== secondBrandTransform;

  await page.screenshot({ path: path.join(outputDirectory, `${name}-initial.png`), fullPage: false });
  const logoBox = await page.locator('#hero-logo-shell').boundingBox();
  await page.mouse.move(logoBox.x + logoBox.width * 0.82, logoBox.y + logoBox.height * 0.2);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDirectory, `${name}-hover.png`), fullPage: false });

  await page.evaluate(() => {
    const distance = window.innerHeight;
    window.scrollTo(0, distance * 0.55);
  });
  await page.waitForTimeout(900);
  const middle = await page.evaluate(() => ({
    scrollY: window.scrollY,
    photoTransform: getComputedStyle(document.querySelector('#hero-photo-stage')).transform,
    heroMask: getComputedStyle(document.querySelector('#hero-viewport')).webkitMaskImage,
    logoOpacity: Number(getComputedStyle(document.querySelector('#hero-logo-shell')).opacity),
    quienesTop: document.querySelector('#quienes-somos').getBoundingClientRect().top,
  }));
  await page.screenshot({ path: path.join(outputDirectory, `${name}-middle.png`), fullPage: false });

  await page.evaluate(() => {
    window.scrollTo(0, window.innerHeight * 0.99);
  });
  await page.waitForTimeout(900);
  const end = await page.evaluate(() => ({
    heroMask: getComputedStyle(document.querySelector('#hero-viewport')).webkitMaskImage,
    quienesTop: document.querySelector('#quienes-somos').getBoundingClientRect().top,
    navOverHero: document.querySelector('#main-nav').classList.contains('is-over-hero'),
  }));
  await page.screenshot({ path: path.join(outputDirectory, `${name}-end.png`), fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1_500);
  const returnState = await page.evaluate(() => ({
    carouselOpacity: Number(getComputedStyle(document.querySelector('#brand-carousel')).opacity),
    carouselTransform: getComputedStyle(document.querySelector('#brand-carousel')).transform,
    hintOpacity: Number(getComputedStyle(document.querySelector('#hero-scroll-hint')).opacity),
  }));
  await page.screenshot({ path: path.join(outputDirectory, `${name}-return.png`), fullPage: false });

  await page.locator('#quienes-somos').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const followingSectionVisible = await page.locator('#quienes-somos').isVisible();

  await page.close();
  return {
    name,
    viewport,
    initial,
    logoRotates,
    brandsMove,
    middle,
    end,
    returnState,
    followingSectionVisible,
    consoleErrors,
    pageErrors,
  };
}


await fs.mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'],
});

try {
  const results = [];
  results.push(await inspectViewport(browser, 'desktop', { width: 1440, height: 900 }));
  results.push(await inspectViewport(browser, 'mobile', { width: 390, height: 844 }));
  await fs.writeFile(
    path.join(outputDirectory, 'verification.json'),
    `${JSON.stringify(results, null, 2)}\n`,
    'utf8',
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
