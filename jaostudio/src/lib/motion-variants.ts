import type { Variants } from 'framer-motion'
import { durations, easeOut, easeSpring, easeEmphasis, MOTION_PRESETS, MOTION_MOBILE_PRESETS } from './motion-tokens'

export { durations, easeOut, easeSpring, easeEmphasis, MOTION_PRESETS, MOTION_MOBILE_PRESETS }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: MOTION_PRESETS.fade },
}

export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: MOTION_MOBILE_PRESETS.fadeSimple },
}

export const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { ...MOTION_PRESETS.fadeSlow, duration: 0.6 } },
}

export const scaleFade: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: easeSpring } },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: MOTION_PRESETS.fade },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: MOTION_PRESETS.fade },
}

export const slideInReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: MOTION_MOBILE_PRESETS.fade },
}

export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: { clipPath: 'inset(0 0 0 0)', transition: MOTION_PRESETS.clip },
}

export const layerReveal: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: MOTION_PRESETS.layer },
}

export const heroFloat: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: MOTION_PRESETS.heroReveal },
}

export const heroFloatReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: MOTION_MOBILE_PRESETS.heroReveal },
}

export const stagger = (delayPerChild = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delayPerChild },
  },
})

export const staggerSlow = (delayPerChild = 0.12): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delayPerChild, delayChildren: 0.05 },
  },
})

export const staggerFast = (delayPerChild = 0.04): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delayPerChild },
  },
})

export const STAGGER_TIERS = {
  dense: { staggerChildren: 0.04, maxChildren: 6 } as const,
  normal: { staggerChildren: 0.08, maxChildren: 8 } as const,
  relaxed: { staggerChildren: 0.12, maxChildren: 12 } as const,
}

export const MOTION_VARIANTS = {
  fade: {
    desktop: fadeUpBlur,
    mobile: fadeUpReduced,
  },
  hero: {
    desktop: heroFloat,
    mobile: heroFloatReduced,
  },
  slideLeft: {
    desktop: slideInLeft,
    mobile: slideInReduced,
  },
  slideRight: {
    desktop: slideInRight,
    mobile: slideInReduced,
  },
} as const
