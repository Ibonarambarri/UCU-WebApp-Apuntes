import { Link, useLocation, useParams } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import FavoriteButton from '../FavoriteButton/FavoriteButton.jsx';
import StatusMessage from '../StatusMessage/StatusMessage.jsx';
import { useFetchCountry } from '../../hooks/useFetchCountry.js';
import { useFetchRandomCountry } from '../../hooks/useFetchRandomCountry.js';
import { useFetchCountries } from '../../hooks/useFetchCountries.js';
import { formatList, formatNumber, formatText } from '../../utils/format.js';
import styles from './PageCountry.module.css';

/** /countries/:code — detalle de un país.
 *
 * - `code` sale de la URL con useParams. Cuando hacemos clic en un país
 *   limítrofe, React Router NO desmonta esta página: solo cambia `code`.
 *   Por eso el hook tiene `url` en las dependencias del useEffect y vuelve a
 *   pedir los datos. (Si el efecto tuviera `[]`, se quedaría con el país viejo.)
 * - Los limítrofes vienen solo como códigos (`["ARG", "BRA"]`). Para mostrar
 *   nombre y bandera usamos el listado completo (/api/countries), que ya tiene
 *   esos datos: 1 pedido en vez de 1 por cada vecino.
 */
export default function PageCountry() {
  const { code } = useParams();
  const location = useLocation();

  const isRandom = Boolean(code);
  if (!isRandom) {
    var { data: country, isLoading, error, refetch } = useFetchRandomCountry();
    console.log(country);
    console.log("random");
  } else {
    var { data: country, isLoading, error, refetch } = useFetchCountry(code);
  }


  const { data: allCountries } = useFetchCountries();

  // Si venimos del listado, volvemos a la misma búsqueda (?q=…&sort=…).
  const backTo = `/countries${location.state?.listSearch ?? ''}`;
  const backLink = <Link to={backTo} className={styles.back}>← Volver al listado</Link>;

  if (isLoading) {
    return (
      <div>
        {backLink}
        <StatusMessage text="Cargando país…" />
      </div>
    );
  }

  if (error) {
    // fetchJSON tira un Error con el status en el mensaje ("… failed with 404 Not Found!").
    // Así distinguimos "no existe" (404) de "falló la red / el servidor".
    const notFound = error.message.includes(' 404 ');
    return (
      <div>
        {backLink}
        {notFound ? (
          <StatusMessage type="error" text={`País no encontrado: no existe ningún país con código "${code}".`} />
        ) : (
          <StatusMessage type="error" text={`No se pudo cargar el país. ${error.message}`}>
            <button type="button" onClick={refetch}>Reintentar</button>
          </StatusMessage>
        )}
      </div>
    );
  }

  if (!country) {
    return null;
  }

  // Buscar cada código limítrofe en el listado. Si el listado todavía no
  // cargó, mostramos al menos el código.
  const borders = country.borders.map((borderCode) => {
    const found = allCountries?.find((item) => item.code === borderCode);
    return { code: borderCode, name: found?.name ?? borderCode, flag: found?.flag ?? '' };
  });

  const languages = country.languages.map((language) => language.name);
  // Hay monedas sin símbolo o sin nombre en los datos: armamos el texto con cuidado.
  const currencies = country.currencies.map((currency) => (
    currency.symbol ? `${currency.name} (${currency.symbol})` : currency.name
  ));

  return (
    <div>
      {backLink}

      <div className={styles.title}>
        <span className={styles.flag}>{country.flag}</span>
        <div>
          <Header title={country.name}>
            <FavoriteButton code={country.code} />
          </Header>
          <p className={styles.subtitle}>{country.nativeName} · {country.code}</p>
        </div>
      </div>


      <ul className={styles.borders}>
        <li>
          <Link to={`/countries/?region=${country.region}`} state={location.state} className={styles.border}>
            {country.region} →
          </Link>
        </li>
        <li>
          <Link to={`/countries/?region=${country.region}`} state={location.state} className={styles.border}>
            {country.subregion} →
          </Link>
        </li>
        {country.languages.map((language) => (
          <li key={language.code}>
            {/* <Link> (no <a href>) → navega sin recargar la app.
                  Pasamos el mismo state para no perder la búsqueda del listado. */}
            <Link to={`/countries/?language=${language.code}`} state={location.state} className={styles.border}>
              {language.name} →
            </Link>
          </li>
        ))}
        {country.currencies.map((currencie) => (
          <li key={currencie.code}>
            {/* <Link> (no <a href>) → navega sin recargar la app.
                  Pasamos el mismo state para no perder la búsqueda del listado. */}
            <Link to={`/countries/?currencie=${currencie.code}`} state={location.state} className={styles.border}>
              {currencie.name} →
            </Link>
          </li>
        ))}
      </ul>


      <dl className={styles.facts}>
        <Fact label="Capital" value={formatText(country.capital)} />
        <Fact label="Región" value={formatText(country.region)} />
        <Fact label="Subregión" value={formatText(country.subregion)} />
        <Fact label="Población" value={formatNumber(country.population)} />
        <Fact label="Área" value={country.area === null ? '—' : `${formatNumber(country.area)} km²`} />
        <Fact
          label="Densidad"
          value={country.populationDensity === null ? '—' : `${formatNumber(country.populationDensity, 2)} hab/km²`}
        />
      </dl>

      <h2>Otros datos</h2>
      <dl className={styles.others}>
        <Fact label="Idiomas" value={formatList(languages)} />
        <Fact label="Monedas" value={formatList(currencies)} />
        <Fact label="Husos horarios" value={formatList(country.timezones)} />
        <Fact label="Dominio" value={formatList(country.topLevelDomain)} />
      </dl>

      <h2>Países limítrofes</h2>
      {borders.length === 0 ? (
        <p className={styles.muted}>Este país no tiene fronteras terrestres.</p>
      ) : (
        <ul className={styles.borders}>
          {borders.map((border) => (
            <li key={border.code}>
              {/* <Link> (no <a href>) → navega sin recargar la app.
                  Pasamos el mismo state para no perder la búsqueda del listado. */}
              <Link to={`/countries/${border.code}`} state={location.state} className={styles.border}>
                {border.flag} {border.name} →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Par "etiqueta / valor" dentro de un <dl>. Componente chico definido en el
 * mismo archivo porque solo se usa acá.
 */
function Fact({ label, value }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
