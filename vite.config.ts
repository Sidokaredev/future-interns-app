import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/future-interns-app/',
  plugins: [react()],
  server: {
    headers: {
      // 'Cross-Origin-Embedder-Policy': 'require-corp',
      // 'Cross-Origin-Opener-Policy': 'same-origin',
      // "Cross-Origin-Embedder-Policy": "unsafe-none",
      // 'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    // proxy: {
    //   '/noc-service': {
    //     target: 'http://192.168.144.152:8004',
    //     changeOrigin: true, // aman dari CORS
    //     secure: false,
    //   },
    //   '/api/v1/write-through': {
    //     target: 'http://192.168.144.152:8002/api/v1/write-through',
    //     changeOrigin: true,
    //     secure: false,
    //   }
    // }
  }
})
