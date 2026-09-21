import { formatoPrecio } from '../../utils/cuentas.js'
import styles from './ProductoCard.module.css'

export function ProductoCard({ producto }) {
  return (
    <li className={styles.card}>
      <span className={styles.name}>
        {producto.icono} {producto.nombre}
      </span>

      <span className={styles.price}>
        {formatoPrecio(producto.precio)}
      </span>
    </li>
  )
}