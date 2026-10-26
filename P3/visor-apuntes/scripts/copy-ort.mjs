// Copia los .wasm/.mjs de onnxruntime-web a public/ort/ para no depender de ningún CDN.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(ROOT, 'node_modules', 'onnxruntime-web', 'dist');
const dest = path.join(ROOT, 'public', 'ort');
fs.mkdirSync(dest, { recursive: true });
for (const f of fs.readdirSync(src)) {
  if (/^ort-wasm-simd-threaded(\.asyncify)?\.(wasm|mjs)$/.test(f)) {
    fs.copyFileSync(path.join(src, f), path.join(dest, f));
    console.log('copiado', f);
  }
}
