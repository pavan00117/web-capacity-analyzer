import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      // Azure App Service hostname
      allowedHosts: [
        'rg-capacity-hackathon-d6fbdbeqg4dncmam.centralindia-01.azurewebsites.net',
      ],

      // AI Studio / local development settings
      hmr: process.env.DISABLE_HMR !== 'true',

      watch: process.env.DISABLE_HMR === 'true'
        ? null
        : {},
    },
  };
});