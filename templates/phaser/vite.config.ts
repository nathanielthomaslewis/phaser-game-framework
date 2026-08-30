import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@ui": path.resolve(__dirname, "../../shared/ui"),
    },
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
