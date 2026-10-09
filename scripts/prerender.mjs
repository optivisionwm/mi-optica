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
  const markup = await render();
  const destination = new URL('../dist/index.html', import.meta.url);
  const template = await readFile(destination, 'utf8');
  const slot = '<div id="root"></div>';
  if (!template.includes(slot)) throw new Error('Prerender root placeholder is missing');
  await writeFile(destination, template.replace(slot, () => `<div id="root">${markup}</div>`));
  console.log(`Prerendered home page: ${Buffer.byteLength(markup)} bytes of business content`);
} finally {
  await server.close();
}
