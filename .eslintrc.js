const fs = require('fs');

/**
 * Find our basedir imports, i.e. 'types', 'components', 'service-worker'
 */
const BASE_TS_IMPORTS = fs.readdirSync('src', { withFileTypes: true }).map((d) => {
  const name = d.name;
  return d.isDirectory() ? name : name.split('.')[0];
});

/**
 * general rule is that the main application MUST use Typescript, but the random NodeJS scripts don't
 *
 * Prettier plugins are managed separately, because prettier needs to be at the end of the plugins list, but these should be at the beginning
 */
const UNIVERSAL_PLUGINS = [
  'array-func',
  'no-use-extend-native',
  'optimize-regex',
  'sonarjs',
  'simple-import-sort',
  'only-warn', // NEVER use "error". eslint should never stop compilation, only commits and CI/CD
];

/**
 * note: does not include prettier because that always needs to be listed last
 *
 * however, prettier should be in every configuration
 */
const UNIVERSAL_EXTENDS = [
  'eslint:recommended',
  'react-app',
  'airbnb',
  'plugin:array-func/all',
  'plugin:no-use-extend-native/recommended',
  'plugin:optimize-regex/recommended',
  'plugin:sonarjs/recommended', // includes a cyclomatic complexity checker with default level of 15, seems more thorough than the eslint checker
];

/**
 * always put these at the end of the plugins list
 */
const PRETTIER_EXTENDS = ['prettier', 'eslint-config-prettier'];

/**
 * Values guideline
 *
 * 0 = off
 * 1 = warn
 * 2 = error (do not use error)
 */
const UNIVERSAL_RULES = {
  complexity: [1, 10], // eslint cyclomatic-complexity checker <= 10
  'import/prefer-default-export': 0, // it's fine to use either default or non-default exports, depending on context
  'no-underscore-dangle': 0, // allow variables to start with _ (needed for some libraries)
  'no-nested-ternary': 0, // generally best to allow this for React rendering logic
  'no-return-assign': 0, // allow arrow function return
  'no-plusplus': 0, // allow ++ and --
  'prefer-destructuring': 0, // try not to destructure objects when using Mobx
};

module.exports = {
  root: true,
  overrides: [
    // .ts and .tsx files should be used for the main React application
    {
      files: ['*.ts', '*.tsx'],
      plugins: [...UNIVERSAL_PLUGINS, '@typescript-eslint'],
      extends: [
        ...UNIVERSAL_EXTENDS,
        'plugin:@typescript-eslint/eslint-recommended',
        'airbnb-typescript',
        'plugin:no-unsanitized/DOM',
        ...PRETTIER_EXTENDS,
      ],
      rules: {
        ...UNIVERSAL_RULES,
        '@typescript-eslint/ban-types': 1, // avoid some bad TS builtins
        '@typescript-eslint/comma-dangle': 0, // Managed by prettier
        '@typescript-eslint/indent': 0, // Managed by prettier
        '@typescript-eslint/member-ordering': 1, // require consistent ordering of class variables/methods/etc.
        '@typescript-eslint/no-parameter-properties': 1, // force explicit declaration of class properties in constructor
        '@typescript-eslint/semi': 0, // Managed by prettier
        'import/order': 0, // off for simple-import-sort
        'no-console': 1, // use window.console if something needs to be logged in production
        'react/destructuring-assignment': 0, // Mobx needs non-destructuring assignments
        'react/jsx-closing-bracket-location': 0, // managed by prettier
        'react/jsx-curly-newline': 0, // managed by prettier
        'react/jsx-indent': 0, // managed by prettier
        'react/jsx-indent-props': 0, // managed by prettier
        'react/jsx-one-expression-per-line': 0, // managed by prettier
        'react/jsx-props-no-spreading': 0, // allow props spreading
        'react/jsx-wrap-multilines': 0, // managed by prettier
        'react/react-in-jsx-scope': 0, // React >= 17 doesn't require React namespace to be imported for jsx/tsx files
        'react/require-default-props': 0, // React components don't need to have default values
        'react-hooks/exhaustive-deps': 0, // disabled for mobx
        'simple-import-sort/imports': [
          1,
          {
            groups: [
              // side effect imports first (CSS and JSON will get grouped here)
              ['^\\u0000'],
              // sort React packages first, then mobx packages, then anything which indicates external JS package (not relative path or in the base TS imports)
              ['^react.*', '^mobx.*', `^(?!${BASE_TS_IMPORTS.join('|')}(?=/|$))@?\\w`],
              // absolute ts(x)/js(x) imports (from baseUrl, no file extension at the end), then relative imports without file extension
              [`^(${BASE_TS_IMPORTS.join('|')})(/(?!.*\\.).*|$)`, '^[\\.\\.?/]+[^\\.]+$'],
              // everything else - mainly asset imports (i.e. images)
              [''],
            ],
          },
        ], // sort imports in a specific order (this is autofixable)
        'simple-import-sort/exports': 1, // sort exports (this is autofixable)
        'sort-imports': 0, // off for simple-import-sort
      },
      parserOptions: {
        project: './tsconfig.json',
      },
      parser: '@typescript-eslint/parser',
    },
    // Javascript should be used for random NodeJS scripts which are not part of the application
    {
      files: ['bin/*.js', '.eslintrc.js'],
      plugins: UNIVERSAL_PLUGINS,
      extends: [...UNIVERSAL_EXTENDS, ...PRETTIER_EXTENDS],
      rules: {
        ...UNIVERSAL_RULES,
        'no-console': 0, // console logging is expected when in a Node environment
        'import/no-extraneous-dependencies': 0, // don't force deps to be explicitly listed under package.json dependencies
        'import/order': [1, { 'newlines-between': 'always' }], // needed for sorting require calls
      },
      env: {
        node: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
  ],
};
