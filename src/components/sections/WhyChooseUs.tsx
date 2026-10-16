import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, FileCheck2, Handshake, PhoneCall, Phone, Truck, type LucideIcon } from 'lucide-react'
import { company, hasPhone, telHref } from '../../config/company'
import { whyCopy } from '../../config/content'
import { useQuotePrefill } from '../../context/quotePrefill'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** One icon per reason, in the same order as whyCopy.items. */
const icons: LucideIcon[] = [Handshake, PhoneCall, Truck, FileCheck2]

export function WhyChooseUs() {
  const reduce = useReducedMotion()
  const { requestQuote } = useQuotePrefill()

  return (
    <section id="why-us" className="dark-focus section-pad relative overflow-hidden bg-navy text-white">
      <motion.div
        className="pointer-events-none absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
        animate={reduce ? undefined : { x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]"
        aria-hidden="true"
      />

      <div className="container-site relative grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="Why us" title={whyCopy.heading} intro={whyCopy.intro} light />

          <div className="relative mt-10 overflow-hidden">
            <img
              src="/images/service-intercity.jpg"
              alt="Hindustan Transport trucks in convoy on a rural road"
              className="h-44 w-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" aria-hidden="true" />
            <p className="absolute bottom-4 left-5 right-5 text-sm font-semibold text-white">
              One call to arrange the truck, the route, and the schedule.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              href="/#quote"
              onClick={(event) => {
                event.preventDefault()
                requestQuote()
              }}
            >
              Request a Quote
              <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
            </Button>
            {hasPhone() ? (
              <Button href={telHref(company.phone)} variant="secondary">
                <Phone size={16} aria-hidden="true" />
                {company.phone}
              </Button>
            ) : null}
          </div>
        </Reveal>

        <ol className="grid gap-px bg-white/10 sm:grid-cols-2">
          {whyCopy.items.map((item, index) => {
            const Icon = icons[index] ?? Handshake
            return (
              <Reveal
                key={item.number}
                as="li"
                delay={index * 0.1}
                className="group relative overflow-hidden bg-navy p-7 transition-[background-color,transform] duration-300 hover:-translate-y-1 hover:bg-charcoal md:p-9"
              >
                <span
                  className="absolute top-0 left-0 h-0.5 w-0 bg-accent transition-all duration-500 group-hover:w-full"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute -right-2 -bottom-6 text-[7rem] leading-none font-extrabold text-white/[0.05] transition-colors duration-500 group-hover:text-accent/15"
                  aria-hidden="true"
                >
                  {item.number}
                </span>

                <div className="flex items-center">
                  <motion.span
                    className="flex h-12 w-12 items-center justify-center border border-accent/40 bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-navy"
                    initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 + index * 0.1 }}
                  >
                    <Icon size={22} aria-hidden="true" />
                  </motion.span>
                </div>

                <h3 className="relative mt-7 text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="relative mt-3 text-sm leading-6 text-white/65">{item.text}</p>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
