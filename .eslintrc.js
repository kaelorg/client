module.exports = {
  root: true,
  extends: '@hitechline/eslint-config-node',
  settings: {
    'import/resolver': {
      typescript: {
        project: ['packages/*/tsconfig.json', 'clients/*/tsconfig.json'],
      },
    },
  },
  rules: {
    'camelcase': 'off',
    'consistent-return': 'off',
    'max-classes-per-file': 'off',
    'prefer-promise-reject-errors': 'off',

    'no-underscore-dangle': 'off',
    'no-restricted-syntax': 'off',
    'no-useless-constructor': 'off',

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        alphabetize: { order: 'asc', ignoreCase: true },
        groups: [
          'module',
          '/^@root/',
          '/^@(app|core|infra|start)/',
          '/^@helpers/',
          '/^@bases/',
          '/^@config/',
          '/^@utils/',
          '/(types$|^@interfaces)/',
          ['parent', 'sibling', 'index'],
        ],
      },
    ],
  },
};
