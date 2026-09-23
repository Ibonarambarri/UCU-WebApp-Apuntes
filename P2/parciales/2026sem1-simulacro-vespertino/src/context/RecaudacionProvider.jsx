// ==============================================
// Archivo: src/context/RecaudacionProvider.jsx
// Qué hace: Provider del contexto global con el TOTAL RECAUDADO (PUNTO 5).
//           El contexto en sí se crea en RecaudacionContext.js.
//           El Provider carga cuentas y productos de la API, calcula el
//           total con totalRecaudado() y lo expone junto con una función
//           recargar() para volver a calcularlo (por ejemplo después de
//           crear una cuenta nueva). La NavBar lo muestra arriba a la derecha.
// Conceptos: createContext, Provider, useState, useEffect, useContext,
//            props.children.
// ==============================================

import { useState, useEffect } from 'react';
import { cuentasApi, productosApi } from '../api/client.js';
import { totalRecaudado } from '../utils/cuentas.js';
import { RecaudacionContext } from './RecaudacionContext.js';

// El Provider: envuelve la app (ver main.jsx) y comparte { total, recargar }
//    con todos los componentes que hagan useContext(RecaudacionContext).
//
// Decisión de diseño: el Provider carga cuentas y productos POR SU CUENTA
// (en vez de recibirlos de CuentasPage) porque la NavBar se muestra en
// TODAS las rutas: si el usuario entra directo a /productos, la
// recaudación también tiene que verse. Es la solución más simple y
// autocontenida: dos fetch + una cuenta.
export function RecaudacionProvider(props) {
  // Estado global: el total recaudado en pesos.
  const [total, setTotal] = useState(0);

  // Pide cuentas y productos a la API y recalcula el total.
  // Es async y va en try/catch: si la API está caída dejamos el total en 0.
  async function recargar() {
    try {
      const cuentas = await cuentasApi.listar();
      const productos = await productosApi.listar();
      // totalRecaudado suma, para cada cuenta, cantidad * precio de cada
      // producto (busca el precio por nombre en la lista de productos).
      const totalCalculado = totalRecaudado(cuentas, productos);
      setTotal(totalCalculado);
    } catch (errorCapturado) {
      console.error('No se pudo calcular la recaudación:', errorCapturado);
      setTotal(0);
    }
  }

  // Dependencias []: se ejecuta UNA sola vez al montar el Provider
  // (o sea, al cargar la app). Después, quien cree una cuenta o un producto
  // llama recargar() a mano.
  useEffect(() => {
    recargar();
  }, []);

  // Objeto que reciben los consumidores.
  const valorDelContexto = {
    total: total,
    recargar: recargar,
  };

  return (
    <RecaudacionContext.Provider value={valorDelContexto}>
      {/* props.children = todo lo que esté entre <RecaudacionProvider> y </RecaudacionProvider> */}
      {props.children}
    </RecaudacionContext.Provider>
  );
}
