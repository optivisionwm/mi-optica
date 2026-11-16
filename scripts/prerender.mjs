import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

// Render the real React tree once at build time, then hydrate it in the browser.
// Crawlers and visitors receive the same content; no browser is needed in CI.
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
  const { FAQS } = await server.ssrLoadModule('/src/faqs.js');
  const markup = await render();
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  const faqTag = `<script type="application/ld+json">${JSON.stringify(faqSchema).replace(/</g, '\u003c')}</script>`;
  const destination = new URL('../dist/index.html', import.meta.url);
  const template = await readFile(destination, 'utf8');
  const slot = '<div id="root"></div>';
  if (!template.includes(slot)) throw new Error('Prerender root placeholder is missing');
  if (!template.includes('</head>')) throw new Error('Prerender head is missing');
  const html = template
    .replace('</head>', () => `    ${faqTag}
  </head>`)
    .replace(slot, () => `<div id="root">${markup}</div>`);
  await writeFile(destination, html);
  console.log(`Prerendered home page: ${Buffer.byteLength(markup)} bytes of business content`);
} finally {
  await server.close();
}
