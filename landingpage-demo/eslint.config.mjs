import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@jaostudio/config'], message: 'demo must not import config directly' },
            { group: ['commerce-demo', 'marketplace-demo', 'content-platform-demo', 'database-security-demo', 'web-application-demo'], message: 'demo must not import sibling demo' },
            { group: ['@jaostudio/engine/src/*'], message: 'import from @jaostudio/engine public paths only' },
            { group: ['@jaostudio/core/src/*'], message: 'import from @jaostudio/core public paths only' },
            { group: ['@jaostudio/ui/src/*'], message: 'import from @jaostudio/ui public paths only' },
          ],
        },
      ],
    },
  },
]

export default eslintConfig
