// ==============================================
// Archivo: src/components/CuentaCard/CuentaCard.jsx
// Qué hace: tarjeta de UNA cuenta (PUNTOS 1 y 2): nombre del cliente,
//           lista de productos consumidos con cantidad y subtotal, y el
//           total de la cuenta al final.
// Conceptos: props, map con key, find para buscar el precio, CSS Modules.
// ==============================================

import { formatoPrecio, totalDeCuenta } from '../../utils/cuentas.js'
import styles from './CuentaCard.module.css'

// props.cuenta: { id, cliente, productos: [{ icono, nombre, cantidad }] }
// props.productos: la lista de productos del bar (para saber los precios,
//                  porque en la cuenta NO viene el precio, solo el nombre).
export function CuentaCard(props) {
  const cuenta = props.cuenta
  const productos = props.productos

  // Total de esta cuenta: suma de cantidad * precio de cada consumo.
  const total = totalDeCuenta(cuenta, productos)

  // Devuelve el precio unitario de un consumo buscando el producto por
  // nombre. Si no existe (producto borrado) devuelve 0.
  function precioDe(consumo) {
    // find: primer producto cuyo nombre coincide, o undefined.
    const productoEncontrado = productos.find(
      (producto) => producto.nombre === consumo.nombre,
    )
    if (!productoEncontrado) {
      return 0
    }
    return Number(productoEncontrado.precio)
  }

  return (
    <li className={styles.card}>
      <h2 className={styles.client}>{cuenta.cliente}</h2>

      {/* Una línea por producto consumido. key = indice + nombre porque
          un consumo no tiene id propio. */}
      <ul className={styles.items}>
        {cuenta.productos.map((consumo, indice) => (
          <li key={indice + '-' + consumo.nombre} className={styles.item}>
            {consumo.icono} {consumo.nombre} x {consumo.cantidad}{' '}
            {formatoPrecio(precioDe(consumo) * Number(consumo.cantidad))}
          </li>
        ))}
      </ul>

      {/* PUNTO 2: total de la cuenta al final del componente */}
      <p className={styles.total}>{formatoPrecio(total)}</p>
    </li>
  )
}
