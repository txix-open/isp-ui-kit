module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'prettier',
    'plugin:storybook/recommended',
  ],
  ignorePatterns: [
    'ReactJsonView',
    'babel.config.js',
    '.eslintrc.js',
    '__tests__',
    'stories',
    'dist',
    'webpack.config.js',
    'rollup.config.mjs',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  plugins: ['@typescript-eslint'],
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  // Fine tune rules
  rules: {
    'jsx-a11y/label-has-associated-control': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': [2, { props: false }],
    'react/button-has-type': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': [
      'error',
      {
        forbidDefaultForRequired: true,
        functions: 'defaultArguments', //Here
      },
    ],
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/no-var-requires': 0,
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
