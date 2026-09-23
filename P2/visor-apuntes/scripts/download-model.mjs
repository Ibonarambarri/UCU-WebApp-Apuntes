// Descarga (una sola vez) el modelo de embeddings a public/models/ para uso 100% offline.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MODEL_ID = 'Xenova/multilingual-e5-small';
const FILES = ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'special_tokens_map.json', 'onnx/model_quantized.onnx'];
const dir = path.join(ROOT, 'public', 'models', MODEL_ID);

for (const f of FILES) {
  const dest = path.join(dir, f);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) continue;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const url = `https://huggingface.co/${MODEL_ID}/resolve/main/${f}`;
  console.log(`Descargando ${url} ...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar ${url}: ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}
console.log(`Modelo listo en public/models/${MODEL_ID}`);
