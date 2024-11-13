import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: "APP",
  build: {
    cssMinify: true,
    minify: "esbuild",
    chunkSizeWarningLimit: 4000,
    commonjsOptions: {
      transformMixedEsModules: true,
      strictRequires: true,
    },
    
  },
});
