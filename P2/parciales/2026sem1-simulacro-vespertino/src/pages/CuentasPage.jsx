// ==============================================
// Archivo: src/pages/CuentasPage.jsx
// Qué hace: página "/cuentas" (PUNTOS 1 y 2). Al montarse pide a la API
//           las cuentas Y los productos (para saber los precios), y dibuja
//           una CuentaCard por cuenta.
// Conceptos: useEffect con [], async/await + try/catch, loading / error,
//            map con key, Link.
// ==============================================

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cuentasApi, productosApi } from '../api/client.js'
import { CuentaCard } from '../components/CuentaCard/CuentaCard.jsx'
import styles from './CuentasPage.module.css'

export function CuentasPage() {
  // Lista de cuentas que devuelve la API.
  const [cuentas, setCuentas] = useState([])
  // Lista de productos: hace falta porque cada consumo de una cuenta solo
  // tiene el NOMBRE del producto, el precio hay que buscarlo acá.
  const [productos, setProductos] = useState([])
  // true mientras esperamos las dos respuestas.
  const [cargando, setCargando] = useState(true)
  // Mensaje de error de la API ('' = sin error).
  const [error, setError] = useState('')

  // Dependencias []: se ejecuta una sola vez, al montar la página.
  useEffect(() => {
    async function cargar() {
      setCargando(true)
      setError('')
      try {
        const cuentasDeLaApi = await cuentasApi.listar()
        const productosDeLaApi = await productosApi.listar()
        setCuentas(cuentasDeLaApi)
        setProductos(productosDeLaApi)
      } catch (errorCapturado) {
        setError(errorCapturado.message)
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [])

  // Returns tempranos para los estados de carga y error.
  if (cargando) {
    return <p>Cargando cuentas...</p>
  }

  if (error) {
    return <p className={styles.error}>{error}</p>
  }

  return (
    <main>
      <div className={styles.top}>
        <h1 className={styles.title}>Cuentas</h1>
        {/* Link a la ruta del formulario (PUNTO 3) */}
        <Link className={styles.linkBtn} to="/cuentas/nueva">
          Agregar cuenta
        </Link>
      </div>

      {/* Si no hay cuentas mostramos un aviso; si hay, una tarjeta por cuenta */}
      {cuentas.length === 0 ? (
        <p>No hay cuentas todavía.</p>
      ) : (
        <ul className={styles.list}>
          {cuentas.map((cuenta) => (
            <CuentaCard
              key={cuenta.id}
              cuenta={cuenta}
              productos={productos}
            />
          ))}
        </ul>
      )}
    </main>
  )
}
