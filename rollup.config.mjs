import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { babel } from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';

const entries = {
  index: 'src/index.ts',
  search: 'src/entries/search.ts',
  'json-viewer': 'src/entries/json-viewer.ts',
  'code-editor': 'src/entries/code-editor.ts',
  'code-editor-custom': 'src/entries/code-editor-custom.ts',
};

function packageEntrypoints() {
  return {
    name: 'package-entrypoints',
    generateBundle({ format }) {
      const isEsm = format === 'es';
      this.emitFile({
        type: 'asset',
        fileName: isEsm ? 'index.esm.js' : 'index.cjs.js',
        source: isEsm
          ? "export * from './index.mjs';\n"
          : "module.exports = require('./index.cjs');\n",
      });

      if (isEsm) {
        for (const name of Object.keys(entries)) {
          const declaration = name === 'index' ? name : `entries/${name}`;
          this.emitFile({
            type: 'asset',
            fileName: `${name}.d.mts`,
            source: `export * from './${declaration}.js';\n`,
          });
        }
      }
    },
  };
}

export default [
  {
    input: entries,
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].cjs',
        chunkFileNames: 'chunks/[name]-[hash].cjs',
        sourcemap: true,
      },
      {
        dir: 'dist',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: ({ name, isEntry }) =>
          isEntry
            ? '[name].mjs'
            : `esm/${name.replaceAll('node_modules/', 'vendor/')}.mjs`,
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
        maxWorkers: 2,
        compress: {
          drop_console: ['log', 'info'],
          drop_debugger: true,
        },
        output: {
          comments: false,
        },
      }),
      packageEntrypoints(),
    ],
  },
];
