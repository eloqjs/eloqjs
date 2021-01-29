module.exports = {
  overrides: [
    {
      files: ['src/mixins/**/*.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off'
      }
    }
  ]
}
