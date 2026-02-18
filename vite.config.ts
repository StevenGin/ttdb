import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isStatic = env.VITE_STATIC_MODE === 'true'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    base: isStatic ? '/ttdb/' : '/',
    define: {
      __STATIC_MODE__: JSON.stringify(isStatic),
    },
    build: {
      outDir: isStatic ? 'dist-static' : 'dist',
    },
  }
})
