import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: "APP",
  build: {
    chunkSizeWarningLimit: 1600, // Adjust the limit as needed
  },
  server: {
    // host: ["10.0.0.151"],
  },
});
process.on("warning", (e) => console.warn(e));
