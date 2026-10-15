import { ArrowUpRight } from 'lucide-react'
import { enabledServices } from '../../config/company'
import { servicesCopy } from '../../config/content'
import { useQuotePrefill } from '../../context/QuotePrefillContext'
import { SectionHeading } from '../ui/SectionHeading'

export function Services() {
  const { applyPrefill } = useQuotePrefill()

  return (
    <section id="services" className="section-pad bg-cream">
      <div className="container-site">
        <SectionHeading eyebrow="Services" title={servicesCopy.heading} intro={servicesCopy.intro} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {enabledServices.map((service) => (
            <article key={service.id} className="group overflow-hidden bg-white shadow-sm">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-navy/20" />
              </div>
              <div className="p-6 md:p-7">
                <h3 className="text-xl font-bold tracking-tight">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate">{service.description}</p>
                <a
                  href="/#quote"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-accent"
                  onClick={() => applyPrefill({ serviceId: service.id })}
                >
                  Request a Quote
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
