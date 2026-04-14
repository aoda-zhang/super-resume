import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Deploy config: change base for GitHub Pages, keep '/' for Vercel/netlify
const base = process.env.VITE_BASE_URL || '/';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base,
  build: {
    assetsDir: 'assets',
  },
})
