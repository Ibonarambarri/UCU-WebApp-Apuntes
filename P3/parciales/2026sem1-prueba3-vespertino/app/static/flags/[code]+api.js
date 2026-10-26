import { StatusError } from 'expo-server';
import { readFileSync } from 'node:fs';
import nodePath from 'node:path';

const IMG_MIME_TYPES = {
  svg: 'image/svg+xml',
  png: 'image/png',
};

export async function GET(_req, { code }) {
  const { ext: fileExt } = nodePath.parse(`${code}`);
  if (!IMG_MIME_TYPES[fileExt.slice(1)]) {
    throw new StatusError(400, `Unsupported flag file extension: ${fileExt}`);
  }
  try {
    const imgFile = readFileSync(
      nodePath.join(process.cwd(), 'app', 'static', 'flags', `${code}`),
    );
    return new Response(imgFile, {
      headers: { 'Content-Type': IMG_MIME_TYPES[fileExt.slice(1)] }
    });
  } catch (error) {
    throw new StatusError(404, `Flag for ${code} not found! ${error}`);
  }
}
