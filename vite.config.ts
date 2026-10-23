import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.resolve(__dirname, "pages");

// Recursively find all HTML files in pages directory
function findHtmlFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

const htmlFiles = findHtmlFiles(pagesDir);

console.log("Vite found these HTML files:", htmlFiles);
const input = htmlFiles.reduce((acc, file) => {
  const relativePath = path.relative(pagesDir, file);
  const name = relativePath.replace(/\.html$/, "").replace(/\//g, "-");
  acc[name] = file;
  return acc;
}, {});

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3000/",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist/frontend",
    rollupOptions: {
      input,
    },
  },
});
