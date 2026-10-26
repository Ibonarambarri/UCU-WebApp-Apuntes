# Visor de apuntes P3 (offline)

Visor y buscador local de los apuntes del **Parcial 3 (React Native + Expo + Expo Router)** y de la
documentación offline de `../docs-offline`. Funciona **sin internet**. Es una copia adaptada del visor
de P2 (`../../P2/visor-apuntes`, puerto 5190): este usa el **5191**, así que se pueden abrir los dos a la vez.

## Arrancar

```bash
cd P3/visor-apuntes
npm install          # una sola vez (con internet)
npm run build-index  # una sola vez, o cuando cambien los .md
npm start            # http://localhost:5191
```

## Re-indexar (cuando cambian los apuntes)

```bash
cd P3/visor-apuntes && npm run build-index
```

Con el servidor andando no hace falta reiniciarlo: recargá la página (F5).

`npm run build-index`:

1. descarga el modelo de embeddings a `public/models/` si no está (única vez que usa internet;
   si copiaste `public/models` de P2 no descarga nada),
2. copia los `.wasm` de onnxruntime a `public/ort/`,
3. lee los `.md`/`.mdx` y genera `public/data/` (documentos limpios, fragmentos, índice MiniSearch
   y embeddings int8).

**Cuánto tarda:** la primera vez ~10 min (unos 10.000 fragmentos de embeddings en CPU). Después,
los embeddings se cachean en `node_modules/.cache/visor-emb/` y solo se recalcula lo que cambió:
re-indexar tras editar apuntes tarda **~10–30 s**. `node scripts/build-index.mjs --no-embed` salta
los embeddings (~3 s, pero el modo semántico queda desactualizado).

## Qué indexa

| Sección | Fuente |
|---|---|
| Mis apuntes (P3) | `P3/*.md` (README, CHULETA-EXAMEN, ESTRATEGIA-EXAMEN, GUIA-ESTUDIO-TARDE, PLAN-DE-RUTA-EXAMEN…), `P3/clase/*.md` (sin subcarpetas), `P3/parciales/*/APUNTES-PARCIAL.md`, `P3/parciales/*/README.md` (enunciados), `P3/docs-offline/INDICE.md` |
| React Native | `docs-offline/react-native-website/docs/` |
| Expo Router | `docs-offline/expo/docs/pages/router/` |
| Expo API (SDK 58) | `docs-offline/expo-api-v58/` (la referencia de props/hooks/métodos) |
| Expo (SDK 58 y guías) | `docs-offline/expo/docs/pages/{versions/v58.0.0,guides,get-started,develop,tutorial,linking}/` |
| AsyncStorage v2 | `docs-offline/async-storage/packages/website/docs/` |
| React (P2) · apuntes | `P2/clase/*.md` |
| React (P2) · docs | `P2/docs-offline/react.dev/src/content/{learn,reference}/` |

Nunca entra nada de `node_modules/` ni el código de las soluciones de los parciales (solo los `.md`
listados). Los archivos parciales de las docs (`_algo.md`) se saltan.

Los `.mdx` de Expo y los `.md` de React Native (Docusaurus) traen `import`s y componentes JSX de la
web: `scripts/mdx-clean.mjs` los pasa a Markdown (`<Terminal>` → bloque bash, `<FileTree>` → lista
de archivos, `<Step>` → "Paso N", `<Collapsible>` / `:::note` → recuadros, `<BoxLink>` → link,
`<APISection>` → link a la página de `expo-api-v58`, etc.). Los links internos entre docs se abren
dentro del visor; los que apuntan a páginas no descargadas abren la web (requiere internet).

Para cambiar qué se indexa: `scripts/build-index.mjs`, sección "1. Descubrir fuentes".

## Buscar

- `/` o `⌘K` enfoca el buscador. `↑`/`↓` + `Enter` abre un resultado.
- Se puede buscar en español: `src/search/synonyms.js` agrega términos en inglés
  (lista → FlatList, botón → Pressable, parámetros de la ruta → useLocalSearchParams,
  guardar → AsyncStorage, al volver a la pantalla → useFocusEffect…). Ese archivo se puede editar
  sin regenerar el índice.
- Tolera errores de tipeo (`useLocalSerchParams`) y busca por prefijo.
- Filtros por fuente. Los apuntes pesan ×2, React Native y Expo Router ×1,5.
- Clic en un resultado abre el documento. La URL guarda la página, así que F5 no la pierde.

## ⚠️ Modo semántico (IA local) y el examen

El interruptor **“Semántico (IA local)”** está **apagado por defecto**. Al activarlo, el navegador
carga un modelo de embeddings local (`Xenova/multilingual-e5-small`, desde `public/models/`, sin
conexión) y combina su resultado con el de palabras clave (fusión RRF). No genera texto, pero **es un
modelo de IA**: confirmá con el docente si está permitido en el examen antes de usarlo. El modo
“palabras clave” no usa ningún modelo.
