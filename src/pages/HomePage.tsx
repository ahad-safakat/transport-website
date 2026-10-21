import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'
import { Coverage } from '../components/sections/Coverage'
import { Gallery } from '../components/sections/Gallery'
import { Hero } from '../components/sections/Hero'
import { HowItWorks } from '../components/sections/HowItWorks'
import { Industries } from '../components/sections/Industries'
import { Partner } from '../components/sections/Partner'
import { QuoteForm } from '../components/sections/QuoteForm'
import { Services } from '../components/sections/Services'
import { Video } from '../components/sections/Video'
import { WhyChooseUs } from '../components/sections/WhyChooseUs'
import { Seo } from '../components/seo/Seo'

export function HomePage() {
  return (
    <>
      <Seo path="/" />
      <Hero />
      <About />
      <Video />
      <Gallery />
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
