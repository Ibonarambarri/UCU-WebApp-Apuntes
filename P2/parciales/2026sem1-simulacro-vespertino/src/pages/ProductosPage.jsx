import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productosApi } from '../api/client.js'
import styles from './ProductosPage.module.css'
import { ProductoCard } from '../components/ProductoCard/ProductoCard.jsx'

export function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      setError('')

      try {
        const data = await productosApi.listar()
        setProductos(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e.message)
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [])

  if (cargando) return <p>Cargando productos...</p>

  if (error) {
    return <p className={styles.error}>{error}</p>
  }

  return (
    <main>
      <div className={styles.top}>
        <h1 className={styles.title}>Productos</h1>

        <Link className={styles.linkBtn} to="/productos/nuevo">
          Agregar comida
        </Link>
      </div>

      <ul className={styles.list}>
        {productos.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
          />
        ))}
      </ul>
    </main>
  )
}