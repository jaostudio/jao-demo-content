export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  xl: 0.8,
  hero: 1.2,
} as const

export const easeOut = [0.16, 1, 0.3, 1] as const
export const easeSpring = [0.34, 1.56, 0.64, 1] as const
export const easeEmphasis = [0.25, 0.46, 0.45, 0.94] as const

export const springs = {
  default: { stiffness: 300, damping: 30 },
  gentle: { stiffness: 200, damping: 25 },
  snappy: { stiffness: 400, damping: 20 },
} as const

export const staggers = {
  fast: 0.06,
  normal: 0.08,
  slow: 0.12,
} as const

export const MOTION_PRESETS = {
  hover: { duration: durations.fast, ease: easeOut },
  hoverSpring: { duration: durations.fast, ease: easeSpring },
  fade: { duration: durations.normal, ease: easeOut },
  fadeSlow: { duration: durations.slow, ease: easeOut },
  staggerFast: { delay: staggers.fast },
  staggerNormal: { delay: staggers.normal },
  staggerSlow: { delay: staggers.slow },
  sectionReveal: { duration: durations.slow, ease: easeOut },
  heroReveal: { duration: 0.65, ease: easeSpring },
  modal: { duration: 0.25, ease: easeOut },
  clip: { duration: 0.7, ease: easeEmphasis },
  layer: { duration: 0.55, ease: easeOut },
} as const

export const MOTION_MOBILE_PRESETS = {
  fade: { duration: durations.fast, ease: easeOut },
  fadeSimple: { duration: durations.normal, ease: easeOut },
  sectionReveal: { duration: durations.normal, ease: easeOut },
  heroReveal: { duration: 0.4, ease: easeOut },
} as const
