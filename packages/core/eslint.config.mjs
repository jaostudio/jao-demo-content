import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  ...compat.extends('next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@jaostudio/engine'], message: 'core must not import engine' },
            { group: ['@jaostudio/ui'], message: 'core must not import ui' },
            { group: ['@jaostudio/analytics'], message: 'core must not import analytics' },
            { group: ['@jaostudio/config'], message: 'core must not import config' },
          ],
        },
      ],
    },
  },
]

export default eslintConfig
