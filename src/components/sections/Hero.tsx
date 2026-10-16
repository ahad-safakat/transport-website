import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { heroCopy, heroHighlights } from '../../config/content'
import { useQuotePrefill } from '../../context/quotePrefill'
import { Button } from '../ui/Button'

export function Hero() {
  const reduce = useReducedMotion()
  const { requestQuote } = useQuotePrefill()

  const item = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section id="home" className="dark-focus relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy text-white">
      <motion.img
        src="/images/hero-truck.jpg"
        alt="Hindustan Transport Ashok Leyland truck travelling on an open highway at sunset"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[22%_center] lg:object-left"
        width={1600}
        height={890}
        fetchPriority="high"
        decoding="async"
        initial={reduce ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Mobile: darken from the bottom where copy sits. Desktop: darken the open sky on the right. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/80 to-navy/30 lg:bg-gradient-to-l lg:from-navy lg:via-navy/75 lg:to-navy/5"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-navy/70 to-transparent" aria-hidden="true" />

      <div className="container-site relative flex flex-1 items-end pt-32 pb-10 lg:items-center lg:justify-end lg:pb-16">
        {/* Scroll cue sits in the open bottom-left corner over the photo, clear of the copy on the right. */}
        <a
          href="/#about"
          className="absolute bottom-8 left-0 hidden items-center gap-3 rounded-full bg-navy/50 py-2 pr-4 pl-2 text-[10px] font-bold tracking-[0.25em] text-white/80 uppercase backdrop-blur-sm transition-colors hover:text-accent lg:flex"
          aria-label="Scroll to About Us"
        >
          <span className="relative flex h-10 w-6 justify-center rounded-full border-2 border-white/40">
            <span className={`mt-2 h-2 w-1 rounded-full bg-accent ${reduce ? '' : 'animate-[scroll-dot_1.8s_ease-in-out_infinite]'}`} />
          </span>
          Scroll
        </a>
        <div className="max-w-xl lg:max-w-[38rem]">
          <motion.p {...item(0.05)} className="eyebrow eyebrow-on-dark flex items-center gap-3">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            {heroCopy.eyebrow}
          </motion.p>
          <h1
            className="display-title mt-5 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem]"
          >
            {heroCopy.headlineLines.map((line, index) => (
              <motion.span
                key={line}
                {...item(0.2 + index * 0.14)}
                className={`block ${index === heroCopy.headlineLines.length - 1 ? 'text-accent' : ''}`}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p {...item(0.5)} className="mt-6 max-w-lg text-base leading-7 text-white/80 md:text-lg md:leading-8">
            {heroCopy.supporting}
          </motion.p>
          <motion.div {...item(0.62)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              href="/#quote"
              onClick={(event) => {
                event.preventDefault()
                requestQuote()
              }}
            >
              {heroCopy.primaryCta}
              <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
            </Button>
            <Button href="/#services" variant="secondary">
              {heroCopy.secondaryCta}
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-navy/60 backdrop-blur-md">
        <ul className="container-site grid grid-cols-1 divide-y divide-white/10 py-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-0">
          {heroHighlights.map((highlight, index) => (
            <motion.li key={highlight.title} {...item(0.8 + index * 0.1)} className="flex items-start gap-3 py-3 sm:px-6 sm:py-5 sm:first:pl-0">
              <span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
              <span>
                <span className="block text-sm font-bold">{highlight.title}</span>
                <span className="mt-0.5 hidden text-xs text-white/60 sm:block">{highlight.text}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
