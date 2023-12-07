import { defineConfig } from 'vite';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig({
  build: {
    lib: {
        entry: "src/index.ts",
        name: "fret",
        fileName: "fret"
    }
  },
  plugins: [
    nodeResolve()
  ]
});
