// Copies the Vite build output up into game04/, which is what the shared site menu
// actually loads (./game04/index.html, per ../../index.js's openIframe call). Everything
// in game04/ except this _source/ folder and README.md is treated as generated output
// and replaced on every build.
import { cpSync, rmSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.resolve(__dirname, '..');
const distDir = path.join(sourceRoot, 'dist');
const gameDir = path.resolve(sourceRoot, '..');

const KEEP = new Set(['_source', 'README.md']);

for (const entry of readdirSync(gameDir)) {
  if (KEEP.has(entry)) continue;
  rmSync(path.join(gameDir, entry), { recursive: true, force: true });
}

cpSync(distDir, gameDir, { recursive: true });

console.log(`[deploy] copied ${distDir} -> ${gameDir}`);
