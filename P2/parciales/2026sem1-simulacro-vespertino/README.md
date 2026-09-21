# Simulacro Parcial 2 - BarApp

## Ejecucion

Ejecutar en una terminal

```bash
npm install
npm run dev
```

Luego ejecutar en una segunda terminal

```bash
cd BE
npm install
npm run dev
```

## Datos JSON Server

- Recurso `productos`: `id`, `icono`, `nombre`, `precio`
- Recurso `cuentas`: `id`, `cliente`, `productos[]`
- Cada item de `cuentas.productos[]`: `icono`, `nombre`, `cantidad`
- En `cuentas` no se usa referencia por id al array `productos`

## Puntos a resolver (6)

1. Implementar los componentes restantes para respresentar los clientes con sus cuentas siguiendo el bosquejo adjunto.
2. Mostrar listado de cuentas con nombre del cliente, productos y cantidades, y calcular el total mostrandolo al final del componente.
3. Completar el router con las rutas que faltan "cuentas", "cuentas/nueva" donde se debera mostrar la pagina sus correspondientes paginas.
4. Implementar formulario para agregar una cuenta nueva.
5. Implementar en Context el total de recaudacion y mostrarlo en la barra superior derecha.
6. Luego de agregar una comida o una cuenta nueva, redirigir automaticamente al listado correspondiente.

Nota: resolviendo 5/6 puntos de forma correcta y sin errores se obtiene una calificacion de 100, siendo 100 la calificacion maxima.

⚠️ Las pantallas se encuentran en los archivos Screens.png o Screens.excalidraw.
