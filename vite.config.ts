import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Definir variables de entorno explícitamente
    define: {
      'import.meta.env.VITE_POCKETBASE_URL': JSON.stringify(
        env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'
      ),
      'import.meta.env.VITE_POCKETBASE_EMAIL': JSON.stringify(
        env.VITE_POCKETBASE_EMAIL || ''
      ),
      'import.meta.env.VITE_POCKETBASE_PASSWORD': JSON.stringify(
        env.VITE_POCKETBASE_PASSWORD || ''
      ),
    },
  }
})
