import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import CountryCard from '../CountryCard/CountryCard.jsx';
import StatusMessage from '../StatusMessage/StatusMessage.jsx';
import { useFetchCountries } from '../../hooks/useFetchCountries.js';
import { useFetchRegions } from '../../hooks/useFetchRegions.js';
import { useFetchCurrencies } from '../../hooks/useFetchCurrencies.js';
import { useFetchLanguages } from '../../hooks/useFetchLanguages.js';
import { useFavorites } from '../../context/FavoritesContext.js';
import styles from './PageCountryList.module.css';

/** Opciones de orden. La clave (`name`, `population`, `area`) es lo que va en
 * la URL (`?sort=population`) y el texto es lo que se ve en el <select>.
 */
const SORT_OPTIONS = {
  name: 'Nombre (A-Z)',
  population: 'Población (mayor a menor)',
  area: 'Área (mayor a menor)',
};
const DEFAULT_SORT = 'name';

/** Pasa a minúsculas y saca tildes: "Perú" → "peru", "Åland" → "aland".
 * Así buscar "peru" encuentra "Perú".
 */
function normalizeText(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Compara números de mayor a menor mandando los null al final
 * (hay 10 países con `area: null`; sin esto quedarían mezclados).
 */
function compareDescending(a, b) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return b - a;
}

/** /countries — listado con búsqueda, orden, filtro por región y favoritos.
 *
 * IDEA CLAVE: búsqueda, orden y filtros NO se guardan en useState, se guardan
 * en la URL (`?q=uru&sort=population&region=Americas&fav=1`) con
 * useSearchParams. Así al recargar o compartir el link se ve lo mismo.
 * La URL es "el estado": leemos de ahí y escribimos ahí.
 */
export default function PageCountryList() {
  const { data: countries, isLoading, error, refetch } = useFetchCountries();
  const { data: regions } = useFetchRegions();
  const { data: currencies } = useFetchCurrencies();
  const { data: languages } = useFetchLanguages();
  const { isFavorite, error: favoritesError } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- 1. Leer el estado desde la URL (con valores por defecto) ---
  const query = searchParams.get('q') ?? '';
  const sortParam = searchParams.get('sort');
  // Si en la URL ponen un orden que no existe (?sort=xyz), usamos el default.
  const sort = Object.hasOwn(SORT_OPTIONS, sortParam ?? '') ? sortParam : DEFAULT_SORT;
  const region = searchParams.get('region') ?? '';
  const language = searchParams.get('language') ?? '';
  const currencie = searchParams.get('currencie') ?? '';
  const onlyFavorites = searchParams.get('fav') === '1';

  // --- 2. Escribir en la URL ---
  // Cambia UN parámetro y deja los demás como estaban. Si el valor es el de
  // por defecto (vacío), lo borramos para que la URL quede limpia.
  function updateParam(name, value) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) {
        next.set(name, value);
      } else {
        next.delete(name);
      }
      return next;
    }, { replace: true }); // replace: no llenar el historial con cada tecla.
  }

  // --- 3. Datos derivados: se CALCULAN, no se guardan en estado ---
  // useMemo evita recalcular filtro+orden de 250 países en cada render si no
  // cambió nada de lo que usa.
  const visibleCountries = useMemo(() => {
    if (!countries) {
      return [];
    }

    // 3a) FILTRAR: cada filtro se saltea si está vacío.
    const normalizedQuery = normalizeText(query.trim());
    const filtered = countries.filter((country) => {
      if (normalizedQuery && !normalizeText(country.name).includes(normalizedQuery)) {
        return false;
      }
      if (region && country.region !== region) {
        console.log("region update");
        return false;
      }
      if (language) {
        const filterlang = country.lenguages.filter((leng) => leng.code !== language);
        if (filterlang.length > 0) {
          console.log("language update");
          return false;
        }
      }
      if (currencie) {
        const filtercurr = country.currencies.filter((curr) => curr.code !== currencie)
        if (filtercurr.length > 0) {
          console.log("currencie update");
          return false;
        }
      }
      if (onlyFavorites && !isFavorite(country.code)) {
        return false;
      }
      return true;
    });

    // 3b) ORDENAR: sort() modifica el array, pero `filtered` ya es un array
    // NUEVO (lo creó filter), así que no tocamos los datos del hook.
    return filtered.sort((a, b) => {
      if (sort === 'population') {
        return compareDescending(a.population, b.population);
      }
      if (sort === 'area') {
        return compareDescending(a.area, b.area);
      }
      return a.name.localeCompare(b.name);
    });
  }, [countries, query, region, currencie, language, onlyFavorites, isFavorite, sort]);

  // --- 4. Qué mostrar según el estado del pedido ---
  let content;
  if (isLoading) {
    content = <StatusMessage text="Cargando países…" />;
  } else if (error) {
    content = (
      <StatusMessage type="error" text={`No se pudieron cargar los países. ${error.message}`}>
        <button type="button" onClick={refetch}>Reintentar</button>
      </StatusMessage>
    );
  } else if (visibleCountries.length === 0) {
    content = (
      <StatusMessage
        text={query
          ? `No se encontraron países para "${query}".`
          : 'No hay países que cumplan los filtros.'}
      />
    );
  } else {
    content = (
      <ul className={styles.list}>
        {visibleCountries.map((country) => (
          <CountryCard key={country.code} country={country} />
        ))}
      </ul>
    );
  }

  return (
    <div>
      <Header title="Países" />

      <div className={styles.controls}>
        <input
          type="search"
          className={styles.search}
          placeholder="Buscar por nombre…"
          value={query}
          onChange={(event) => updateParam('q', event.target.value)}
        />
        <label>
          Orden:{' '}
          <select
            value={sort}
            // Si eligen el default ("name") lo sacamos de la URL.
            onChange={(event) => updateParam('sort', event.target.value === DEFAULT_SORT ? '' : event.target.value)}
          >
            {Object.entries(SORT_OPTIONS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label>
          Región:{' '}
          <select value={region} onChange={(event) => updateParam('region', event.target.value)}>
            <option value="">Todas</option>
            {(regions ?? []).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          Moneda:{' '}
          <select value={currencie} onChange={(event) => updateParam('currencie', event.target.value)}>
            <option value="">Todas</option>
            {(currencies ?? []).map((currencie) => (
              <option key={currencie.code} value={currencie.code}>{currencie.name} |{currencie.countries}|</option>
            ))}
          </select>
        </label>
        <label>
          Idioma:{' '}
          <select value={language} onChange={(event) => updateParam('language', event.target.value)}>
            <option value="">Todas</option>
            {(languages ?? []).map((language) => (
              <option key={language.code} value={language.code}>{language.name} |{language.countries}|</option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={onlyFavorites}
            onChange={(event) => updateParam('fav', event.target.checked ? '1' : '')}
          />
          {' '}Solo favoritos
        </label>
      </div>

      {favoritesError && (
        <StatusMessage type="error" text={`Error con los favoritos: ${favoritesError.message}`} />
      )}

      {countries && (
        <p className={styles.count}>
          Mostrando {visibleCountries.length} de {countries.length} países
        </p>
      )}

      {content}
    </div>
  );
}
