# Simulacro parcial 2 2025sem2

Simulacro del segundo parcial del curso de Desarrollo Web y Mobile.

## Inicialización

Crear un _fork_ privado de este repositorio. Clonar el _fork_ y ejecutar `npm i` en la carpeta `/web`. La versión de desarrollo de la app se levanta haciendo `npm start` en la carpeta `/web`. La plantilla del ejercicio provee un ruteador básico y una página de inicio mínima. La carpeta `/web/data` tiene el _mock_ del _backend_ de la app, y **no** es de interés para realizar el ejercicio.

## Trivia de países

El ejercicio se trata de implementar una aplicación _web_ para una trivia de países. Croquis de interfaz de usuario pueden verse en la carpeta `/web/specs/design.svg`.

![Croquis](./web/specs/design.svg)

Se deben tener dos rutas:

### Ruta 1: Inicio (o _home_)

En la ruta `/` se debe mostrar la página de inicio. En ésta se debe elegir una país al azar y mostrar su mapa. Debajo de dicho mapa, se deben mostrar cuatro botones, cada uno con una bandera. 

Una de esas banderas debe ser la del país elegido. Las otras 3 deben ser banderas de otros 3 países elegidos al azar. En cuál posición está la bandera correcta también debe ser aleatorio. 

Debajo de las banderas se debe mostrar el puntaje del usuario, dado por la resta de respuestas correctas menos las respuestas equivocadas. Al presionar uno de los botones con las banderas:

- Se le debe indicar al usuario si contestó bien o mal.

- Se ajusta el puntaje.

- Se activa en el mapa un enlace a la página del país. La cual correspondería a la ***Ruta 2***

- Se muestra un botón debajo de las banderas para refrescar la página con otro desafío.

La lista de todos los códigos de país disponibles se puede acceder haciendo:

```
GET /api/countries
200 ["ABW", "AFG", ...]
```

Una vez elegido el código (de 3 letras) del país se puede acceder a su información del país con el siguiente _endpoint_:

```
GET /api/countries/URY
200 {
  "id": "URY",
  ...
  "flag": {
    "alt": "The flag of Uruguay is ...",
    "svg": "/flags/URY.svg"
  },
  "map": {
    "svg": "/maps/URY.svg"
  }
}
```

Las imágenes se acceden en el mismo servicio que la API, e.g. `/flags/URY.svg`.

### Ruta 2: página de un país

En la ruta `/country/:cca3` se debe mostrar la página del país, con `cca3` refiriendo al identificador de 3 letras del país. La página debe mostrar el nombre común del país como título. Debajo la bandera y el mapa en una misma línea. Más abajo se deben mostrar los siguientes datos del país:

- Nombres oficiales en inglés y en los idiomas oficiales.
- Capital.
- Monedas.
- Zonas horarias.

Al pie de la página debe haber un enlace para volver a la página de inicio.

_Fin_