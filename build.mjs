import { readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
const root = import.meta.dirname;
let html = await readFile(join(root, 'index.html'), 'utf8');
const css = await readFile(join(root, 'style.css'), 'utf8');
const js = await readFile(join(root, 'app.js'), 'utf8');
html = html.replace(/<link rel="stylesheet" href="style.css">|<style id="landing-styles">[\s\S]*?<\/style>/, () => `<style id="landing-styles">${css}</style>`);
html = html.replace(/<script src="app.js" defer><\/script>|<script id="landing-script">[\s\S]*?<\/script>/, '');
html = html.replace('</body>', `<script id="landing-script">${js}</script></body>`);
for (const match of [...html.matchAll(/data-asset="([^"]+)" src="([^"]+)"/g)]) {
  const mime = extname(match[1]) === '.png' ? 'image/png' : 'image/svg+xml';
  const data = await readFile(join(root, match[1]));
  html = html.replace(match[0], `data-asset="${match[1]}" src="data:${mime};base64,${data.toString('base64')}"`);
}
const icon = await readFile(join(root, 'assets/icon.svg'));
html = html.replace(/<link rel="icon"[^>]+>/, `<link rel="icon" href="data:image/svg+xml;base64,${icon.toString('base64')}" type="image/svg+xml">`);
await writeFile(join(root, 'index.html'), html);
console.log('Built standalone index.html: styles, scripts, and images included.');
