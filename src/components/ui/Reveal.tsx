import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp, revealTransition, viewportOnce } from '../../lib/motion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'article'
}

/** Subtle fade-up on first scroll into view. Renders content immediately when reduced motion is preferred. */
export function Reveal({ children, className, delay = 0, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={fadeUp}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={viewportOnce}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </Component>
  )
}
