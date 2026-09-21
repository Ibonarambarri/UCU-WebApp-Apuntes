// ==============================================
// Archivo: vite.config.js
// Qué hace: configuración mínima de Vite para que entienda JSX y React.
// ==============================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ plugins: [react()] });
