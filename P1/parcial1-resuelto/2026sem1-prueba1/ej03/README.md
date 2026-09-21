# Ejercicio 03

Este ejercicio involucra:

+ modificaciones del DOM usando Javascript,

+ peticiones a una API para obtener y modificar datos.

Las modificaciones se deben hacer a los archivos en `public/`. Los demás
archivos deben dejarse como están.

Para comenzar, ejecutar `npm install` en la carpeta raíz del ejercicio. Esto
instalará el `json-server` que se utilizará para montar un servidor local.

Ejecutando `npm start` en la raíz del ejercicio, se estará ejecutando el
servidor en la dirección [`http://localhost:3000/`](http://localhost:3000/). El
mismo sirve la página web existente en la carpeta `public/` y la API usando el
archivo `api/db.json`.

Dicho archivo tiene el siguiente contenido:

```json
{
  "combos": []
}
```

La API tiene una única entidad `combos`. Los objetos a guardar dentro de la
misma deben tener la forma:

```javascript
{ id: "some-id", textColor: "#a3c4f5", backgroundColor: "#2d6a4f", approved: true }
```

Los _endpoints_ a utilizar en el ejercicio son:

+ `GET /combos` para obtener el historial de combinaciones guardadas.

+ `POST /combos` para guardar una nueva combinación con su resultado.

Accediendo a la dirección [`http://localhost:3000/`](http://localhost:3000/) en
el navegador se verá la página en su estado inicial. Allí se explica cómo
proseguir con el ejercicio.
