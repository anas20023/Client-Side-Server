import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://cloud-file-storage-backend.vercel.app", // Your backend URL
        changeOrigin: true,
        secure: true, // Generally true for HTTPS; you can omit it if using a valid SSL certificate
        rewrite: (path) => path.replace(/^\/api/, ""), // Optionally rewrite the path
      },
    },
  },
});
