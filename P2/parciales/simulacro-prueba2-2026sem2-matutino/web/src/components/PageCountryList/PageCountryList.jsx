import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import CountryCard from '../CountryCard/CountryCard.jsx';
import StatusMessage from '../StatusMessage/StatusMessage.jsx';
import { useFetchCountries } from '../../hooks/useFetchCountries.js';
import { useFetchRegions } from '../../hooks/useFetchRegions.js';
import { useFavorites } from '../../context/FavoritesContext.js';
import { DEFAULT_SORT, SORT_OPTIONS, filterAndSortCountries } from '../../utils/countries.js';
import styles from './PageCountryList.module.css';

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
  const { isFavorite, error: favoritesError } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- 1. Leer el estado desde la URL (con valores por defecto) ---
  const query = searchParams.get('q') ?? '';
  const sortParam = searchParams.get('sort');
  // Si en la URL ponen un orden que no existe (?sort=xyz), usamos el default.
  const sort = Object.hasOwn(SORT_OPTIONS, sortParam ?? '') ? sortParam : DEFAULT_SORT;
  const region = searchParams.get('region') ?? '';
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
    return filterAndSortCountries(countries, { query, region, onlyFavorites, isFavorite, sort });
  }, [countries, query, region, onlyFavorites, isFavorite, sort]);

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
