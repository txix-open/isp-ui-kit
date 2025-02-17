import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': "off",
      '@typescript-eslint/no-empty-object-type':'off'
    },
  },
  {
    ignores: [
      '**/ReactJsonView/*',
      '**/stories/*',
      'babel.config.js',
      'eslint.config.mjs',
      '.prettierrc.js',
      '.storybook',
      'dist',
      'rollup.config.mjs',
    ],
  },
];
