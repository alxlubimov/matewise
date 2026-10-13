import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.argv[2] || 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.json': 'application/json' };
http.createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';
    let path = resolve(root, name);
    if (!path.startsWith(root + sep)) { res.writeHead(404); res.end('Not found'); return; }
    let body;
    try { body = await readFile(path); } catch (error) {
      if (error.code !== 'ENOENT' || extname(name)) throw error;
      path = resolve(root, 'index.html'); body = await readFile(path);
    }
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' }); res.end(body);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(Number(process.env.PORT || 8082), '127.0.0.1', () => console.log('Matewise web preview server ready'));
