import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["jspdf"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@common": path.resolve(__dirname, "src/common"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@helpers": path.resolve(__dirname, "src/helpers"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@layout": path.resolve(__dirname, "src/layout"),
      "@config": path.resolve(__dirname, "src/config"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});

