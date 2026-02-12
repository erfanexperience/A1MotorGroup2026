import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    // For full-stack local dev (API + frontend), use: npm run dev:vercel (vercel dev)
    // This config runs frontend only; /api is served by Vercel serverless when using vercel dev
  },
})
