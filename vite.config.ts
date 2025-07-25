import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // ✅ 确保资源路径相对，适配 Android WebView
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: ['es2015'], // ✅ 保留
  },
})
