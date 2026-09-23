// ==============================================
// Archivo: src/pages/NuevaCuentaPage.jsx
// Qué hace: página "/cuentas/nueva" (PUNTO 4). Formulario controlado para
//           crear una cuenta con UN producto. Al guardar hace POST,
//           recalcula la recaudación del contexto (PUNTO 5) y redirige al
//           listado (PUNTO 6).
// Conceptos: formulario controlado con un solo handleChange usando [name],
//            useNavigate, useContext, async/await + try/catch, validación.
// ==============================================

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cuentasApi } from '../api/client.js';
import { RecaudacionContext } from '../context/RecaudacionContext.js';
import styles from './NuevaCuentaPage.module.css';

export function NuevaCuentaPage() {
  // Función para cambiar de ruta desde código (después de guardar).
  const navigate = useNavigate();
  // Del contexto solo necesitamos recargar(), para que la NavBar muestre
  // el total actualizado apenas se cree la cuenta.
  const contexto = useContext(RecaudacionContext);
  const recargar = contexto.recargar;

  // Estado del formulario: UN objeto con los 4 campos. Cada input tiene
  // name igual a la clave correspondiente.
  const [formulario, setFormulario] = useState({
    cliente: '',
    nombre: '',
    icono: '',
    cantidad: '1',
  });
  // Mensaje de error de validación o de la API.
  const [error, setError] = useState('');

  // Un solo handler para todos los inputs: usa el atributo name como clave
  // calculada [name] para pisar solo el campo que cambió.
  function handleChange(evento) {
    const name = evento.target.name;
    const value = evento.target.value;
    setFormulario({ ...formulario, [name]: value });
  }

  // Al enviar el formulario.
  async function handleSubmit(evento) {
    // Evitamos que el navegador recargue la página.
    evento.preventDefault();
    setError('');

    // Validación: sin cliente o sin producto no se crea nada.
    if (!formulario.cliente.trim() || !formulario.nombre.trim()) {
      setError('El cliente y el producto son obligatorios.');
      return;
    }
    if (Number(formulario.cantidad) < 1) {
      setError('La cantidad debe ser al menos 1.');
      return;
    }

    // Armamos la cuenta con la forma que espera el backend
    // (ver README: cuentas.productos[] = { icono, nombre, cantidad }).
    // Los inputs siempre dan strings, por eso Number() en cantidad.
    const cuentaNueva = {
      cliente: formulario.cliente.trim(),
      productos: [
        {
          icono: formulario.icono.trim(),
          nombre: formulario.nombre.trim(),
          cantidad: Number(formulario.cantidad),
        },
      ],
    };

    try {
      // POST /cuentas
      await cuentasApi.crear(cuentaNueva);
      // PUNTO 5: recalculamos el total global para que la NavBar cambie.
      await recargar();
      // PUNTO 6: redirigimos al listado.
      navigate('/cuentas');
    } catch (errorCapturado) {
      setError('Error al crear la cuenta: ' + errorCapturado.message);
    }
  }

  return (
    <main>
      <div className={styles.top}>
        <h1 className={styles.title}>Agregar cuenta</h1>
        <Link className={styles.back} to="/cuentas">
          Volver
        </Link>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Mensaje de error solo si hay */}
        {error ? <p className={styles.error}>{error}</p> : null}

        {/* Inputs controlados: value del estado + onChange que lo actualiza */}
        <label className={styles.field}>
          Cliente
          <input
            className={styles.input}
            name="cliente"
            placeholder="Nombre del cliente"
            value={formulario.cliente}
            onChange={handleChange}
          />
        </label>

        <label className={styles.field}>
          Producto
          <input
            className={styles.input}
            name="nombre"
            placeholder="Nombre del producto (igual que en Productos)"
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
          Cantidad
          <input
            className={styles.input}
            name="cantidad"
            type="number"
            min="1"
            value={formulario.cantidad}
            onChange={handleChange}
          />
        </label>

        <button className={styles.btn} type="submit">
          Guardar cuenta
        </button>
      </form>
    </main>
  );
}
