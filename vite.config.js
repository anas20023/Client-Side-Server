import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This will proxy requests starting with /api to your backend server
      "/api": {
        target: "https://cloud-file-storage-backend.vercel.app", // Your backend URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // Optionally rewrite the path
      },
    },
  },
});
