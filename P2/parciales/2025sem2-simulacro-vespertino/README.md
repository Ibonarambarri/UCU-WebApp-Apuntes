# Simulacro parcial 2 2025sem2

Simulacro del segundo parcial del curso de Desarrollo Web y Mobile.

## Inicialización

Crear un _fork_ privado de este repositorio. Clonar el _fork_ y ejecutar `npm i` en la carpeta `/web`. La versión de desarrollo de la app se levanta haciendo `npm start` en la carpeta `/web`. La plantilla del ejercicio provee un ruteador básico y una página de inicio mínima. La carpeta `/web/data` tiene el _mock_ del _backend_ de la app, y **no** es de interés para realizar el ejercicio.

## Trivia de países

El ejercicio se trata de implementar una aplicación _web_ para una trivia de países. Un croquis de la interfaz de usuario pueden verse en la carpeta `/web/specs/design.svg`.

![Croquis](./web/specs/design.svg)

### Ruta 1: Inicio (o _home_)

La página de inicio debe mostrar tres botones para elegir la dificultad con la que se quiere jugar:

- **Fácil** permite hasta 8 errores antes de perder.
- **Medio** permite hasta 5 errores antes de perder.
- **Difícil** permite hasta 3 errores antes de perder.

Al presionar cualquiera de esos botones, se asigna un contador con la cantidad de errores permitidos correspondiente, y se redirige al usuario a la página de un país aleatorio. La lista de todos los códigos de país disponibles se puede acceder haciendo:

```
GET /api/countries
200 ["ABW", "AFG", ...]
```

### Ruta 2: Página de país

En la ruta `/:cca3` se debe mostrar un título con el nombre del país y su bandera. La información de un país se puede acceder con el siguiente _endpoint_:

```
GET /api/countries/URY
200 {
  "borders": ["ARG", "BRA"],
  "id": "URY",
  ...
  "flag": {
    "alt": "The flag of Uruguay is ...",
    "svg": "/flags/URY.svg"
  }
}
```

Las imágenes de las banderas se pueden obtener bajo el camino `/flags`, por ejemplo `/flags/URY.svg`.

Debajo de la bandera del país se deben mostrar 9 botones con banderas de otros países. Algunos de éstos serán países fronterizos con el país actual. Otros son países elegidos al azar. El usuario debe presionar el botón de un **país fronterizo que no se haya visitado ya**. Sino lo consigue se cuenta como un error. Los países que fronterizos se encuentran en la propiedad `borders` del registro de cada país.

Debajo de los botones de las banderas, se debe agregar un botón que diga `Ninguno`. Este debe ser presionado por el usuario cuando no se pueda elegir ninguno de los países propuestos.

Debajo del botón `Ninguno` se le debe indicar al usuario la cantidad de países visitados, y la cantidad de errores que todavía puede cometer.

Al presionar uno de los botones con las banderas de los países, además de contabilizar un posible error, se debe redirigir al usuario a la ruta del país elegido. Esto independientemente de que sea una opción correcta o no. Si se presionó el botón de ninguno, se debe redirigir a un país no visitado al azar.

Si al presionar un botón el usuario comete su último error permitido, se debe redirigir a la ruta `/end`.

### Ruta 3: Final

En la ruta `/end` se le muestra al usuario que terminó su viaje. Se indican los países visitados, y se provee de un botón para volver al inicio.

## Herramienta Postman

Para facilitar el testing de la API durante el desarrollo, se incluye una colección de Postman con todos los endpoints disponibles.

### Importar la colección

1. Abrir **Postman** (si no lo tienes instalado, descárgalo desde [postman.com](https://www.postman.com/downloads/))
2. Hacer click en el botón **"Import"** en la esquina superior izquierda
3. Seleccionar el archivo `/web/specs/Flag-Trivia-API.postman_collection.json`
4. La colección "**Flag Trivia API**" aparecerá en tu workspace

### Endpoints disponibles

- `GET /api/countries` - Lista todos los códigos de países
- `GET /api/countries/:cca3` - Información detallada de un país
- `GET /flags/:cca3.svg` - Imagen SVG de la bandera del país

_Fin_