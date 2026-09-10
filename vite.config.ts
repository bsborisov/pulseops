import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {
  fileURLToPath,
  URL,
} from "node:url";
import {
  defineConfig,
} from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(
        new URL("./src", import.meta.url),
      ),

      "@shared": fileURLToPath(
        new URL("./shared", import.meta.url),
      ),
    },
  },

  server: {
    proxy: {
      "/api": {
        target:
          "http://127.0.0.1:4000",

        changeOrigin: true,
      },

      "/ws": {
        target:
          "ws://127.0.0.1:4000",

        ws: true,
      },
    },
  },
});