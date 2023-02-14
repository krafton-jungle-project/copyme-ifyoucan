module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['react-app', 'prettier'],
  root: true,
  env: {
    node: true,
  },
  rules: {
    'prefer-template': 1,
    '@typescript-eslint/consistent-type-imports': 1,
    'eqeqeq': [1, 'smart'],
    //   '@typescript-eslint/interface-name-prefix': 'off',
    //   '@typescript-eslint/explicit-function-return-type': 'off',
    //   '@typescript-eslint/explicit-module-boundary-types': 'off',
    //   '@typescript-eslint/no-explicit-any': 'off',
  },
};
