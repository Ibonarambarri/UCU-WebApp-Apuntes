import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mockApi from './data/mock-api';
import routes from './data/mock-routes';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    mockApi({ routes }),
  ],
  publicDir: 'data/static',
  server: {
    watch: {
      ignored: [
        'data/**',
      ],
    },
  },
});
