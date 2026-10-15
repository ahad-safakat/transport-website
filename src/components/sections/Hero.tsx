import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { heroCopy } from '../../config/content'
import { Button } from '../ui/Button'

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-navy text-white">
      <img
        src="/images/hero-truck.jpg"
        alt="Heavy-duty freight truck travelling on a highway"
        className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/78 to-navy/25" />
      <div className="absolute inset-0 bg-navy/25" />

      <div className="container-site relative flex min-h-[100svh] items-end pb-24 pt-32 md:items-center md:pb-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="eyebrow text-accent">Point-to-point freight</p>
          <h1 className="display-title mt-4 text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[4.2rem]">
            {heroCopy.headline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/80 md:text-lg">
            {heroCopy.supporting}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/#quote">{heroCopy.primaryCta}</Button>
            <Button href="/#services" variant="secondary">
              {heroCopy.secondaryCta}
            </Button>
          </div>
        </motion.div>
      </div>

      <a
        href="/#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[10px] tracking-[0.2em] text-white/70 uppercase md:flex"
        aria-label="Scroll to about section"
      >
        Scroll
        <ChevronDown size={16} />
      </a>
    </section>
  )
}
