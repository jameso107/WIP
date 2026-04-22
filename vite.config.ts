import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { openaiChatPlugin } from './vite-plugin-chat'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const openaiKey = env.OPENAI_API_KEY || env.VITE_OPENAI_API_KEY

  return {
    plugins: [react(), tailwindcss(), openaiChatPlugin(openaiKey || undefined)],
  }
})
