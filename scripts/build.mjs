// Bundles index.css (and everything it @imports) into dist/index.css, minified and lowered to the browser baseline.
import { bundle } from 'lightningcss';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Browser baseline (documented in the readme): evergreen browsers from early 2023 onwards.
// These support CSS nesting (lowered anyway), `color-mix()`, `:is()`/`:where()` and `svh`.
const targets = {
  chrome: 111 << 16,
  edge: 111 << 16,
  firefox: 113 << 16,
  safari: (16 << 16) | (4 << 8),
  ios_saf: (16 << 16) | (4 << 8),
};

const root = resolve(import.meta.dirname, '..');
const { code } = bundle({
  filename: resolve(root, 'index.css'),
  minify: true,
  targets,
});

mkdirSync(resolve(root, 'dist'), { recursive: true });
writeFileSync(resolve(root, 'dist/index.css'), code);
console.log(`dist/index.css ${(code.length / 1024).toFixed(1)} kB`);
