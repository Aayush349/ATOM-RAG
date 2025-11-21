import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({

  server: {
    host:  '0.0.0.0',
    port: 5173,
    allowedHosts:['2e84b47a4c77.ngrok-free.app', 'localhost'], 
  },


  plugins: [react()],
})
