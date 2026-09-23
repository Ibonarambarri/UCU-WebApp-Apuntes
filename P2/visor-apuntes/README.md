# Visor de apuntes (offline)

Visor y buscador local de los apuntes del Parcial 2 y de la documentación offline
(`../docs-offline`: React, React Router v6 y MDN). Funciona **sin internet**.

## Arrancar

```bash
npm install          # una sola vez (con internet)
npm run build-index  # una sola vez, o cuando cambien los apuntes (~2–7 min)
npm start            # http://localhost:5190
```

## Regenerar el índice

`npm run build-index`:

1. descarga el modelo de embeddings a `public/models/` si no está (única vez que usa internet),
2. copia los `.wasm` de onnxruntime a `public/ort/`,
3. lee los `.md` de `P2/` y genera `public/data/` (documentos limpios, fragmentos,
   índice MiniSearch y embeddings int8).

Los embeddings se cachean en `node_modules/.cache/visor-emb/`: si solo cambiaste
un apunte, se recalcula solo lo nuevo. `node scripts/build-index.mjs --no-embed`
salta los embeddings (más rápido, pero el modo semántico queda desactualizado).

## Buscar

- `/` o `⌘K` enfoca el buscador. `↑`/`↓` + `Enter` abre un resultado.
- Se puede buscar en español: `src/search/synonyms.js` agrega términos en inglés
  (ordenar → sort, ruta → route, parámetros de la url → searchParams…). Ese archivo
  se puede editar sin regenerar el índice.
- Tolera errores de tipeo (`useSerchParams`) y busca por prefijo.
- Filtros por fuente (Mis apuntes, React, Router, MDN…). Los apuntes pesan ×2 y
  React/Router ×1,5 frente a MDN.
- Clic en un resultado abre el documento en la sección correspondiente. La URL
  guarda la página, así que F5 no la pierde.

## ⚠️ Modo semántico (IA local) y el examen

El interruptor **“Semántico (IA local)”** está **apagado por defecto**. Al activarlo,
el navegador carga un modelo de embeddings local (`Xenova/multilingual-e5-small`,
desde `public/models/`, sin conexión) y combina su resultado con el de palabras clave
(fusión RRF). No genera texto, pero **es un modelo de IA**: confirmá con el docente
si está permitido en el examen antes de usarlo. El modo “palabras clave” no usa ningún
modelo.
