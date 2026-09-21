// ==============================================
// Archivo: src/components/NavBar/NavBar.jsx
// Qué hace: barra superior con los links "Cuentas" y "Productos" y, a la
//           derecha, el total recaudado (PUNTO 5) leído del contexto.
// Conceptos: NavLink (marca el link activo), useContext, CSS Modules.
// ==============================================

import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { RecaudacionContext } from '../../context/RecaudacionContext.jsx'
import { formatoPrecio } from '../../utils/cuentas.js'
// TRAMPA: la plantilla importaba './Navbar.module.css' (b minúscula) pero el
// archivo se llama 'NavBar.module.css'. En macOS/Windows funciona igual
// porque el sistema de archivos ignora mayúsculas, pero en Linux (y en el
// build de un servidor) falla con "Cannot find module". El import tiene
// que coincidir EXACTAMENTE con el nombre del archivo.
import styles from './NavBar.module.css'

export function NavBar() {
  // PUNTO 5: el total viene del contexto global, no se calcula acá.
  const contexto = useContext(RecaudacionContext)
  const total = contexto.total

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* NavLink recibe isActive y devuelve la clase "active" si la ruta
            actual coincide con "to" (arrow inline, venía en la plantilla) */}
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.active : ''
          }
          to="/cuentas"
        >
          Cuentas
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive ? styles.active : ''
          }
          to="/productos"
        >
          Productos
        </NavLink>
      </nav>

      {/* formatoPrecio(650) -> "$ 650" */}
      <p className={styles.total}>
        Recaudacion: {formatoPrecio(total)}
      </p>
    </header>
  )
}
