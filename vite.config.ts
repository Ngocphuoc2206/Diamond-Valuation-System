import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // CHỈ Payment đi thẳng BE 8081
      "/api/payments": {
        target: "http://localhost:7006",
        changeOrigin: true,
      },
    },
  },
});
