import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const home = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const origin = 'https://optivisionwm.vercel.app/';

test('the initial response identifies the optical store and its location', () => {
  assert.match(home, /<title>[^<]*Óptica[^<]*Apumanque[^<]*Las Condes/i);
  assert.match(home, /<meta name="description" content="[^"]*lentes[^"]*Apumanque/i);
  assert.ok(home.includes(`<link rel="canonical" href="${origin}"`));
  assert.ok(home.includes('lang="es-CL"'));
});

test('crawlers receive business content without executing JavaScript', () => {
  assert.equal((home.match(/<h1\b/g) || []).length, 1);
  assert.match(home, /<h1[^>]*>[^<]*Óptica[^<]*Apumanque[^<]*Las Condes/i);
  assert.match(home, /id="quienes-somos"/);
  assert.match(home, /id="contacto"/);
  assert.match(home, /href="https:\/\/wa\.me\/56992803368/);
  assert.ok(home.includes('2 días hábiles') && home.includes('5 días hábiles'));
  assert.ok(home.includes('Mall Apumanque'));
});

test('structured data describes verified contact details without invented ratings', () => {
  const blocks = [...home.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length > 0, 'business structured data is missing');
  const nodes = blocks.flatMap(([, value]) => {
    const data = JSON.parse(value);
    return data['@graph'] || [data];
  });
  const business = nodes.find(node => node['@type'] === 'Optician');
  assert.ok(business);
  assert.equal(business.url, origin);
  assert.equal(business.telephone, '+56992803368');
  assert.equal(business.address.addressLocality, 'Las Condes');
  assert.match(business.address.streetAddress, /132/);
  assert.equal(business.address.addressCountry, 'CL');
  const hoursFor = day => business.openingHoursSpecification.find(hours =>
    [hours.dayOfWeek].flat().includes(day));
  assert.equal(hoursFor('Monday').closes, '20:30');
  assert.equal(hoursFor('Tuesday').closes, '20:00');
  assert.equal(hoursFor('Sunday').opens, '11:00');
  assert.equal(business.aggregateRating, undefined);
  assert.equal(business.review, undefined);
});

test('robots and sitemap expose the canonical page to search engines', async () => {
  const robots = await readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \/\s/);
  assert.ok(robots.includes(`Sitemap: ${origin}sitemap.xml`));
  assert.ok(!robots.includes('Disallow: /\n'));
  assert.ok(sitemap.includes(`<loc>${origin}</loc>`));
  assert.ok(!sitemap.includes('#'));
  assert.ok(!sitemap.includes('logo-3d-preview'));
});

test('internal model preview is excluded from indexing', async () => {
  const preview = await readFile(new URL('../dist/logo-3d-preview.html', import.meta.url), 'utf8');
  assert.match(preview, /name="robots" content="noindex, nofollow"/);
});

test('social previews use the same canonical business identity', () => {
  assert.ok(home.includes(`property="og:url" content="${origin}"`));
  assert.match(home, /property="og:image" content="https:\/\/optivisionwm\.vercel\.app\/assets\//);
  assert.match(home, /name="twitter:card" content="summary_large_image"/);
});
