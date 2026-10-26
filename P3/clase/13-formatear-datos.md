# Tema 13 — Formatear datos para mostrar

> Regla: **los datos se guardan crudos** (`3473727`, `"2026-10-24T11:30:46.726Z"`, `null`) y se
> formatean **al dibujar**, con funciones chicas en `common/format.js`. Nunca guardes el string
> formateado en el estado.

## 13.1 Separador de miles a mano (el del simulacro)

```js
// common/format.js
export function formatNumber(value) {
  if (value === null || value === undefined) return '—';           // 13.5
  const [integer, decimals] = String(value).split('.');            // "0.44" → ["0", "44"]
  const withDots = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');  // punto cada 3 cifras desde la derecha
  return decimals ? `${withDots},${decimals}` : withDots;          // decimales con coma
}
```
Resultados reales (probados con Node):

| `value` | `formatNumber(value)` |
|---|---|
| `3473727` | `3.473.727` |
| `0.44` (Vaticano) | `0,44` |
| `181034.5` | `181.034,5` |
| `1234` | `1.234` |
| `-1234567` | `-1.234.567` |
| `null` | `—` |

La regex, en castellano: `\B` = "no en un borde de palabra" (no pone punto al principio);
`(?=(\d{3})+(?!\d))` = "mirando adelante hay grupos de 3 dígitos hasta el final". No la tenés que
entender para usarla: **copiala**.

⚠️ Separá parte entera y decimal **antes** de la regex: si no, `181034.567` agrega puntos en los decimales.

## 13.2 `toLocaleString` / `Intl.NumberFormat`: más corto, pero puede variar

```js
(3473727).toLocaleString('es-UY');                                 // "3.473.727"
new Intl.NumberFormat('es-UY', { maximumFractionDigits: 2 }).format(181034.567);  // "181.034,57"
```
Probado en Node:

| Locale | `3473727` | `1234` | `0.44` |
|---|---|---|---|
| `'es-UY'` / `'es-AR'` | `3.473.727` | `1.234` | `0,44` |
| `'es-ES'` | `3.473.727` | **`1234`** ⚠️ (España no separa 4 cifras) | `0,44` |
| `'en-US'` o **sin argumento** | `3,473,727` | `1,234` | `0.44` |

Por qué la plantilla lo hace **a mano**:
1. **Sin locale** usa el idioma del **dispositivo** → en un celular en inglés sale `3,473,727`.
2. En el celular el JS corre en **Hermes**, no en el navegador: el soporte de `Intl` depende de la
   plataforma/versión. A mano sale **igual en web, Android e iOS**.

| Quiero… | Uso |
|---|---|
| Exactamente `3.473.727` en todos lados | `formatNumber` a mano (13.1) |
| Rápido y aceptable | `value.toLocaleString('es-UY')` (**siempre** con locale) |
| Redondear a N decimales | `Number(value.toFixed(2))` antes de formatear, o `maximumFractionDigits` |
| Porcentaje | `` `${Math.round(part / total * 100)} %` `` |
| Precio | `` `$ ${formatNumber(price)}` `` (2025sem1: `formatPrice`) |

## 13.3 Unidades y textos según un tipo (`STATS`)

Cuando el **mismo** componente muestra cosas distintas según un campo (`stat`), armá un objeto de
"diccionario" en vez de `if`/ternarios por todos lados:
```js
export const STATS = {
  population: { question: 'habitantes', unit: 'habitantes' },
  area:       { question: 'superficie', unit: 'km²' },
};
export function formatStat(stat, value) {
  return `${formatNumber(value)} ${STATS[stat]?.unit ?? ''}`;     // "181.034 km²"
}
```
```jsx
<Text>¿{other.name} tiene más o menos {STATS[stat].question} que {game.current.name}?</Text>
<Text>{hidden ? '?' : formatNumber(country[stat])}</Text>     {/* country['area'] = country.area */}
<Text>{STATS[stat]?.unit}</Text>
```
- `country[stat]`: **acceso con corchetes** porque el nombre del campo está en una variable.
- `km²`: el `²` se escribe tal cual (es un carácter Unicode, no hace falta escaparlo).

