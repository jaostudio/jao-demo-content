const LIMITS = {
  button: Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--i18n-max-button-chars')) || 22,
  label: Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--i18n-max-label-chars')) || 30,
}

export function warnLayoutRisk(text: string, context: 'button' | 'label', key?: string) {
  if (process.env.NODE_ENV !== 'development') return
  const limit = LIMITS[context]
  if (text.length > limit) {
    console.warn(
      `[i18n] ${key || text} (${text.length} chars) exceeds ${context} limit (${limit}) - may cause layout overflow.`,
    )
  }
}
