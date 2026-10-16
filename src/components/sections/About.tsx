import { motion, useReducedMotion } from 'framer-motion'
import { allPhones, company, hasAddress, hasGstin, hasPhone, isPlaceholder } from '../../config/company'
import { aboutCopy } from '../../config/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** Verified company facts only (from company configuration). */
const facts = ([
  { label: 'Business', value: isPlaceholder(company.tagline) ? null : company.tagline },
  { label: 'Office', value: hasAddress() ? company.officeAddress : null, href: company.mapsUrl },
  { label: 'GSTIN', value: hasGstin() ? company.gstin : null },
  { label: 'Phone', value: hasPhone() ? allPhones().slice(0, 2).join(' · ') : null },
] as { label: string; value: string | null; href?: string }[]).filter(
  (fact): fact is { label: string; value: string; href?: string } => Boolean(fact.value),
)

export function About() {
  const reduce = useReducedMotion()
  return (
    <section id="about" className="section-pad bg-white">
      <div className="container-site grid items-start gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="absolute -top-5 -left-5 hidden h-32 w-32 border-t-2 border-l-2 border-accent lg:block" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden bg-charcoal sm:aspect-[4/3] lg:aspect-[4/5]">
            {/* Yellow panel wipes away to reveal the photo the first time it scrolls into view. */}
            <motion.span
              className="absolute inset-0 z-10 origin-right bg-accent"
              aria-hidden="true"
              initial={reduce ? { scaleX: 0 } : { scaleX: 1 }}
              whileInView={{ scaleX: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
            />
            <img
              src="/images/about-truck.jpg"
              alt="Covered goods truck travelling along a mountain highway"
              className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="dark-focus relative -mt-16 ml-auto w-[85%] bg-navy p-6 text-white sm:w-2/3 md:p-7">
            <p className="eyebrow eyebrow-on-dark">{aboutCopy.mission.title}</p>
            <p className="mt-3 text-sm leading-6 text-white/80">{aboutCopy.mission.text}</p>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2 lg:pt-6" delay={0.1}>
          <SectionHeading eyebrow="About us" title={aboutCopy.heading} intro={aboutCopy.intro} />
          <p className="mt-5 text-base leading-7 text-slate">{aboutCopy.body}</p>

          <div className="mt-10 border-t border-navy/10 pt-8">
            <p className="text-xs font-bold tracking-[0.16em] text-navy/50 uppercase">{aboutCopy.vision.title}</p>
            <p className="mt-2 text-lg leading-7 font-semibold tracking-tight">{aboutCopy.vision.text}</p>
          </div>

          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {aboutCopy.values.map((value, index) => (
              <li key={value.title} className="border-t-2 border-accent pt-4">
                <p className="text-xs font-bold text-accent-ink">0{index + 1}</p>
                <p className="mt-2 text-sm font-bold">{value.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-slate">{value.text}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-10 grid gap-px bg-navy/10 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-cream px-5 py-4">
                <dt className="text-[11px] font-bold tracking-[0.16em] text-navy/50 uppercase">{fact.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-navy">
                  {fact.href ? (
                    <a href={fact.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent-ink">
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
