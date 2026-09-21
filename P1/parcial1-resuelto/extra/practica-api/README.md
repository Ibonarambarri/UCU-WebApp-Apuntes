# Práctica — DOM + API (json-server)

App CRUD completa y funcionando, con **las 5 operaciones** que pueden pedir:
listar (GET), crear (POST), editar un campo (PATCH), reemplazar (PUT) y borrar
(DELETE). Es la referencia para el ej03/ej04 de cualquier año.

```bash
npm start     # http://localhost:3000/
```

`node_modules` ya está instalado, así que corre sin internet.

## Cómo usarla para practicar

1. Leé `public/app.js` una vez entero. Es corto y está comentado.
2. Después borrá el cuerpo de `loadTasks`, `addTask`, `toggleDone`, `renameTask`
   y `deleteTask`, y volvé a escribirlas sin mirar.
3. `git checkout public/app.js` para recuperarlo (o mirá el original en el repo).

## Endpoints de json-server

Con `db.json = { "tasks": [...] }`:

| Método | URL | Qué hace |
|---|---|---|
| GET | `/tasks` | lista todo |
| GET | `/tasks/1` | uno |
| GET | `/tasks?done=true` | filtra por campo |
| POST | `/tasks` | crea (no mandes `id`) |
| PATCH | `/tasks/1` | cambia sólo los campos que mandes |
| PUT | `/tasks/1` | reemplaza el objeto entero |
| DELETE | `/tasks/1` | borra |

`-s ./public` en el script `start` hace que json-server además **sirva la página**
desde esa carpeta. Por eso `new URL('/tasks', window.location)` funciona sin
hardcodear `localhost:3000`.
