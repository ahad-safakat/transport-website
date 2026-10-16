import { motion, useReducedMotion } from 'framer-motion'
import { processCopy, processSteps } from '../../config/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function HowItWorks() {
  const reduce = useReducedMotion()
  // The rail runs vertically on mobile and horizontally from the md breakpoint.
  const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches

  return (
    <section id="how-it-works" className="section-pad bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading eyebrow="How it works" title={processCopy.heading} intro={processCopy.intro} />
        </Reveal>
        <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
          {/* Timeline rail: vertical on mobile, horizontal from md. */}
          <span className="absolute top-2 bottom-2 left-[19px] w-px bg-navy/10 md:top-[19px] md:right-[12.5%] md:bottom-auto md:left-0 md:h-px md:w-auto" aria-hidden="true" />
          {/* Yellow progress line draws across the steps when the section scrolls into view. */}
          <motion.span
            className="absolute top-2 bottom-2 left-[19px] w-px origin-top bg-accent md:top-[19px] md:right-[12.5%] md:bottom-auto md:left-0 md:h-px md:w-auto md:origin-left"
            aria-hidden="true"
            initial={reduce ? false : { scaleX: isDesktop ? 0 : 1, scaleY: isDesktop ? 1 : 0 }}
            whileInView={{ scaleX: 1, scaleY: 1 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          {processSteps.map((step, index) => (
            <Reveal key={step.step} as="li" delay={index * 0.15} className="relative grid grid-cols-[40px_1fr] gap-5 md:block">
              <motion.span
                className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-white text-xs font-extrabold text-navy transition-colors duration-300 hover:bg-accent"
                initial={reduce ? false : { scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.25 + index * 0.25 }}
              >
                {step.step}
              </motion.span>
              <div className="md:mt-7 md:pr-4">
                <p className="text-[11px] font-bold tracking-[0.2em] text-accent-ink uppercase">Step {step.step}</p>
                <h3 className="mt-2 text-lg font-extrabold tracking-tight">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-slate">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
