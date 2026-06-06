import type { Theme } from "./types";

export function resolveTheme(theme: Theme) {
  return {
    primary: {
      50:   `var(--color-${theme.primary}-50)`,
      100:  `var(--color-${theme.primary}-100)`,
      500:  `var(--color-${theme.primary}-500)`,
      600:  `var(--color-${theme.primary}-600)`,
    },
    accent: {
      500:  `var(--color-${theme.accent}-500)`,
      600:  `var(--color-${theme.accent}-600)`,
    },
  } as const;
}

export type ResolvedTheme = ReturnType<typeof resolveTheme>;
