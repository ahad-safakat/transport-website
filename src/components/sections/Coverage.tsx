import { ArrowRight, MapPin } from 'lucide-react'
import { confirmedRegions } from '../../config/company'
import { coverageCopy } from '../../config/content'
import { useQuotePrefill } from '../../context/quotePrefill'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { RouteVisual } from '../visuals/RouteVisual'

export function Coverage() {
  const { requestQuote } = useQuotePrefill()

  return (
    <section id="coverage" className="section-pad bg-cream">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading eyebrow="Coverage" title={coverageCopy.heading} intro={coverageCopy.intro} />
          {confirmedRegions.length > 0 ? (
            <>
              <p className="mt-8 text-xs font-bold tracking-[0.16em] text-navy/50 uppercase">Confirmed service regions</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {confirmedRegions.map((region) => (
                  <li key={region.id} className="inline-flex items-center gap-1.5 border border-navy/10 bg-white px-3.5 py-2 text-sm font-semibold">
                    <MapPin size={14} className="text-accent-ink" aria-hidden="true" />
                    {region.label}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-5 text-slate">
                Listed regions are not a guarantee that every route within them is available. Our team confirms each
                enquiry.
              </p>
            </>
          ) : (
            <p className="mt-8 border-l-2 border-accent bg-white px-5 py-4 text-sm leading-6 text-slate">
              {coverageCopy.emptyState}
            </p>
          )}
          <div className="mt-9">
            <Button
              href="/#quote"
              onClick={(event) => {
                event.preventDefault()
                requestQuote()
              }}
            >
              {coverageCopy.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <RouteVisual />
        </Reveal>
      </div>
    </section>
  )
}
