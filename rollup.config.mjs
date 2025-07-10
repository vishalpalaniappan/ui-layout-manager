import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { babel } from '@rollup/plugin-babel';
import packageJson from "./package.json" assert { type: "json" };

export default {
    input: 'src/index.js',
    output: [
        {
            file: packageJson.module,
            format: 'cjs',
            sourcemap: true
        },
        {
            file: 'dist/esm/index.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        external(),
        resolve({
            extensions: ['.js', '.jsx'],
        }),
        postcss(),
        terser(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
        }),
        commonjs(),
    ]
}
