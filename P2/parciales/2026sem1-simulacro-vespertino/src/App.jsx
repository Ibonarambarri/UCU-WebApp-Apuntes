// ==============================================
// Archivo: src/App.jsx
// Qué hace: componente raíz. Muestra la NavBar (en todas las páginas) y
//           define las rutas de la app (PUNTO 3: se agregaron "cuentas" y
//           "cuentas/nueva").
// Conceptos: Routes / Route, Navigate (redirección), componentes de página.
// ==============================================

import { Route, Routes, Navigate } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar.jsx';
import { CuentasPage } from './pages/CuentasPage.jsx';
import { NuevaCuentaPage } from './pages/NuevaCuentaPage.jsx';
import { ProductosPage } from './pages/ProductosPage.jsx';
import { NuevoProductoPage } from './pages/NuevoProductoPage.jsx';

import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.shell}>
      {/* Fuera de <Routes>: se ve siempre */}
      <NavBar />
      <Routes>
        {/* TRAMPA: la plantilla mostraba CuentasPage en "/" pero el NavLink
            apunta a "/cuentas", así que en "/" el link "Cuentas" no quedaba
            marcado como activo. Solución: "/" REDIRIGE a "/cuentas" con
            <Navigate replace /> y la página vive en una sola ruta. */}
        <Route path="/" element={<Navigate to="/cuentas" replace />} />

        {/* PUNTO 3: listado de cuentas y formulario de cuenta nueva */}
        <Route path="/cuentas" element={<CuentasPage />} />
        <Route path="/cuentas/nueva" element={<NuevaCuentaPage />} />

        {/* Productos (venían en la plantilla) */}
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/productos/nuevo" element={<NuevoProductoPage />} />
      </Routes>
    </div>
  );
}
