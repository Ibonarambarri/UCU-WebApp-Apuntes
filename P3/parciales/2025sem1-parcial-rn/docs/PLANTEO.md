# Task List app

Este ejercicio consta de implementar una aplicación móvil para llevar una lista de tareas. Se utilizará para esto Javascript, React Native y Expo. Se pretende solamente el _frontend_ de la aplicación. A los efectos de este ejercicio el _backend_ se implementará con [`json-server`](https://github.com/typicode/json-server#readme).

La aplicación deberá mantener una lista de tareas. Cada tarea se define con un _icon_ (emoji), un texto breve a modo de _name_, un texto más largo a modo de _description_. Cada tarea además podrá estar en uno de tres estados: _pending_, _blocked_ o _completed_.

## Vistas

### `Home`: vista de tareas

La vista de inicio de la aplicación deberá mostrar:

- un encabezado con el título _Tasks List_ y un botón con el signo de suma para agregar tareas.

- un cuerpo con una lista de tareas, cada una mostrando su ícono y nombre.

  - El color de fondo reflejará el estado de cada tarea: celeste para _pending_, amarillo para _blocked_ o verde para _completed_.

  - Cada ítem de esta lista permite ir a la vista del detalle de la tarea cuando se presiona sobre éste.

- un pie mostrando tres botones para filtrar las tareas que se muestran por estado.

  - Cada botón muestra un emoji: ⏳ para _pending_, ⚠️ para _blocked_ y ✅ para \_completada.

  - Al presionar estos botones se pasa a mostrar solo las tareas en ese estado. Si ese ya era el modo de la vista, se quita el filtro y se pasa a mostrar todas las tareas.

### `TaskDetail`: vista de detalle de tarea

La vista de detalle de tarea deberá mostrar:

- un encabezado con el título _Task Details_ y un botón con una cruz para cerrar la vista y volver al inicio.

- un cuerpo con un formulario para los campos de la tarea: nombre, ícono y descripción (en ese orden).

  - El ícono se debe seleccionar de una lista de posible emojis, que se obtiene del _backend_.

- un pie mostrando dos botones para modificar el estado de la tarea (no se muestra el botón correspondiente al estado actual).

### `NewTask`: vista para creación de tarea

La vista de creación de tarea deberá mostrar:

- un encabezado con el título _Task Details_.

- un cuerpo con un formulario para los campos de la tarea: nombre, ícono y descripción (en ese orden).

  - Este es idéntico al formulario mostrado para la vista `TaskDetail`.

- un pie mostrando dos botones: uno para crear la nueva tarea, y otro para cancelar la creación y volver al inicio.

Toda tarea nueva comienza en estado _pending_. Antes de crearla se debe validar que el nombre no está vacío. Se puede asumir el primer ícono de la lista de emojis disponibles como el ícono por defecto. La descripción puede estar vacía.

## Modelo de Datos

Se proveen datos de prueba en la carpeta `/api/data.json`. Usando el `json-server` se pueden usar las siguientes operaciones:

- `GET /tasks`: obtiene la lista de tareas.

  - Esquema de la respuesta:

```js
{ "id": number,
  "icon": string,
  "name": string,
  "description": string,
  "state": "pending" | "blocked" | "completed",
}[]
```

- `GET /tasks/:task_id`: obtiene una tarea por _id_.

  - Esquema de la respuesta:

```js
{ "id": number,
  "icon": string,
  "name": string,
  "description": string,
  "state": "pending" | "blocked" | "completed",
}
```

- `GET /icons`: obtiene la lista de emojis que se pueden usar como íconos de tareas.

  - Esquema de la respuesta:

```js
{ "id": number,
  "icon": string,
  "name": string,
}[]
```

- `PUT /tasks/:task_id`: crea una nueva tarea.

  - Esquema de la petición:

```js
{ "icon": string,
  "name": string,
  "description": string,
  "state": "pending",
}
```

- `PATCH /tasks/:task_id`: modificar el estado de una tarea.

  - Esquema de la petición:

```js
{ "state": "pending" | "blocked" | "completed",
}
```

## Recomendaciones o Guía para la UX/UI

A modo de guia dentro de la carpeta _/docs_ se encuentran dos archivos _UI-example.excalidraw_ y _UI-example.png_. los mismos muestran una idea de como poder implementar una UI con estas funcionalidades, los estilos no son extrictamente necesarios. Pero recuerda que el flujo debe ser tal cual esta especificado en la consigna.

---

_Desarrollo Web y Mobile, FIT, UCU 2025_
