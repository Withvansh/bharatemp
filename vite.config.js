import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    // Force PostCSS pipeline (no lightningcss .node binary issues)
    transformer: 'postcss',
  },
  server: {
    port: 5174, 
},
});