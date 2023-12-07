// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
    input: "src/hashAny.worker.ts",
    output: {
        file: "dist/hashAny.worker.js",
        format: "iife",
        name: "hashAny"
    },
    plugins: [
        typescript(),
        terser(),
    ]
};
