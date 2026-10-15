import { motion, useReducedMotion } from 'framer-motion'
import { aboutCopy } from '../../config/content'
import { fadeUp, revealTransition, viewportOnce } from '../../lib/motion'
import { SectionHeading } from '../ui/SectionHeading'

export function About() {
  const reduce = useReducedMotion()

  return (
    <section id="about" className="section-pad bg-white">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={fadeUp}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          transition={revealTransition}
        >
          <SectionHeading eyebrow="About us" title={aboutCopy.heading} intro={aboutCopy.intro} />
          <p className="mt-5 text-base leading-7 text-slate">{aboutCopy.body}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <article className="border border-navy/10 bg-cream p-5">
              <h3 className="text-sm font-bold tracking-wide uppercase">{aboutCopy.mission.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate">{aboutCopy.mission.text}</p>
            </article>
            <article className="border border-navy/10 bg-cream p-5">
              <h3 className="text-sm font-bold tracking-wide uppercase">{aboutCopy.vision.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate">{aboutCopy.vision.text}</p>
            </article>
          </div>
          <ul className="mt-8 space-y-4">
            {aboutCopy.values.map((value) => (
              <li key={value.title} className="border-l-2 border-accent pl-4">
                <p className="text-sm font-bold">{value.title}</p>
                <p className="mt-1 text-sm text-slate">{value.text}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="relative">
          <div className="absolute -left-4 -top-4 hidden h-24 w-24 border border-accent/50 lg:block" />
          <img
            src="/images/about-truck.jpg"
            alt="Freight truck on a highway at dusk"
            className="relative h-[420px] w-full object-cover md:h-[520px]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
