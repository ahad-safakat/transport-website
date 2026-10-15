import { company, displayName } from './company.ts'

export const heroCopy = {
  headline: 'YOUR CARGO. OUR COMMITMENT.',
  supporting:
    'Premium transportation solutions connecting businesses from pickup to destination.',
  primaryCta: 'Request a Quote',
  secondaryCta: 'Explore Our Services',
}

export const aboutCopy = {
  heading: 'TRANSPORTATION BUILT ON TRUST.',
  intro:
    'We help businesses move cargo directly from an agreed pickup point to an agreed destination. Our work is transportation coordination — not warehousing, storage, or stock holding.',
  body:
    'Every enquiry is reviewed by our team so communication stays clear, vehicle requirements can be discussed, and arrangements are confirmed before movement begins. We work with companies, manufacturers, traders, and distributors that need dependable point-to-point freight movement.',
  mission: {
    title: 'Mission',
    text: 'To provide professional, well-coordinated transportation that businesses can rely on from pickup to delivery.',
  },
  vision: {
    title: 'Vision',
    text: 'To be a trusted transportation partner for organisations moving goods across the cities and states we serve.',
  },
  values: [
    {
      title: 'Clear communication',
      text: 'Enquiries are handled with timely, professional updates.',
    },
    {
      title: 'Confirmed arrangements',
      text: 'Movement proceeds according to details agreed with the customer.',
    },
    {
      title: 'Business relationships',
      text: 'We focus on repeatable, respectful service for long-term partners.',
    },
  ],
}

export const servicesCopy = {
  heading: 'TRANSPORTATION SOLUTIONS THAT MOVE BUSINESS FORWARD.',
  intro:
    'We move goods from Point A to Point B. The catalogue below reflects the transportation services we are prepared to discuss. Specialised, regulated, or refrigerated cargo is accepted only when separately confirmed.',
}

export const whyCopy = {
  heading: 'WHY BUSINESSES CHOOSE US.',
  items: [
    {
      number: '01',
      title: 'Customer-focused coordination',
      text: 'Requirements are reviewed with you so the transportation plan matches the cargo, route, and schedule you describe.',
    },
    {
      number: '02',
      title: 'Professional communication',
      text: 'You have a direct point of contact for quotations, confirmations, and follow-up questions.',
    },
    {
      number: '03',
      title: 'Flexible vehicle discussion',
      text: 'Vehicle type is confirmed against the shipment you need to move, including an option if you are unsure.',
    },
    {
      number: '04',
      title: 'Clear quotation process',
      text: 'Pricing and availability are shared after review. Nothing is treated as booked until both sides confirm.',
    },
  ],
}

export const processSteps = [
  {
    step: '01',
    title: 'Share your requirements',
    text: 'Provide pickup location, destination, cargo information, required vehicle, and preferred pickup date.',
  },
  {
    step: '02',
    title: 'Receive a quotation',
    text: 'Our team reviews the enquiry and contacts you with pricing and availability information.',
  },
  {
    step: '03',
    title: 'Confirm the transport',
    text: 'Vehicle, schedule, price, and other agreed details are confirmed before movement begins.',
  },
  {
    step: '04',
    title: 'Move your cargo',
    text: 'Transportation is carried out according to the confirmed arrangement.',
  },
]

export const coverageCopy = {
  heading: 'CONNECTING BUSINESSES ACROSS INDIA.',
  intro:
    'We arrange point-to-point transportation on routes we can confirm. Coverage is not assumed for every city or corridor, and we do not operate a public warehouse or depot network.',
  emptyState:
    'Confirmed service regions will appear here once they are supplied. Until then, share your pickup and destination and our team will confirm whether we can assist.',
  cta: 'Enquire about a route',
}

export const contactCopy = {
  heading: "LET'S MOVE YOUR BUSINESS FORWARD.",
  supporting:
    'Tell us about your transportation requirements. Our team will review your enquiry and help you understand the available options.',
}

export const footerCopy = {
  intro:
    'Point-to-point freight transportation for businesses that need cargo moved between agreed locations.',
}

export const chatbotCopy = {
  launcher: 'Need transport?',
  greeting: `Hello! Welcome to ${displayName()}. Where would you like to transport your goods today?`,
  disclaimer: 'This is an automated website assistant. A team member will follow up on confirmed enquiries.',
}

export const whatsappDefaultMessage =
  'Hello, I visited your website and would like to enquire about your transportation services. Could you please assist me with a quotation?'

export const privacyNotice =
  'Your enquiry details are used only to respond to this transportation request. They are sent to our team and, if email delivery is configured, to our email provider. We do not sell your information.'

export const siteTitle = isConfiguredName()
  ? `${company.name} | Premium Transportation`
  : 'Premium Transportation | Point-to-Point Freight'

export const siteDescription =
  'Premium point-to-point freight transportation for businesses. Request a quotation for intercity and interstate cargo movement.'

function isConfiguredName() {
  return company.name.trim() !== '' && !company.name.includes('[')
}
