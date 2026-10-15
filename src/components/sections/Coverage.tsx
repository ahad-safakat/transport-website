import { confirmedRegions } from '../../config/company'
import { coverageCopy } from '../../config/content'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'
import { IndiaMap } from '../visuals/IndiaMap'

export function Coverage() {
  return (
    <section id="coverage" className="section-pad bg-cream">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Coverage" title={coverageCopy.heading} intro={coverageCopy.intro} />
          {confirmedRegions.length > 0 ? (
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {confirmedRegions.map((region) => (
                <li key={region.id} className="border border-navy/10 bg-white px-4 py-3 text-sm font-semibold">
                  {region.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 border-l-2 border-accent bg-white px-5 py-4 text-sm leading-6 text-slate">
              {coverageCopy.emptyState}
            </p>
          )}
          <div className="mt-8">
            <Button href="/#quote">{coverageCopy.cta}</Button>
          </div>
        </div>
        <IndiaMap />
      </div>
    </section>
  )
}
