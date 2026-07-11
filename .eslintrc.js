module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  globals: {
    React: 'readonly',
    ReactDOM: 'readonly',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'consistent-return': 'off',
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'always',
    }],
    'max-len': 'off',
    'no-bitwise': 'off',
    'no-irregular-whitespace': 'off',
    'no-nested-ternary': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': ['error', {
      allow: [
        '__lpTweaks',
        '__TWEAKS_STYLE',
        '_railEnabled',
        '__twkIsLight',
      ],
    }],
    'no-use-before-define': ['error', {
      classes: true,
      functions: false,
      variables: false,
    }],
    'jsx-a11y/label-has-associated-control': ['error', {
      assert: 'either',
    }],
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-no-undef': ['error', { allowGlobals: true }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
