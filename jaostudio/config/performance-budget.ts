export const PERFORMANCE_BUDGETS = {
  sharedFirstLoadJsKb: {
    warn: 190,
    fail: 210,
  },

  homepageJsKb: {
    warn: 310,
    fail: 340,
  },

  projectPageJsKb: {
    warn: 310,
    fail: 340,
  },
} as const

export type BudgetKey = keyof typeof PERFORMANCE_BUDGETS