## 13.4 Fechas ISO → algo legible

La API manda `"finishedAt": "2026-10-24T11:30:46.726Z"` (ISO, en **UTC**: la `Z`).

```js
const date = new Date(iso);
date.toLocaleDateString('es-UY');                                  // "24/10/2026"
date.toLocaleString('es-UY');                                      // "24/10/2026, 8:30:46 a. m."  ← hora de Uruguay (UTC−3)
date.toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' });  // "24 de octubre de 2026"
date.toLocaleString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit' });  // 2025sem1: formatDate
```
**A mano, sin depender de `Intl`** (solo la fecha, tal cual viene en UTC):
```js
export function formatDate(iso) {
  if (!iso) return '—';
  return iso.slice(0, 10).split('-').reverse().join('/');          // "2026-10-24…" → "24/10/2026"
}
```
⚠️ `toLocale…` convierte a la **zona horaria del dispositivo** (11:30 Z → 8:30 en Uruguay). El
recorte a mano no convierte. Para ordenar por fecha **no** formatees: los ISO se comparan como
strings (`a.finishedAt.localeCompare(b.finishedAt)`, así ordena el ranking en `data/games.js`).

## 13.5 `null`, `undefined` y listas vacías

```js
formatNumber(country.area)                 // null → "—" (10 países sin superficie en el dataset)
country.capital ?? 'Sin capital'           // ?? solo reemplaza null/undefined (no 0 ni '')
list.length > 0 ? list.join(', ') : '—'    // arrays vacíos
game.next?.name                            // ?. si puede no venir (partida ganada: next es null)
```
⚠️ `value || '—'` está **mal** para números: `0 || '—'` da `'—'`. Usá `??` o compará con `null`.

## 13.6 Plurales

```js
const plural = (n, one, many) => `${formatNumber(n)} ${n === 1 ? one : many}`;
plural(1, 'punto', 'puntos');      // "1 punto"
plural(7, 'punto', 'puntos');      // "7 puntos"
plural(0, 'vida', 'vidas');        // "0 vidas"
```

## 13.7 Banderas: emoji vs. imagen PNG

La API manda las dos: `"flag": "🇺🇾"` y `"flagUrl": "/static/flags/URY.png"`.

| | Emoji `flag` | Imagen `flagUrl` |
|---|---|---|
| Cómo | `<Text style={{ fontSize: 48 }}>{country.flag}</Text>` | `<Image source={{ uri: expoDevServerUri(country.flagUrl) }} style={{ width: 80, height: 54 }} />` |
| Pro | una línea, sin red | se ve **igual en todos lados** |
| Contra | **Windows no dibuja banderas emoji** (sale "UY" en letras) | necesita `expoDevServerUri` + tamaño |

**El README recomienda la imagen.** Si usás `Image` de RN: `resizeMode="contain"`; con
`expo-image`: `contentFit="contain"` (tema 16.8).
⚠️ 2025sem2 servía banderas **`.svg`** (`/static/flags/URY.svg`): `Image` de RN no dibuja SVG en el
celular; `expo-image` sí → por eso esas soluciones usan `expo-image`. En 2026sem2 son `.png`.

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/common/format.js` ·
`.../components/CountryCard.jsx` (`STATS`, `country[stat]`, "?") · `.../data/games.js` (orden por ISO) ·
`parciales/2025sem1-simulacro-rn/mobile/lib/format.js` (`formatPrice`, `formatDate` con `toLocaleString`)

---

## ❓ Repaso

**Pregunta:** ¿qué muestra cada línea en un iPhone configurado en inglés?
```js
(3473727).toLocaleString();
formatNumber(3473727);
formatNumber(0);
0 || '—';
```

**Respuesta:**
- `"3,473,727"` — sin locale usa el idioma del dispositivo (inglés: coma de miles). Por eso la plantilla lo hace a mano.
- `"3.473.727"` — igual en todos lados.
- `"0"` — `formatNumber` solo devuelve `'—'` para `null`/`undefined`.
- `'—'` — el `||` trata al `0` como falso: para números usá `??`.
