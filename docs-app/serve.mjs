// Minimal static file server for dist/. No dependency (e.g. `serve`) —
// consistent with the project's zero-dependency ethic; this is dev tooling.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.PORT) || 4550;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveFile(urlPath) {
  let safePath = normalize(decodeURIComponent(urlPath)).replace(/^\/+/, '');
  if (safePath.includes('..')) return null;

  let fullPath = join(rootDir, safePath);
  try {
    const stats = await stat(fullPath);
    if (stats.isDirectory()) {
      fullPath = join(fullPath, 'index.html');
    }
  } catch {
    if (!extname(fullPath)) {
      fullPath = `${fullPath}.html`;
    }
  }
  return fullPath;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const fullPath = await resolveFile(url.pathname);

  try {
    const body = await readFile(fullPath);
    const type = MIME[extname(fullPath)] ?? 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    try {
      const notFound = await readFile(join(rootDir, '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(notFound);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
});

server.listen(port, () => {
  console.log(`docs-app serving dist/ at http://localhost:${port}`);
});
