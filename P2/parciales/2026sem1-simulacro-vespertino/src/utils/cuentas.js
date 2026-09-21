// ==============================================
// Archivo: src/utils/cuentas.js
// Qué hace: funciones puras de cálculo (sin React): total de una cuenta,
//           total recaudado de todas las cuentas y formato de precio.
//           Venían hechas en la plantilla (usan reduce y ?.); se dejaron
//           igual y se agregó al lado la versión equivalente con for.
// ==============================================

// Total de UNA cuenta = suma de (cantidad * precio) de cada consumo.
// El precio NO viene en la cuenta: se busca en `productos` por nombre.
export function totalDeCuenta(cuenta, productos) {
  // Si la cuenta no tiene productos (o no existe), el total es 0.
  // `cuenta?.productos?.length` = "si cuenta existe y tiene productos, su largo".
  if (!cuenta?.productos?.length) return 0
  // reduce: recorre los consumos acumulando en `suma` (empieza en 0).
  return cuenta.productos.reduce((suma, consumo) => {
    const cantidad = Number(consumo?.cantidad) || 0
    // find: producto con el mismo nombre que el consumo (o undefined).
    const producto = (productos || []).find(
      (item) => item.nombre === consumo.nombre,
    )
    const precio = Number(producto?.precio) || 0
    return suma + cantidad * precio
  }, 0)
  // Versión equivalente con for (misma lógica, sin reduce):
  // let suma = 0
  // for (const consumo of cuenta.productos) {
  //   const cantidad = Number(consumo.cantidad) || 0
  //   const producto = productos.find((item) => item.nombre === consumo.nombre)
  //   const precio = producto ? Number(producto.precio) : 0
  //   suma = suma + cantidad * precio
  // }
  // return suma
}

// Total recaudado del bar = suma de los totales de TODAS las cuentas.
// Es lo que muestra la NavBar (PUNTO 5) a través del contexto.
export function totalRecaudado(cuentas, productos) {
  if (!Array.isArray(cuentas)) return 0
  return cuentas.reduce((suma, cuenta) => suma + totalDeCuenta(cuenta, productos), 0)
  // Versión con for:
  // let suma = 0
  // for (const cuenta of cuentas) {
  //   suma = suma + totalDeCuenta(cuenta, productos)
  // }
  // return suma
}

// 4200 -> "$ 4.200" (separador de miles según locale es-AR).
export function formatoPrecio(valor) {
  return `$ ${Number(valor).toLocaleString('es-AR')}`
}
