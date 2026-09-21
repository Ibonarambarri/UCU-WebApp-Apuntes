import nodeFS from 'node:fs/promises';
import nodePath from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));

// See <https://restcountries.com/>.
const countriesUrl = (fields) => new URL(
  `https://restcountries.com/v3.1/all?fields=${fields.join(',')}`
);

// See <https://gitlab.com/restcountries/restcountries/-/blob/master/FIELDS.md>.
const FIELDS = [
  'borders', 'capital', 'cca2', 'cca3', 'currencies', 'flags', 'languages',
  'name', 'timezones',
];

const mapUrl = (cca2) => new URL(
  `https://raw.githubusercontent.com/djaiss/mapsicon/refs/heads/master/all/${cca2.toLowerCase()}/vector.svg`
);

async function httpGet(url) {
  const req = await fetch(url);
  if (!req.ok) {
    throw new Error(`GET <${url}> failed with ${req.status} ${req.statusText}!`);
  }
  return req.text();
}

async function writeIfNotExists(path, dataFn) {
  try {
    return await nodeFS.readFile(path, { encoding: 'utf-8' });
  } catch {
    const data = await dataFn();
    if (data) {
      await nodeFS.writeFile(path, data);
    }
    return data;
  }
}

async function main() {
  const countriesData = JSON.parse(await httpGet(countriesUrl(FIELDS)));
  const cca3Codes = countriesData.map((country) => country.cca3)
    .filter((x) => !!x)
    .sort();
  console.log(`Fetched ${countriesData.length} countries, processing ${cca3Codes.length}.`);

  const countries = {};
  for (const cca3 of cca3Codes) {
    const { flags, ...countryData } = countriesData.find((country) => country.cca3 === cca3);

    const flagSVG = await writeIfNotExists(
      nodePath.join(__dirname, `./static/flags/${cca3}.svg`),
      () => httpGet(flags.svg).catch((err) => {
        console.error(`Failed to fetch flag for ${cca3}:`, err);
        return null;
      }),
    );
    const mapSVG = await writeIfNotExists(
      nodePath.join(__dirname, `./static/maps/${cca3}.svg`),
      () => httpGet(mapUrl(countryData.cca2)).catch((err) => {
        console.error(`Failed to fetch map for ${cca3}:`, err);
        return null;
      }),
    );

    countries[cca3] = {
      ...countryData,
      id: cca3,
      ...(flagSVG ? { flag: { alt: flags.alt, svg: `/flags/${cca3}.svg` } } : null),
      ...(mapSVG ? { map: { svg: `/maps/${cca3}.svg` } } : null),
    };
    console.log(`Processed ${cca3}: flag ${flagSVG?.length ?? 'no'}, map ${mapSVG?.length ?? 'no'}.`);
  }
  const data = { countries };

  await nodeFS.writeFile(nodePath.join(__dirname, './db/data.json'), JSON.stringify(data, null, 2));
}

main().catch((error) => {
  console.error('Fatal error:', error);
  // eslint-disable-next-line no-undef
  process.exit(1);
});
