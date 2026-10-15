import { whyCopy } from '../../config/content'
import { SectionHeading } from '../ui/SectionHeading'

export function WhyChooseUs() {
  return (
    <section className="section-pad bg-navy text-white">
      <div className="container-site">
        <SectionHeading eyebrow="Value" title={whyCopy.heading} light />
        <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-2">
          {whyCopy.items.map((item) => (
            <article key={item.number} className="bg-navy p-8">
              <p className="text-accent text-sm font-bold tracking-[0.2em]">{item.number}</p>
              <h3 className="mt-4 text-2xl font-bold tracking-tight">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/70">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
