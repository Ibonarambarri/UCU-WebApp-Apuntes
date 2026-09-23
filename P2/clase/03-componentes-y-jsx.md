# Tema 3 — Componentes y JSX

## 3.1 Un componente es una función que devuelve "HTML"

```jsx
export default function Header({ title }) {
  return (
    <div className="header">
      <h1>{title}</h1>
    </div>
  );
}
```
Se usa como una etiqueta propia: `<Header title="Países" />`.

**Idea clave:** React **llama a esa función cada vez que necesita dibujar** el componente
(*re-render*). Todo el código de adentro (`const`, `filter`, `map`) **se vuelve a ejecutar
en cada re-render**. Por eso una lista filtrada se puede calcular ahí mismo (tema 9).

## 3.2 JSX ≠ HTML

| HTML | JSX | Por qué |
|---|---|---|
| `class="card"` | `className="card"` | `class` es palabra reservada de JS |
| `for="nombre"` | `htmlFor="nombre"` | ídem `for` |
| `<input>` `<br>` `<img>` | `<input />` `<br />` `<img />` | en JSX **toda** etiqueta se cierra |
| `onclick="..."` | `onClick={...}` | camelCase y recibe una **función** |
| `style="color: red"` | `style={{ color: 'red' }}` | style es un **objeto** (de ahí las dobles llaves) |

## 3.3 Llaves `{ }` = "acá va JavaScript"

```jsx
<h1>{country.name}</h1>
<p>Mostrando {visibles.length} de {total}</p>
<span>{active ? '★' : '☆'}</span>
<Link to={`/countries/${code}`}>
<div className={styles.card}>
```
⚠️ Solo **expresiones** (algo que da un valor). `if`, `for`, `const` → **antes** del `return`:
```jsx
let status;
if (winner) status = `${winner} Wins`;
else status = 'Draw!';
return <p>{status}</p>;
```
(Así lo hacen `TicTacToeGame.jsx` y `PageCountryList.jsx` con su variable `content`.)

## 3.4 Un solo elemento raíz

```jsx
return (
  <>                    {/* Fragment: agrupa sin agregar un div */}
    <Header title="…" />
    <ul>…</ul>
  </>
);
```
Los paréntesis del `return ( … )` permiten escribir el JSX en varias líneas.

## 3.5 Reglas de nombre

- Componente **con mayúscula**: `<Header />`. En minúscula React cree que es HTML.
- Función que empieza con **`use`** = **hook** (`useState`, `useFetchPlayers`).
- Componentes chicos que solo se usan en un archivo pueden vivir ahí (ej. `Fact` en `PageCountry.jsx`).

## 3.6 ¿Cuándo crear un componente nuevo?

Cuando **algo se repite** (cada tarjeta → `CountryCard`) o cuando un archivo se hace largo.
En 2025 uno de los criterios fue **reutilizar componentes** (`ListaDePaises` en 9 rutas, [tema 4](04-props-y-children.md)).

## 3.7 Comentarios en JSX

```jsx
return (
  <div>
    {/* comentario dentro del JSX: llaves + barra-asterisco */}
    <h1>{title}</h1>   {/* <!-- esto NO: es HTML --> */}
  </div>
);
```
Fuera del `return` (JS normal) se usa `//` como siempre.

## 3.8 Errores de consola de esta parte

| Qué hiciste | Qué ves |
|---|---|
| `function card()` en minúscula | no se dibuja / *"The tag <card> is unrecognized in this browser"* |
| Olvidaste `export default` | *"does not provide an export named 'default'"* |
| Dos elementos hermanos sin raíz | *"Adjacent JSX elements must be wrapped in an enclosing tag"* |
| `class=` / `for=` | *"Invalid DOM property `class`. Did you mean `className`?"* |
| Import con mayúscula distinta al archivo (`Navbar` vs `NavBar`) | *"Failed to resolve import"* (en Mac a veces anda, en Linux no) |

📂 **Verlo funcionando:** `Ejers/UT4/TA01-card-props/src/componentes/Card.jsx`,
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/CountryCard/CountryCard.jsx`,
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountry/PageCountry.jsx` (componente chico `Fact`).

---

## ❓ Repaso

**Pregunta:** ¿qué errores tiene?
```jsx
export default function tarjeta({ country }) {
  return (
    <h2 class="titulo">{country.name}</h2>
    <img src={country.flagUrl}>
    <p>{if (country.capital) country.capital}</p>
  );
}
```

**Respuesta — 5 errores:**
1. `tarjeta` en minúscula → `Tarjeta`.
2. `class` → `className`.
3. `<img>` sin cerrar → `<img />`.
4. `if` dentro de `{ }` → no se puede (usar expresión o sacarlo antes del return).
5. **Tres elementos hermanos sin raíz** → envolver en `<>…</>`. *(El que faltó en clase.)*

```jsx
export default function Tarjeta({ country }) {
  return (
    <>
      <h2 className="titulo">{country.name}</h2>
      <img src={country.flagUrl} />
      <p>{country.capital ?? '—'}</p>
    </>
  );
}
```
Regla práctica: **si cabe en una expresión → adentro** (`??`, ternario, `&&`); **si es lógica larga → afuera**, antes del `return`.
