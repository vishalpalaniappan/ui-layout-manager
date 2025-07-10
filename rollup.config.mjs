import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { babel } from '@rollup/plugin-babel';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/cjs/index.js',
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
        external(['react', 'react-dom']),
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
