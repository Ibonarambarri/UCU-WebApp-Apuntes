// ==============================================
// Archivo: src/pages/NuevoProductoPage.jsx
// Qué hace: página "/productos/nuevo". Formulario controlado para crear un
//           producto (POST) y redirigir a /productos (PUNTO 6). Venía hecha
//           en la plantilla: se agregaron comentarios y la llamada a
//           recargar() del contexto (si cambia un precio, cambia el total).
// Conceptos: formulario controlado con [name], useNavigate, useContext.
// ==============================================

import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productosApi } from '../api/client.js'
import { RecaudacionContext } from '../context/RecaudacionContext.jsx'
import styles from './NuevoProductoPage.module.css'

export function NuevoProductoPage() {
  const navigate = useNavigate()
  // recargar() recalcula el total global (un producto nuevo puede darle
  // precio a consumos que ya existían en alguna cuenta).
  const contexto = useContext(RecaudacionContext)
  const recargar = contexto.recargar

  // Estado del formulario: un objeto con los 3 campos.
  const [formulario, setFormulario] = useState({
    nombre: '',
    icono: '',
    precio: '',
  })

  // Un solo handler: [name] es la clave calculada con el name del input.
  // (Plantilla: usa destructuring y arrow en setFormulario(prev => ...).)
  function handleChange(e) {
    const { name, value } = e.target

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    // Evita la recarga de página del submit nativo.
    e.preventDefault()

    try {
      // POST /productos. precio se convierte a número (los inputs dan string).
      await productosApi.crear({
        nombre: formulario.nombre,
        icono: formulario.icono,
        precio: Number(formulario.precio),
      })

      // PUNTO 5: actualizar el total de la NavBar.
      await recargar()
      // PUNTO 6: redirigir al listado.
      navigate('/productos')
    } catch (error) {
      console.error(error)
      alert('Error al crear producto')
    }
  }

  return (
    <main>
      <div className={styles.top}>
        <h1 className={styles.title}>Agregar comida</h1>

        <Link className={styles.back} to="/productos">
          Volver
        </Link>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Inputs controlados: value del estado + onChange */}
        <label className={styles.field}>
          Nombre

          <input
            className={styles.input}
            name="nombre"
            placeholder="Ej: Hamburguesa"
            value={formulario.nombre}
            onChange={handleChange}
          />
        </label>

        <label className={styles.field}>
          Icono

          <input
            className={styles.input}
            name="icono"
            placeholder="🍔"
            value={formulario.icono}
            onChange={handleChange}
          />
        </label>

        <label className={styles.field}>
          Precio

          <input
            className={styles.input}
            name="precio"
            type="number"
            min="0"
            value={formulario.precio}
            onChange={handleChange}
          />
        </label>

        <button className={styles.btn} type="submit">
          Guardar producto
        </button>
      </form>
    </main>
  )
}
