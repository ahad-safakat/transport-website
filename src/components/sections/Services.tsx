import { ArrowUpRight } from 'lucide-react'
import { enabledServices } from '../../config/company'
import { servicesCopy } from '../../config/content'
import { useQuotePrefill } from '../../context/quotePrefill'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function Services() {
  const { requestQuote } = useQuotePrefill()

  return (
    <section id="services" className="section-pad bg-cream">
      <div className="container-site">
        <Reveal>
          <SectionHeading eyebrow="Services" title={servicesCopy.heading} intro={servicesCopy.intro} />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {enabledServices.map((service, index) => (
            <Reveal key={service.id} as="article" delay={(index % 2) * 0.08} className="group flex flex-col bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(10,10,10,0.45)]">
              <div className="relative aspect-[16/9] overflow-hidden bg-charcoal">
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  style={{ objectPosition: service.imagePosition }}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" aria-hidden="true" />
                <span className="absolute bottom-4 left-5 text-xs font-bold tracking-[0.2em] text-white/90">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <h3 className="text-xl font-extrabold tracking-tight md:text-2xl">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate md:text-[15px] md:leading-7">{service.description}</p>
                <a
                  href="/#quote"
                  className="mt-7 inline-flex min-h-11 items-center gap-2 self-start border-b-2 border-accent pb-1 text-sm font-bold text-navy transition-colors hover:text-accent-ink"
                  onClick={(event) => {
                    event.preventDefault()
                    requestQuote({ serviceId: service.id })
                  }}
                  aria-label={`Request a quote for ${service.title}`}
                >
                  Request a Quote
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
