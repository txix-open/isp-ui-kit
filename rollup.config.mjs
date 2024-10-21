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
    output: {
      file: 'dist/index.js',
      format: 'esm',
      inlineDynamicImports: true,
    },
    plugins: [
      del({ targets: 'dist/*' }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      peerDepsExternal(),
      resolve({
        extensions: ['.js', '.jsx'],
      }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({ minimize: true }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        output: {
          comments: false,
        },
      }),
      image(),
    ],
  },
];
