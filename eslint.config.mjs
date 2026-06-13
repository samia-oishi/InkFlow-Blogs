import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
];

export default eslintConfig;
