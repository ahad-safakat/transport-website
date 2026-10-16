import { company, displayName } from './company.ts'

/**
 * Website copy. Company facts come from src/config/company.ts.
 * Do not add history, founding year, fleet size, statistics, or certifications that the company has not confirmed.
 */

export const heroCopy = {
  eyebrow: 'Mangaluru · Karnataka',
  headline: 'YOUR CARGO. OUR COMMITMENT.',
  headlineLines: ['YOUR CARGO.', 'OUR COMMITMENT.'],
  supporting: `${displayName()} — logistics, transport contractors and commission agents connecting businesses from pickup to destination.`,
  primaryCta: 'Request a Quote',
  secondaryCta: 'Explore Our Services',
}

/** Descriptive facts only — no statistics, ratings, or unverified claims. */
export const heroHighlights = [
  { title: 'Based on NH 66', text: 'Office at Hosabettu, Mangaluru' },
  { title: 'Contractors & commission agents', text: 'One point of contact for your load' },
  { title: 'GST registered', text: `GSTIN ${company.gstin}` },
]

export const aboutCopy = {
  heading: 'TRANSPORTATION BUILT ON TRUST.',
  intro: `${displayName()} is a Mangaluru-based logistics business working as transport contractors and commission agents. We help businesses move cargo directly from an agreed pickup point to an agreed destination.`,
  body:
    'As commission agents we work with vehicle owners to arrange the right truck for each load, and as transport contractors we coordinate the movement with you from enquiry to delivery. Every enquiry is reviewed by our team so communication stays clear and arrangements are confirmed before movement begins.',
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
    'We move goods from Point A to Point B and arrange the right vehicle for each load. Specialised, regulated, or refrigerated cargo is accepted only when separately confirmed.',
}

export const industriesCopy = {
  heading: 'BUILT FOR BUSINESSES THAT MOVE GOODS.',
  intro:
    'We welcome transportation enquiries from businesses across sectors. Tell us what you are moving and our team will confirm a suitable vehicle and arrangement.',
  items: [
    { icon: 'factory', title: 'Manufacturers', text: 'Raw materials in, finished goods out — plant to plant or plant to market.' },
    { icon: 'store', title: 'Traders & wholesalers', text: 'Bulk consignments between markets and trading hubs.' },
    { icon: 'boxes', title: 'Distributors', text: 'Stock movement from suppliers to your distribution points.' },
    { icon: 'brick', title: 'Building materials', text: 'Cement, steel, tiles, and construction supplies to sites and dealers.' },
    { icon: 'wheat', title: 'Agricultural produce', text: 'Grains, areca, coconut, and farm produce to buyers and processors.' },
    { icon: 'cog', title: 'Industrial goods', text: 'Machinery parts, equipment, and general industrial cargo.' },
  ],
  note: 'Listed sectors describe the enquiries we welcome, not client endorsements.',
} as const

export const whyCopy = {
  heading: 'WHY BUSINESSES CHOOSE US.',
  intro:
    'Dependable transportation is built on clear communication and confirmed arrangements — not on promises we cannot verify.',
  items: [
    {
      number: '01',
      title: 'One point of contact',
      text: 'As transport contractors and commission agents, we arrange the vehicle and coordinate the movement so you are not chasing several parties.',
    },
    {
      number: '02',
      title: 'Professional communication',
      text: 'You have direct numbers for quotations, confirmations, and follow-up questions.',
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

export const processCopy = {
  heading: 'FROM ENQUIRY TO MOVEMENT.',
  intro:
    'A clear four-step process. Submitting an enquiry does not assign a vehicle — transportation begins only after quotation and confirmation.',
}

export const quoteCopy = {
  heading: 'REQUEST A TRANSPORTATION QUOTE.',
  intro:
    'Share the movement you need. Our team reviews every enquiry and replies with pricing and availability.',
  points: [
    'Every enquiry is reviewed by our team — not an automated booking.',
    'Pricing and availability are shared after review.',
    'Nothing is booked until you and our team confirm the details.',
  ],
}

export const coverageCopy = {
  heading: 'CONNECTING BUSINESSES ACROSS INDIA.',
  intro:
    'From our office on NH 66 in Mangaluru, we arrange point-to-point transportation on routes we can confirm. Coverage is not assumed for every city or corridor.',
  emptyState:
    'Share your pickup and destination and our team will confirm whether we can assist with that route.',
  cta: 'Enquire about a route',
}

export const partnerCopy = {
  eyebrow: 'Vehicle owners & agents',
  heading: 'PARTNER WITH US.',
  intro:
    'As commission agents, we work with truck owners and fellow transport agents. If you own vehicles or run an agency and would like to work with us, share your details and our team will get in touch.',
  points: ['Owner-operators and fleet owners', 'Transport agents and brokers', 'Lorry owners looking for loads on their routes'],
  disclaimer: 'Submitting this form is an introduction only. It does not guarantee loads, rates, or payments.',
}

export const contactCopy = {
  heading: "LET'S MOVE YOUR BUSINESS FORWARD.",
  supporting:
    'Tell us about your transportation requirements. Our team will review your enquiry and help you understand the available options.',
}

export const footerCopy = {
  intro: `${displayName()} — logistics, transport contractors and commission agents based in Mangaluru, moving goods for businesses between agreed pickup and delivery points.`,
}

export const chatbotCopy = {
  launcher: 'Need transport?',
  greeting: `Hello! Welcome to ${displayName()}. Where would you like to transport your goods today?`,
  disclaimer: 'This is an automated website assistant. A team member will follow up on confirmed enquiries.',
}

export const whatsappDefaultMessage = `Hello ${displayName()}, I visited your website and would like to enquire about your transportation services. Could you please assist me with a quotation?`

export const privacyNotice =
  'Your enquiry details are used only to respond to this transportation request. They are sent to our team and, if email delivery is configured, to our email provider. We do not sell your information.'

export const siteTitle = isConfiguredName()
  ? `${company.name} | Transport Contractors & Commission Agents, Mangaluru`
  : 'Premium Transportation | Point-to-Point Freight'

export const siteDescription = isConfiguredName()
  ? `${company.name}, Mangaluru — logistics, transport contractors and commission agents. Request a quotation for intercity and interstate goods transportation.`
  : 'Premium point-to-point freight transportation for businesses. Request a quotation for intercity and interstate cargo movement.'

function isConfiguredName() {
  return company.name.trim() !== '' && !company.name.includes('[')
}
