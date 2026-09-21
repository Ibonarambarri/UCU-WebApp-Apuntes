// ==============================================
// Archivo: vite.config.js
// Qué hace: configuración mínima de Vite para que entienda JSX/React.
// Las dependencias (react, vite, etc.) las toma del node_modules de la
// carpeta padre (UT5/), por eso este ejercicio no tiene node_modules propio.
// ==============================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
