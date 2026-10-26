import { StatusError } from 'expo-server';
import { readFileSync } from 'node:fs';
import nodePath from 'node:path';

const IMG_MIME_TYPES = {
  svg: 'image/svg+xml',
  png: 'image/png',
};

export async function GET(_req, { cca3 }) {
  const { ext: fileExt } = nodePath.parse(`${cca3}`);
  if (!IMG_MIME_TYPES[fileExt.slice(1)]) {
    throw new StatusError(400, `Unsupported flag file extension: ${fileExt}`);
  }
  try {
    const svgFile = readFileSync(
      nodePath.join(process.cwd(), 'app', 'static', 'maps', `${cca3}`),
    );
    return new Response(svgFile, {
      headers: { 'Content-Type': IMG_MIME_TYPES[fileExt.slice(1)] }
    });
  } catch (error) {
    throw new StatusError(404, `Map for ${cca3} not found! ${error}`);
  }
}
