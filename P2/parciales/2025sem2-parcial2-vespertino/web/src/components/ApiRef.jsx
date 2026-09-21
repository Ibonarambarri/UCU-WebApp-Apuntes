import { useEffect, useState } from "react";

function useFetchCountries() {
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    async function fetchCountries() {
      const reqCountries = await fetch(new URL('/api/countries', window.location));
      if (reqCountries.ok) {
        const countries = await reqCountries.json();
        setCountries(countries.sort((a, b) => a.localeCompare(b)));
      }
    }
    fetchCountries();
  }, []);

  return countries;
}

function useFetchCountry(cca3) {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    async function fetchCountry() {
      if (cca3) {
        const reqCountry = await fetch(new URL(`/api/countries/${cca3}`, window.location));
        if (reqCountry.ok) {
          const countryData = await reqCountry.json();
          setCountry(countryData);
        }
      }
    }
    fetchCountry();
  }, [cca3]);

  return country;
}

export default function ApiRef() {
  const allCountryCodes = useFetchCountries();
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const selectedCountry = useFetchCountry(selectedCountryCode);
  const selectedCurrency = selectedCountry ? Object.keys(selectedCountry.currencies)[0] : null;
  const selectedLanguage = selectedCountry ? Object.keys(selectedCountry.languages)[0] : null;
  const selectedTimezone = selectedCountry ? selectedCountry.timezones[0] : null;

  return (
    <div>
      <h1>Referencia de API</h1>
      <ul>
        <li>
          Lista de monedas en la base de datos:{' '}
          <a href="/api/currencies" target="_blank">/api/currencies</a>
        </li>
        <li>
          Lista de lenguajes en la base de datos:{' '}
          <a href="/api/languages" target="_blank">/api/languages</a>
        </li>
        <li>
          Lista de usos horarios en la base de datos:{' '}
          <a href="/api/timezones" target="_blank">/api/timezones</a>
        </li>
        <li>
          Lista de códigos (CCA3) de todos los países en la base de datos:{' '}
          <a href="/api/countries" target="_blank">/api/countries</a>
        </li>
        <ul>
          {allCountryCodes && (<li>
            Detalles de un país dado 
            <select
              onChange={(e) => {
                setSelectedCountryCode(e.target.value);
              }}
              value={selectedCountryCode}
              style={{ width: '6rem', marginLeft: '0.5rem' }}
            >
              <option value="" disabled selected>Eligir país</option>
              {allCountryCodes && allCountryCodes.map((cca3) => (
                <option key={cca3} value={cca3}>{cca3}</option>
              ))}
            </select>
            {selectedCountry && (<>
              :{' '}
              <a href={`/api/countries/${encodeURIComponent(selectedCountryCode)}`} target="_blank">
                /api/countries/{encodeURIComponent(selectedCountryCode)}
              </a>
            </>)}
          </li>)}
          {selectedCountry && (<li>
            Bandera del país {selectedCountryCode}:{' '}
            <a href={`/flags/${encodeURIComponent(selectedCountryCode)}.svg`} target="_blank">
              /flags/{encodeURIComponent(selectedCountryCode)}.svg
            </a>
          </li>)}
          {selectedCountry && (<li>
            Contorno del mapa del país {selectedCountryCode}:{' '}
            <a href={`/maps/${encodeURIComponent(selectedCountryCode)}.svg`} target="_blank">
              /maps/{encodeURIComponent(selectedCountryCode)}.svg
            </a>
          </li>)}
          {selectedCurrency && (<li>
            Lista de países filtrada por una moneda (por ej. {selectedCurrency}):{' '}
            <a href={`/api/countries/?currency=${encodeURIComponent(selectedCurrency)}`} target="_blank">
              /api/countries/?currency={encodeURIComponent(selectedCurrency)}
            </a>
          </li>)}
          {selectedLanguage && (<li>
            Lista de países filtrada por un lenguaje (por ej. {selectedLanguage}):{' '}
            <a href={`/api/countries/?language=${encodeURIComponent(selectedLanguage)}`} target="_blank">
              /api/countries/?language={encodeURIComponent(selectedLanguage)}
            </a>
          </li>)}
          {selectedTimezone && (<li>
            Lista de países filtrada por un uso horario (por ej. {selectedTimezone}):{' '}
            <a href={`/api/countries/?timezone=${encodeURIComponent(selectedTimezone)}`} target="_blank">
              /api/countries/?timezone={encodeURIComponent(selectedTimezone)}
            </a>
          </li>)}
          {selectedCurrency && selectedLanguage && selectedTimezone && (<li>
            Lista de países filtrada por varios criterios:{' '}
            <a href={`/api/countries/?currency=${encodeURIComponent(selectedCurrency)}&language=${encodeURIComponent(selectedLanguage)}&timezone=${encodeURIComponent(selectedTimezone)}`} target="_blank">
              /api/countries/?currency={encodeURIComponent(selectedCurrency)}&language={encodeURIComponent(selectedLanguage)}&timezone={encodeURIComponent(selectedTimezone)}
            </a>
          </li>)}
        </ul>
      </ul>
    </div>
  );
}
