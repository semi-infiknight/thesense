import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/thesense/" : "/",
  appType: "mpa",
  publicDir: "public",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "pages/index.html"),
        changelog: resolve(import.meta.dirname, "pages/changelog.html"),
        privacy: resolve(import.meta.dirname, "pages/privacy.html"),
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
});
