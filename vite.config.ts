import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import commonjs from '@rollup/plugin-commonjs';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), commonjs()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['xlsx'],
  },
  build: {
    commonjsOptions: {
      include: [/xlsx/],
      exclude: [/node_modules\/react/, /node_modules\/@radix-ui/],
    },
  },
}));
