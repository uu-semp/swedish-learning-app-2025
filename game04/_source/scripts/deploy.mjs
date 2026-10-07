import { cpSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(sourceRoot, 'dist');
const gameDir = path.resolve(sourceRoot, '..');
if (!existsSync(path.join(distDir, 'index.html'))) {
  throw new Error('Build output missing. Run npm run build first.');
}
// Replace only generated output. Keep source files and documentation.
rmSync(path.join(gameDir, 'assets'), { recursive: true, force: true });
cpSync(path.join(distDir, 'assets'), path.join(gameDir, 'assets'), { recursive: true });
cpSync(path.join(distDir, 'index.html'), path.join(gameDir, 'index.html'));
console.log('Updated game04/index.html and game04/assets/');
