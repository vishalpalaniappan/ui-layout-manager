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
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: packageJson.module,
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        external(),
        resolve(),
        postcss(),
        terser(),
        commonjs(),
        babel({ babelHelpers: 'bundled',sourceMaps: true, })
    ]
}
