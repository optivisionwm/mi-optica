import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';


const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const outputDirectory = path.join(repositoryRoot, 'artifacts', 'who-we-are');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = process.env.WHO_URL ?? 'http://127.0.0.1:5174/';


function hash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}


function inspectPng(buffer) {
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') throw new Error('La captura del canvas no es PNG.');

  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const dataChunks = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === 'IDAT') {
      dataChunks.push(data);
    }
    offset += length + 12;
  }

  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (!channels) throw new Error(`Tipo de color PNG no soportado: ${colorType}`);
  const stride = width * channels;
  const inflated = zlib.inflateSync(Buffer.concat(dataChunks));
  const previous = Buffer.alloc(stride);
  const current = Buffer.alloc(stride);
  let sourceOffset = 0;
  let coloredPixels = 0;
  let minLuma = 255;
  let maxLuma = 0;

  const paeth = (a, b, c) => {
    const prediction = a + b - c;
    const distanceA = Math.abs(prediction - a);
    const distanceB = Math.abs(prediction - b);
    const distanceC = Math.abs(prediction - c);
    if (distanceA <= distanceB && distanceA <= distanceC) return a;
    return distanceB <= distanceC ? b : c;
  };

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;
    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[sourceOffset + x];
      const left = x >= channels ? current[x - channels] : 0;
      const up = previous[x];
      const upLeft = x >= channels ? previous[x - channels] : 0;
      if (filter === 0) current[x] = raw;
      else if (filter === 1) current[x] = (raw + left) & 0xff;
      else if (filter === 2) current[x] = (raw + up) & 0xff;
      else if (filter === 3) current[x] = (raw + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) current[x] = (raw + paeth(left, up, upLeft)) & 0xff;
      else throw new Error(`Filtro PNG no soportado: ${filter}`);
    }
    sourceOffset += stride;

    for (let x = 0; x < stride; x += channels) {
      const alpha = channels === 4 ? current[x + 3] : 255;
      if (alpha < 12) continue;
      const luma = Math.round(current[x] * 0.2126 + current[x + 1] * 0.7152 + current[x + 2] * 0.0722);
      if (luma < 248) coloredPixels += 1;
      minLuma = Math.min(minLuma, luma);
      maxLuma = Math.max(maxLuma, luma);
    }
    current.copy(previous);
  }

  return {
    width,
    height,
    coloredPixels,
    coloredRatio: coloredPixels / (width * height),
    lumaRange: maxLuma - minLuma,
  };
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
    const section = document.querySelector('#quienes-somos');
    window.scrollTo(0, section.offsetTop + 2);
  });
  await page.locator('.qs-glasses-3d.is-rendered').waitFor({ timeout: 15_000 });
  await page.waitForTimeout(1_400);

  const sectionState = await page.evaluate(() => {
    const section = document.querySelector('#quienes-somos');
    const heading = section.querySelector('h2');
    const glasses = section.querySelector('.qs-glasses-3d');
    const canvas = glasses.querySelector('canvas');
    const sectionRect = section.getBoundingClientRect();
    const headingRect = heading.getBoundingClientRect();
    const glassesRect = glasses.getBoundingClientRect();
    const headingCenterElement = document.elementFromPoint(
      headingRect.left + headingRect.width / 2,
      headingRect.top + headingRect.height / 2,
    );
    const proofs = [...section.querySelectorAll('.qs-proof-list dt')].map((item) => item.textContent.trim());

    return {
      heading: heading.textContent.replace(/\s+/g, ' ').trim(),
      copy: section.querySelector('.qs-copy').textContent.replace(/\s+/g, ' ').trim(),
      proofs,
      sectionRect: { top: sectionRect.top, bottom: sectionRect.bottom, height: sectionRect.height },
      headingRect: { top: headingRect.top, bottom: headingRect.bottom, width: headingRect.width },
      glassesRect: { top: glassesRect.top, bottom: glassesRect.bottom, width: glassesRect.width, height: glassesRect.height },
      canvasSize: { width: canvas.width, height: canvas.height },
      canvasOpacity: Number(getComputedStyle(canvas).opacity),
      fallbackOpacity: Number(getComputedStyle(section.querySelector('.qs-glasses-fallback')).opacity),
      touchAction: getComputedStyle(glasses).touchAction,
      headingReceivesPointer: heading.contains(headingCenterElement),
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

  const canvas = page.locator('.qs-glasses-3d canvas');
  const firstFrame = await canvas.screenshot();
  await page.waitForTimeout(850);
  const secondFrame = await canvas.screenshot();
  const automaticMovement = hash(firstFrame) !== hash(secondFrame);
  const pixels = inspectPng(secondFrame);

  const glassesBox = await page.locator('.qs-glasses-3d').boundingBox();
  const beforeInteractionHash = hash(secondFrame);
  const shadowBefore = await canvas.evaluate((element) => element.style.filter);
  const x = glassesBox.x + glassesBox.width * 0.78;
  const y = glassesBox.y + glassesBox.height * 0.26;
  if (name === 'mobile') {
    await page.dispatchEvent('.qs-glasses-3d', 'pointerdown', { pointerType: 'touch', clientX: x, clientY: y });
    await page.dispatchEvent('.qs-glasses-3d', 'pointermove', { pointerType: 'touch', clientX: x, clientY: y });
  } else {
    await page.dispatchEvent('.qs-glasses-3d', 'pointerenter', { pointerType: 'mouse', clientX: x, clientY: y });
    await page.dispatchEvent('.qs-glasses-3d', 'pointermove', { pointerType: 'mouse', clientX: x, clientY: y });
  }
  await page.waitForTimeout(420);
  const interactionFrame = await canvas.screenshot();
  const pointerInteraction = beforeInteractionHash !== hash(interactionFrame);
  const shadowAfter = await canvas.evaluate((element) => element.style.filter);
  const shadowResponds = shadowBefore !== shadowAfter;
  if (name === 'mobile') {
    await page.dispatchEvent('.qs-glasses-3d', 'pointerup', { pointerType: 'touch' });
  }

  await page.evaluate(() => {
    const section = document.querySelector('#quienes-somos');
    window.scrollTo(0, section.offsetTop + 2);
  });
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(outputDirectory, `${name}.png`), fullPage: false });
  const title = page.locator('#quienes-somos h2');
  await title.hover({ force: true });
  await page.waitForTimeout(260);
  const titleAnimates = await title.evaluate((element) => (
    [...element.querySelectorAll('.text-wave-hover')]
      .some((letter) => getComputedStyle(letter).transform !== 'none')
  ));

  await page.evaluate(() => {
    const glasses = document.querySelector('.qs-glasses-3d');
    const top = window.scrollY + glasses.getBoundingClientRect().top - (window.innerHeight - glasses.clientHeight) / 2;
    window.scrollTo(0, top);
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDirectory, `${name}-glasses.png`), fullPage: false });
  await page.close();

  return {
    name,
    viewport,
    sectionState,
    pixels,
    automaticMovement,
    pointerInteraction,
    shadowResponds,
    titleAnimates,
    consoleErrors,
    pageErrors,
  };
}


async function inspectReducedMotion(browser) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(
    () => document.querySelector('#preloader')?.classList.contains('hidden'),
    null,
    { timeout: 15_000 },
  );
  await page.evaluate(() => {
    const section = document.querySelector('#quienes-somos');
    window.scrollTo(0, section.offsetTop + 2);
  });
  await page.locator('.qs-glasses-3d.is-rendered').waitFor({ timeout: 15_000 });
  await page.waitForTimeout(400);
  const canvas = page.locator('.qs-glasses-3d canvas');
  const firstFrame = await canvas.screenshot();
  await page.waitForTimeout(700);
  const secondFrame = await canvas.screenshot();
  await page.close();
  return { staysStill: hash(firstFrame) === hash(secondFrame) };
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
  const reducedMotion = await inspectReducedMotion(browser);
  const report = { results, reducedMotion };
  await fs.writeFile(
    path.join(outputDirectory, 'verification.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
