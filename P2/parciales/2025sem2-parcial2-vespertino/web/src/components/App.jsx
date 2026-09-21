// ==============================================
// Archivo: src/components/App.jsx
// Qué hace: define las 9 rutas de la aplicación.
// Idea clave de este parcial: hay muchas vistas casi iguales, así que
//   NO hay un componente por ruta. Reutilizamos:
//   - ListaDePaises (recibe titulo + url de la API) para las rutas 2, 5, 7 y 9.
//   - ListaDeOpciones (recibe titulo + url + rutaBase) para las rutas 4, 6 y 8.
//   Las rutas con parámetro (5, 7, 9) usan un componente chiquito
//   (PaisesPorMoneda, etc.) que lee el parámetro con useParams y arma la url.
// Conceptos: BrowserRouter, Routes, Route, parámetros de ruta, reutilización.
// ==============================================
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ListaDePaises from './ListaDePaises';
import ListaDeOpciones from './ListaDeOpciones';
import PaginaPais from './PaginaPais';
import PaisesPorMoneda from './PaisesPorMoneda';
import PaisesPorLenguaje from './PaisesPorLenguaje';
import PaisesPorZonaHoraria from './PaisesPorZonaHoraria';
import ApiRef from './ApiRef';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta 1: inicio con los 4 enlaces */}
        <Route path="/" element={<Home />} />

        {/* Ruta 2: todos los países. Reutilizamos ListaDePaises pasándole
            directamente la url sin filtros. */}
        <Route
          path="/countries"
          element={<ListaDePaises titulo="All countries" url="/api/countries" />}
        />

        {/* Ruta 3: detalle de un país */}
        <Route path="/countries/:cca3" element={<PaginaPais />} />

        {/* Ruta 4: lista de monedas. Cada una enlaza a /currencies/CODIGO */}
        <Route
          path="/currencies"
          element={
            <ListaDeOpciones
              titulo="Countries by currency"
              url="/api/currencies"
              rutaBase="/currencies"
            />
          }
        />

        {/* Ruta 5: países filtrados por moneda */}
        <Route path="/currencies/:currencyCode" element={<PaisesPorMoneda />} />

        {/* Ruta 6: lista de lenguajes. Cada uno enlaza a /languages/CODIGO */}
        <Route
          path="/languages"
          element={
            <ListaDeOpciones
              titulo="Countries by language"
              url="/api/languages"
              rutaBase="/languages"
            />
          }
        />

        {/* Ruta 7: países filtrados por lenguaje */}
        <Route path="/languages/:languageCode" element={<PaisesPorLenguaje />} />

        {/* Ruta 8: lista de zonas horarias. Cada una enlaza a /timezones/ZONA */}
        <Route
          path="/timezones"
          element={
            <ListaDeOpciones
              titulo="Countries by timezone"
              url="/api/timezones"
              rutaBase="/timezones"
            />
          }
        />

        {/* Ruta 9: países filtrados por zona horaria */}
        <Route path="/timezones/:timezone" element={<PaisesPorZonaHoraria />} />

        {/* Referencia de la API de la plantilla (no es parte de la entrega) */}
        <Route path="/ref/api" element={<ApiRef />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
