import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base absolut mengikuti folder deploy di htdocs XAMPP (prjocetdevops-app),
  // agar URL routing (react-router) konsisten di dev maupun produksi.
  base: '/prjocetdevops-app/',
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3001',
    },
  },
})
