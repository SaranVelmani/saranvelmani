import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from the domain root (Vercel). Set BASE to build for a sub-path.
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react(), tailwindcss()],
})
