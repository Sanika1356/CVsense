import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rollupOptions: {
      external: ["html2canvas", "jspdf", "pdfjs-dist"],
    },
  },
  ssr: {
    external: ["html2canvas", "jspdf", "pdfjs-dist"],
  },
});
