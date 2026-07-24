// Dev-time only: copies the exact self-hosted font files this site ships from
// their npm packages into src/assets/fonts/. Runs via the `postinstall` script.
// Only the Latin subset is copied (covers English + Italian) — no CDN, no
// runtime font-fetching, consistent with TinyDI's zero-dependency ethic.
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const destDir = join(rootDir, 'src/assets/fonts');
mkdirSync(destDir, { recursive: true });

const files = [
  [
    '@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2',
    'archivo-variable-latin.woff2',
  ],
  [
    '@fontsource-variable/spline-sans-mono/files/spline-sans-mono-latin-wght-normal.woff2',
    'spline-sans-mono-variable-latin.woff2',
  ],
];

for (const [source, destName] of files) {
  const sourcePath = join(rootDir, 'node_modules', source);
  const destPath = join(destDir, destName);
  copyFileSync(sourcePath, destPath);
  console.log(`copied ${destName}`);
}
