'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollGlow() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.6, 0.8, 0.5, 0.3])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.02, 0.04])

  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity }}
      >
        <motion.div
          className="absolute left-1/2 h-[60vh] w-[80vw] -translate-x-1/2"
          style={{ top: y }}
        >
          <div
            className="h-full w-full"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(124,58,237,0.08), transparent 70%)',
            }}
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[-1]"
        style={{ opacity: bgOpacity, backgroundColor: 'var(--bg-secondary)' }}
      />
    </>
  )
}
