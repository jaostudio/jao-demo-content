import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'

export default tseslint.config(
  { ignores: ['.next/**', 'dist/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,
  {
    plugins: nextPlugin.configs['core-web-vitals'].plugins,
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@jaostudio/config'], message: 'demo must not import config directly' },
            { group: ['landingpage-demo', 'commerce-demo', 'marketplace-demo', 'content-platform-demo', 'database-security-demo', 'web-application-demo'], message: 'demo must not import sibling demo' },
            { group: ['@jaostudio/engine/src/*'], message: 'import from @jaostudio/engine public paths only' },
            { group: ['@jaostudio/core/src/*'], message: 'import from @jaostudio/core public paths only' },
            { group: ['@jaostudio/ui/src/*'], message: 'import from @jaostudio/ui public paths only' },
          ],
        },
      ],
    },
  },
)

