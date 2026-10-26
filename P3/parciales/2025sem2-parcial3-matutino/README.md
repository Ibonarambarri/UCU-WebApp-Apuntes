# Parcial 3 2025sem2

Tercer parcial del curso de Desarrollo Web y Mobile.

## Inicialización

Crear un _fork_ privado de este repositorio. Clonar el _fork_ y ejecutar `npm i` en la raíz. La versión de desarrollo de la app se levanta haciendo `npm start` en la raíz. La plantilla del ejercicio provee un ruteador básico y dos vistas de ejemplo. Las carpetas `/app/api` y `/app/static` tienen datos y archivos para el _mock_ del _backend_ de la app, y **no** son de interés para realizar el ejercicio.

## Trivia de países

El ejercicio se trata de implementar una aplicación _mobile_ con React Native y Expo, para una trivia de países. Un croquis de interfaz de usuario pueden verse en la carpeta `/specs/design.svg`.

## Navegación

En proyecto contiene una navegación con Expo Router. Aunque la primera ruta sea index, no queremos que en el header de navegación diga header, si no que queremos que diga "Bienvenido".
Se debe agregar otra pantalla al stack. La pantalla de la trivia.
Esta pantalla debe tener como titulo en el header de navegación "Trivia de Países" con la posibilidad de ir a la pantalla anterior en la esquina izquierda. (Back Button)

![Croquis](./specs/design.svg)

Se deben tener tres vistas:

### Vista 1: Bienvenida

En la ruta `/` se debe mostrar una bienvenida al usuario. Aquí se pide el nombre del usuario jugador, que debe mostrarse en la otra vista.

Debajo del nombre del jugador se muestran tres botones para iniciar el juego, correspondiendo a los tres niveles de dificultad: _Fácil_, _Medio_ y _Difícil_. Todos estos botones deben ir a la siguiente pantalla de Juego, pero le dan al jugador diferentes cantidades de vidas. _Fácil_ tiene 9 vidas, _Medio_ tiene 6 y _Difícil_ tiene 3.

### Vista 2: Juego

En la ruta `/game` se debe mostrar un mapa de un país aleatorio y una bandera de ese mismo país o de otro aleatorio. La probabilidad de que las banderas coincidan debe ser del 50%.

Se le pregunta al usuario si el mapa y la bandera son del mismo país. Se muestran dos botones para responder _Sí_ o _No_. Debajo se muestra un tercer botón de _Salir_ para volver a la vista de bienvenida.

En la parte superior de la pantalla se muestra el nombre el usuario y la cantidad de vidas que le quedan. Se usan emojis de ❤️ para las vidas que quedan, y emojis de 💀 para las vidas perdidas.

Al presionar uno de los botones:

- Se le debe indicar al usuario si contestó bien o mal.

- Se ajusta el puntaje.

- Se cambia el botón de _Salir_ por un botón de _Continuar_ que pasa a la siguiente pregunta (si quedan vidas) o a la vista de Fin (si no quedan vidas).

### Vista 3: Fin

Al terminarse las vidas, la vista de Juego muestra la pantalla de Fin. Ésta felicita al usuario, indicando la cantidad de vidas con las que jugó y la cantidad de preguntas que contestó (ya sea bien o mal).

El botón de _Salir_ se cambia por _Volver a jugar_, pero sigue llevando a la pantalla de bienvenida.

## API e imágenes

La lista de todos los códigos de país disponibles se puede acceder haciendo:

```
GET /api/countries
200 ["ABW", "AFG", ...]
```

Se pueden obtener países aleatorios de la siguiente forma:

```
GET /api/countries/random?n=2
200 ["URY", "ARG"]
```

dónde `n` es la cantidad de países deseada.

Las imágenes de las banderas y mapas de los países de pueden acceder en `/static/flags/cca3.svg` y `/static/maps/cca3.svg` respectivamente, dónde `cca3` es el código de 3 letras del país (e.g. `URY`). Están disponibles en formatos SVG y PNG.

_Fin_
