import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves the site from /portfolio/. Override with BASE=/ for other hosts.
export default defineConfig({
  base: process.env.BASE ?? '/portfolio/',
  plugins: [react(), tailwindcss()],
})
