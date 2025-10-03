import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["cursos.krear3d.com"],
    hmr: {
      host: "cursos.krear3d.com",
      protocol: "ws",
      port: 5173,
    },
  },
  build: {
    target: "es2017",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@node_modules": "/node_modules",
      "@src": "/src",
      "@assets": "/src/assets",
      "@contexts": "/src/contexts",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@api": "/src/api",
      "@i18n": "/src/i18n",
      "@utils": "/src/utils",
      "@store": "/src/store",
    },
  },
});
