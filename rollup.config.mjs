import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import image from '@rollup/plugin-image';
import { babel } from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      del({ targets: 'dist/*' }),
      peerDepsExternal(),
      resolve({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        preferBuiltins: false,
      }),
      commonjs(),
      image(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        extract: false,
        minimize: true,
        inject: true,
        use: {
          sass: {
            silenceDeprecations: ['legacy-js-api'],
          },
        },
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      terser({
        compress: {
          drop_console: ['log', 'info'],
          drop_debugger: true,
        },
        output: {
          comments: false,
        },
      }),
    ],
  },
];
