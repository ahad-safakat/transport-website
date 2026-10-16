import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'
import { Coverage } from '../components/sections/Coverage'
import { Hero } from '../components/sections/Hero'
import { HowItWorks } from '../components/sections/HowItWorks'
import { Industries } from '../components/sections/Industries'
import { Partner } from '../components/sections/Partner'
import { QuoteForm } from '../components/sections/QuoteForm'
import { Services } from '../components/sections/Services'
import { WhyChooseUs } from '../components/sections/WhyChooseUs'
import { Seo } from '../components/seo/Seo'

export function HomePage() {
  return (
    <>
      <Seo path="/" />
      <Hero />
      <About />
      <Services />
      <Industries />
      <WhyChooseUs />
      <HowItWorks />
      <Coverage />
      <QuoteForm />
      <Partner />
      <Contact />
    </>
  )
}
