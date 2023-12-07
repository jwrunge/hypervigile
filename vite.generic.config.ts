import { defineConfig } from 'vite';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export function buildConfig(entry: string, name: string, fileName: string) {
    return defineConfig({
        build: {
            lib: {
                entry,
                name,
                fileName
            }
        },
        plugins: [
            nodeResolve()
        ]
    });
}