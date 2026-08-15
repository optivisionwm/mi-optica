import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';


const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const outputDirectory = path.join(repositoryRoot, 'artifacts', 'technology');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = process.env.TECH_URL ?? 'http://127.0.0.1:5174/';
const experiences = [
  { selector: '.photo-scroll-container', name: 'photochromic' },
  { selector: '.photo-scroll-container-2', name: 'blue-cut' },
  { selector: '.photo-scroll-container-3', name: 'uv' },
];


async function setModalProgress(page, selector, progress) {
  await page.locator('#filter-modal').evaluate((modal, options) => {
    const experience = modal.querySelector(options.selector);
    const distance = experience.offsetHeight - modal.clientHeight;
    modal.scrollTo(0, experience.offsetTop + distance * options.progress);
  }, { selector, progress });
  await page.waitForTimeout(850);
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
  await page.waitForFunction(
    () => document.querySelector('#preloader')?.classList.contains('hidden'),
    null,
    { timeout: 15_000 },
  );
  await page.evaluate(() => {
    const section = document.querySelector('#optiland');
    window.scrollTo(0, section.offsetTop + 2);
  });
  await page.waitForTimeout(1_400);

  const sectionState = await page.evaluate(() => {
    const section = document.querySelector('#optiland');
    const grid = section.querySelector('.technology-card-grid');
    const gridRect = grid.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const typeCards = [...section.querySelectorAll('.lens-type-card')];
    const mainCards = [...grid.querySelectorAll('.card')];
    const hoyaLink = section.querySelector('#opt-card-2 a');
    const sharedTypeLink = section.querySelector('.lens-type-shared-link');

    return {
      precisionFreeformPresent: section.textContent.includes('Precisión Freeform'),
      mainCardCount: mainCards.length,
      mainCardTitles: mainCards.map((card) => card.querySelector('h3').textContent.trim()),
      gridCentered: Math.abs(
        (gridRect.left - sectionRect.left) - (sectionRect.right - gridRect.right),
      ) < 2,
      hoyaHref: hoyaLink.href,
      typeCardCount: typeCards.length,
      typeCardTitles: typeCards.map((card) => card.querySelector('h3').textContent.trim()),
      typeDescriptionsPresent: typeCards.every((card) => card.querySelector('p').textContent.trim().length > 45),
      typeCardsHaveIndividualLinks: typeCards.some((card) => card.querySelector('a')),
      sharedTypeHref: sharedTypeLink.href,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

  await page.screenshot({ path: path.join(outputDirectory, `${name}-section.png`), fullPage: false });
  await page.locator('#opt-types').scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(outputDirectory, `${name}-types.png`), fullPage: false });

  await page.locator('#operativos').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1_400);
  const operativosState = await page.locator('#operativos').evaluate((section) => {
    const cta = section.querySelector('a.btn-primary');
    return {
      painCopyPresent: section.textContent.includes('traslados')
        && section.textContent.includes('horas fuera del puesto'),
      benefitCount: section.querySelectorAll('ul li').length,
      gmailHref: cta.href,
      opensNewTab: cta.target === '_blank',
      ctaLabel: cta.textContent.trim(),
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  await page.screenshot({ path: path.join(outputDirectory, `${name}-operativos.png`), fullPage: false });

  await page.locator('#open-filter-modal').click();
  await page.locator('#filter-modal.active').waitFor({ state: 'visible', timeout: 5_000 });
  await page.waitForTimeout(500);
  const modalOpened = await page.evaluate(() => (
    document.querySelector('#filter-modal').classList.contains('active')
    && getComputedStyle(document.querySelector('#filter-modal')).display !== 'none'
    && getComputedStyle(document.body).overflow === 'hidden'
  ));

  const filterStates = [];
  for (const experience of experiences) {
    await setModalProgress(page, experience.selector, 0.88);
    const state = await page.locator(experience.selector).evaluate((element) => {
      const overlay = element.querySelector('[data-filter-overlay]');
      const progress = element.querySelector('.photo-progress-fill');
      const visual = element.querySelector('.filter-demo-stage').getBoundingClientRect();
      return {
        overlayOpacity: Number(getComputedStyle(overlay).opacity),
        progressWidth: parseFloat(getComputedStyle(progress).width),
        progressTrackWidth: parseFloat(getComputedStyle(progress.parentElement).width),
        label: element.querySelector('.photo-label').textContent.trim(),
        visualFitsViewport: visual.width <= window.innerWidth && visual.height <= window.innerHeight,
      };
    });
    filterStates.push({ name: experience.name, ...state });
    await page.screenshot({
      path: path.join(outputDirectory, `${name}-${experience.name}.png`),
      fullPage: false,
    });
  }

  await page.locator('#close-filter-modal').click();
  await page.waitForFunction(() => !document.querySelector('#filter-modal').classList.contains('active'));
  const modalClosed = await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden');

  await page.close();
  return {
    name,
    viewport,
    sectionState,
    operativosState,
    modalOpened,
    filterStates,
    modalClosed,
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
