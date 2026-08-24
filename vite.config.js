import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  appType: "mpa",
  publicDir: "public",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        changelog: resolve(import.meta.dirname, "changelog.html"),
        privacy: resolve(import.meta.dirname, "privacy.html"),
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
});
