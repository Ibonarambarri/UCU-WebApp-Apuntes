import { readFileSync } from 'node:fs';
import nodePath from 'node:path';

// Serves the files in `data/static` under `/static/...`.
const STATIC_PATH = nodePath.join(process.cwd(), 'data', 'static');

const MIME_TYPES = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json',
};

export function GET(_request, { path }) {
  const filePath = nodePath.join(STATIC_PATH, ...[path].flat());
  const mimeType = MIME_TYPES[nodePath.extname(filePath).toLowerCase()];
  if (!filePath.startsWith(STATIC_PATH + nodePath.sep) || !mimeType) {
    return Response.json({ error: 'Unsupported static file' }, { status: 400 });
  }
  try {
    return new Response(readFileSync(filePath), {
      headers: { 'Content-Type': mimeType },
    });
  } catch {
    return Response.json({ error: 'Static file not found' }, { status: 404 });
  }
}
