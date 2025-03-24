import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import path from "path";
import glslify from "vite-plugin-glslify";

export default defineConfig({
  server: {
    port: 3000,
    host: true, 
  },
  plugins: [
    react(),
    glslify()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
