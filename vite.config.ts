import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/runner_game/',
  server: {
    open: true,
    port: 3016
  }
});
