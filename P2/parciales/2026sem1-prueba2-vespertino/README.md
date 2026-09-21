# Prueba 2 — DWYM 2026 Sem 1 Vespertino

## Descripción del proyecto

Esta aplicación es un **tablero de gestión de tareas** estilo Trello. Permite visualizar las tareas del proyecto en columnas según su estado, gestionar tareas y visualizar métricas generales del proyecto.

Las tareas tienen tres estados posibles:

- **To Do** — Sin comenzar
- **In Progress** — En progreso
- **Done** — Completada

La información de las tareas es obtenida y persistida a través de **json-server** (REST API local).

---

## Cómo correr el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar el servidor de prueba

Para levantar la API en [http://localhost:3001](http://localhost:3001) se ejecuta en una terminal separada el comando:

```bash
npm run server
```

Para levantar el _frontend_ en [http://localhost:5173](http://localhost:5173) se ejecuta en una terminal separada el comando:

```bash
npm run dev
```

> **Tip:** Podés correr ambos con `npm start` si tenés `concurrently` disponible.

---

## Estructura del proyecto

```txt
src/
├── components/
│   ├── AssigneesChart/     # Gráfico de tareas completadas por persona
│   │   ├── AssigneesChart.jsx
│   │   └── AssigneesChart.module.css
│   ├── Board/              # Tablero principal
│   │   ├── Board.jsx
│   │   └── Board.module.css
│   ├── Navbar/             # Barra superior
│   │   ├── Navbar.jsx
│   │   └── Navbar.module.css
│   ├── ProgressBar/        # Barra de progreso
│   │   ├── ProgressBar.jsx
│   │   └── ProgressBar.module.css
│   └── TaskCard/           # Tarjeta individual de tarea
│       ├── TaskCard.jsx
│       └── TaskCard.module.css
├── pages/
│   ├── BoardPage/          # Página principal
│   │   ├── BoardPage.jsx
│   │   └── BoardPage.module.css
│   └── TaskFormPage/       # Página de crear/editar tarea
│       ├── TaskFormPage.jsx
│       └── TaskFormPage.module.css
├── context/
│   └── TasksContext.jsx
├── services/
│   └── taskService.js
├── App.jsx
├── App.module.css
├── index.css
└── main.jsx

db.json                     # Base de datos json-server
```

---

## Consignas para el estudiante

> **Importante:** Respetá la estructura de carpetas y el uso de CSS Modules. Cada componente debe estar en su propia carpeta con su archivo `.module.css`.

La prueba contiene **6 ejercicios**.

- Cada ejercicio tiene el mismo valor.
- Completando correctamente **5 de los 6 ejercicios** se obtiene el **100% del puntaje**.

---

## Ejercicio 1 — Renderizado de columnas y tareas

Implementar los componentes faltantes para poder representar las tareas en sus respectivas columnas.

Cada columna debe mostrar únicamente las tareas correspondientes a su estado:

- `To Do`
- `In Progress`
- `Done`

### Criterios de evaluación

- Las columnas se renderizan correctamente.
- Las tareas aparecen en la columna correspondiente.
- Se utilizan componentes reutilizables.
- El renderizado se realiza dinámicamente.

---

## Ejercicio 2 — Obtener tareas desde json-server

Traer las tareas desde el backend (`json-server`) y renderizarlas de forma dinámica e iterativa en sus respectivas columnas.

La información debe obtenerse desde [http://localhost:3001/tasks](http://localhost:3001/tasks).

### Criterios de evaluación

- Las tareas se obtienen correctamente desde la API.
- Se utiliza renderizado iterativo (`map`).
- Las tareas se muestran correctamente según su estado.
- La aplicación funciona correctamente al recargar la página.

---

## Ejercicio 3 — Configuración de rutas

Agregar las rutas necesarias utilizando React Router.

Se deben implementar las siguientes rutas:

| Ruta | Descripción |
|---|---|
| `/` | Tablero principal |
| `/tasks/new` | Página para agregar una tarea |
| `/tasks/:id/edit` | Página para editar una tarea |

### Criterios de evaluación

- Las rutas funcionan correctamente.
- Se utiliza React Router.
- La navegación entre páginas es funcional.

---

## Ejercicio 4 — Formulario para agregar tareas

Implementar el formulario para crear una nueva tarea.

La tarea debe persistirse en `json-server`.

### Bonus (+5 pts)

Agregar validación para prevenir crear tareas con campos vacíos.

### Criterios de evaluación

- La tarea se crea correctamente.
- Se realiza el `POST` al backend.
- El formulario funciona correctamente.
- Bonus: validaciones implementadas.

---

## Ejercicio 5 — Formulario para editar tareas

Implementar un formulario para editar una tarea existente.

La página debe:

1. Obtener la información de la tarea utilizando el `id` recibido en la URL.
2. Mostrar la información actual en el formulario.
3. Permitir modificar los datos.
4. Guardar los cambios en el backend.

### Criterios de evaluación

- La tarea se carga correctamente.
- El formulario muestra los datos existentes.
- Los cambios se guardan correctamente.
- Se realiza el `PUT` o `PATCH` correspondiente al backend.

---

## Ejercicio 6 — Context API para tareas y métricas

Implementar un contexto utilizando React Context API para compartir las tareas globalmente.

El contexto debe ser utilizado por:

- `ProgressBar` para calcular el porcentaje de tareas completadas.
- `AssigneesChart` para representar gráficamente las tareas completadas por persona.

### Criterios de evaluación

- Se implementa correctamente Context API.
- Los componentes consumen la información desde el contexto.
- `ProgressBar` refleja correctamente el progreso del proyecto.
- `AssigneesChart` muestra correctamente las tareas completadas por persona.

---

## Notas técnicas

- **React Router**: Utilizar `BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate` y `useParams`.
- **json-server**: La API REST se encuentra en:

```txt
http://localhost:3000/tasks
```

- La API soporta:
  - `GET`
  - `POST`
  - `PUT`
  - `PATCH`
  - `DELETE`

- **CSS Modules**: Todos los estilos deben implementarse utilizando archivos `.module.css`.
- Se recomienda centralizar las llamadas HTTP dentro de:

```txt
src/services/taskService.js
```

- Mantener una estructura de componentes clara y reutilizable.