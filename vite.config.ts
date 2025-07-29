import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "node:url";

// ES module equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 5173,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});

// If you want to use an Express plugin, ensure you import required types and functions:
// import type { Plugin, ViteDevServer } from 'vite';
// import express from 'express';

// Example (commented out, remove comments to use):
/*
import type { Plugin, ViteDevServer } from 'vite';
import express from 'express';

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    configureServer(server: ViteDevServer) {
      const app = express();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
*/
