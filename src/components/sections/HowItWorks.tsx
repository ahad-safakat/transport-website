import { processSteps } from '../../config/content'
import { SectionHeading } from '../ui/SectionHeading'

export function HowItWorks() {
  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading
          eyebrow="Process"
          title="FROM ENQUIRY TO MOVEMENT."
          intro="Submitting an enquiry does not assign a vehicle. Transportation begins only after quotation, confirmation, and agreed details are in place."
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-4">
          {processSteps.map((step, index) => (
            <li key={step.step} className="relative">
              {index < processSteps.length - 1 ? (
                <span className="absolute left-10 top-5 hidden h-px w-[calc(100%-1.5rem)] bg-navy/10 md:block" />
              ) : null}
              <p className="text-accent text-sm font-bold tracking-[0.2em]">STEP {step.step}</p>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
