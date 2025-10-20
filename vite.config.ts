import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/FormularioServWebII/',  // Nombre de tu repositorio para GitHub Pages
  plugins: [react()],
  server: {
    port: 5174
  }
})
