// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import dts from 'vite-plugin-dts';
import fs from 'fs';

const variants = ["noworker", "worker"];
function assembleIo() {
    let cfg = [];

    for(let variant of variants) {
        const plugins = [
            replace({
                values: {
                    __WORKER__: fs.readFileSync(`dist/hashAny.worker.js`, "utf8").replace(/[\!\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\"\'\`\;]/g, "\\$&").replace(/\n/, "")
                },
                preventAssignment: true
            }),
            typescript(), 
            terser()
        ]

        if(variant === "worker") {
            plugins.push(
                dts({
                    rollupTypes: true
                })
            )
        }

        cfg.push({
            input: `src/index.${variant}.ts`,
            output: [
                {
                    file: `dist/${variant}/fret.js`,
                    format: 'iife',
                    name: "fret",
                    strict: false,
                },
                {
                    file: `dist/${variant}/fret.cjs`,
                    format: 'cjs',
                    name: "fret",
                    strict: false,
                },
                {
                    file: `dist/${variant}/fret.mjs`,
                    format: 'es',
                    name: "fret",
                    strict: false,
                },
            ],
            plugins
        })
    }

    return cfg;
}

export default assembleIo();
