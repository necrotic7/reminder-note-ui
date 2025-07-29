import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  // 讀取 .env 檔
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [react(), tailwindcss()],
    server: {
      allowedHosts: env.VITE_ALLOW_HOSTS.split(',')
    },
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
    },
  }
})