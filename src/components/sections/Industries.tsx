import { Boxes, BrickWall, Cog, Factory, Store, Wheat, type LucideIcon } from 'lucide-react'
import { industriesCopy } from '../../config/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const icons: Record<(typeof industriesCopy.items)[number]['icon'], LucideIcon> = {
  factory: Factory,
  store: Store,
  boxes: Boxes,
  brick: BrickWall,
  wheat: Wheat,
  cog: Cog,
}

export function Industries() {
  return (
    <section id="industries" className="section-pad bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading eyebrow="Who we serve" title={industriesCopy.heading} intro={industriesCopy.intro} />
        </Reveal>
        <ul className="mt-14 grid gap-px border border-navy/10 bg-navy/10 sm:grid-cols-2 lg:grid-cols-3">
          {industriesCopy.items.map((item, index) => {
            const Icon = icons[item.icon]
            return (
              <Reveal key={item.title} as="li" delay={(index % 3) * 0.06} className="group relative bg-white p-7 transition-colors duration-300 hover:bg-cream md:p-8">
                <span className="flex h-12 w-12 items-center justify-center bg-navy text-accent transition-[transform,background-color,color] duration-300 group-hover:-translate-y-1 group-hover:rotate-[-6deg] group-hover:bg-accent group-hover:text-navy">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-lg font-extrabold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate">{item.text}</p>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-500 group-hover:w-full" aria-hidden="true" />
              </Reveal>
            )
          })}
        </ul>
        <p className="mt-5 text-xs text-muted">{industriesCopy.note}</p>
      </div>
    </section>
  )
}
