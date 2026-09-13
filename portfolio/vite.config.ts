import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 部署到个人主站的 /ui/ 子路径
export default defineConfig({
  base: '/ui/',
  plugins: [react()],
});
