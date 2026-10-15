import type { Transition } from 'framer-motion'

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export const revealTransition: Transition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
}

export const viewportOnce = { once: true, margin: '-80px' as const }
