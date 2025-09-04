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
  server: {
    host: '0.0.0.0',   // 局域网可访问
    port: 5173,         // Vite 默认端口，可修改
    proxy: {
      // 将前端相对路径 /api 转发到后端，避免 Mixed Content
      '/api': {
        target: 'http://172.20.10.5:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
