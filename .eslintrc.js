module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:jest-formatting/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'prettier',
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'jest',
    'jest-formatting'
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  ignorePatterns: ['dist'],
  rules: {
    'prettier/prettier': 'error',

    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',

    /* Others */
    'no-console': 'error'
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'error'
      }
    },
    {
      files: ['**/src/types/*.ts'],
      rules: {
        '@typescript-eslint/no-namespace': 'off'
      }
    },
    {
      files: ['**/test/**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off'
      }
    },
    {
      files: ['**/jest.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': ['off']
      }
    }
  ]
}
