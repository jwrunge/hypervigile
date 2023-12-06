
import { defineConfig } from 'vite';
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "hypervigile",
        fileName: "hypervigile"
    }
  },
  worker: {
    format: "es"
  },
  compilerOptions: {
    "types": ["vite/client"]
  }
});
