// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import inlineCode from 'rollup-plugin-inline-code';

const variants = ["noworker", "worker"];
function assembleIo() {
    let cfg = [];
    for(let variant of variants) {
        cfg.push({
            input: `src/index.${variant}.ts`,
            output: [
                {
                    file: `dist/${variant}/fret.js`,
                    format: 'iife',
                    name: "Cu",
                },
                {
                    file: `dist/${variant}/fret.umd.js`,
                    format: 'umd',
                },
            ],
            plugins: [
                typescript(), 
                inlineCode(),
                terser(),
            ]
        })
    }

    return cfg;
}

export default [
    ...assembleIo()
];
