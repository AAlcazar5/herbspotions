// eslint.config.mjs
import eslintPluginNext from '@next/eslint-plugin-next';

const eslintConfig = [
  {
    plugins: {
      '@next/next': eslintPluginNext,
    },
    rules: {
      ...eslintPluginNext.configs.recommended.rules,
      '@next/next/no-img-element': 'off',
      // '@next/next/no-document-import-in-page': 'off', // Disable this rule
    },
  },
  // Add any other ESLint configurations or overrides below this line
];

export default eslintConfig;