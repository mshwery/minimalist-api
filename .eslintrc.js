module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint'
  ],
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint'
  ],
  ignorePatterns: ['build', 'dist', 'public', 'node_modules', 'mobile'],
  rules: {
    // '@typescript-eslint/adjacent-overload-signatures': 'error',
    // '@typescript-eslint/array-type': 'error',
    // '@typescript-eslint/await-thenable': 'error',
    // '@typescript-eslint/ban-types': 'error',
    // '@typescript-eslint/class-name-casing': 'error',
    // '@typescript-eslint/explicit-member-accessibility': [
    //   'off',
    //   {
    //     overrides: {
    //       constructors: 'off'
    //     }
    //   }
    // ],
    // '@typescript-eslint/indent': 'error',
    // '@typescript-eslint/interface-name-prefix': 'off',
    // '@typescript-eslint/member-delimiter-style': 'off',
    // '@typescript-eslint/no-angle-bracket-type-assertion': 'error',
    // '@typescript-eslint/no-empty-interface': 'error',
    // '@typescript-eslint/no-explicit-any': 'off',
    // '@typescript-eslint/no-misused-new': 'error',
    // '@typescript-eslint/no-namespace': 'error',
    // '@typescript-eslint/no-parameter-properties': 'off',
    // '@typescript-eslint/no-triple-slash-reference': 'error',
    // '@typescript-eslint/no-use-before-declare': 'off',
    // '@typescript-eslint/no-var-requires': 'off',
    // '@typescript-eslint/prefer-for-of': 'error',
    // '@typescript-eslint/prefer-function-type': 'error',
    // '@typescript-eslint/prefer-interface': 'error',
    // '@typescript-eslint/prefer-namespace-keyword': 'error',
    // '@typescript-eslint/type-annotation-spacing': 'error',
    // '@typescript-eslint/unified-signatures': 'error',
    // 'arrow-body-style': 'error',
    // 'arrow-parens': [
    //   'off',
    //   'as-needed'
    // ],
    // 'complexity': 'off',
    // 'constructor-super': 'error',
    // 'curly': 'error',
    // 'dot-notation': 'error',
    // 'eol-last': 'off',
    // 'guard-for-in': 'error',
    // 'linebreak-style': 'off',
    // 'max-classes-per-file': 'off',
    // 'member-ordering': 'error',
    // 'new-parens': 'off',
    // 'newline-per-chained-call': 'off',
    // 'no-bitwise': 'error',
    // 'no-caller': 'error',
    // 'no-cond-assign': 'error',
    // 'no-console': 'warn',
    // 'no-debugger': 'error',
    // 'no-empty': 'error',
    // 'no-empty-functions': 'error',
    // 'no-eval': 'error',
    // 'no-extra-semi': 'off',
    // 'no-fallthrough': 'off',
    // 'no-invalid-this': 'off',
    // 'no-irregular-whitespace': 'off',
    // 'no-multiple-empty-lines': 'off',
    // 'no-new-wrappers': 'error',
    // 'no-throw-literal': 'error',
    // 'no-undef-init': 'error',
    // 'no-unsafe-finally': 'error',
    // 'no-unused-labels': 'error',
    // 'no-var': 'error',
    // 'object-shorthand': 'error',
    // 'one-var': 'error',
    // 'prefer-const': 'error',
    // 'quote-props': 'off',
    // 'radix': 'error',
    // 'space-before-function-paren': 'off',
    // 'use-isnan': 'error',
    // 'valid-typeof': 'off'
  },
  overrides: [
    {
      files: ['server/**/*.{js,ts}'],
      env: {
        node: true,
        es2017: true
      }
    },
    {
      files: ['web/**/*.{js,ts,tsx}'],
      env: {
        node: true,
        browser: true,
        es2017: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      }
    },
    {
      files: ['*-test.ts', '*.test.ts', '__tests__/**/*.ts', 'test/**/*.{js,ts}'],
      env: {
        node: true,
        jest: true,
        es2017: true
      }
    }
  ]
}
