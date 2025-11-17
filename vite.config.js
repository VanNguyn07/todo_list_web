// // file: vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // 1. TARGET: Trỏ vào tên miền ảo của Laragon tương ứng với tên thư mục
        target: 'http://todo_list_web.test', 
        
        changeOrigin: true,
        secure: false,
        
        // 2. REWRITE: Đường dẫn file tính từ gốc dự án
        // Request từ React: /api/get_tasks 
        // -> Sẽ thành: http://todo_list_web.test/server/routers/api.php
        rewrite: (path) => path.replace(/^\/api/, '/server/services')
      }
    }
  }
});