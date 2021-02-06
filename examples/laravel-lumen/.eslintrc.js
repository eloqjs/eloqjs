module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['prettier', 'import', 'simple-import-sort'],
  rules: {
    'prettier/prettier': 'error',

    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',

    /* Others */
    'no-console': 'error'
  }
}
