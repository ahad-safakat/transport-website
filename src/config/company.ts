export type ServiceCategory = {
  id: string
  title: string
  shortTitle: string
  description: string
  image: string
  imageAlt: string
  /** CSS object-position for the card crop, e.g. 'center 70%'. */
  imagePosition?: string
  enabled: boolean
}

export type VehicleType = {
  id: string
  label: string
}

export type ServiceRegion = {
  id: string
  label: string
  /** Set false for draft/placeholder entries that must not be shown as confirmed coverage. */
  confirmed: boolean
}

export type NavItem = {
  id: string
  label: string
  href: string
}

/**
 * Central company configuration.
 * Replace placeholder values before launch. Empty contact fields are hidden in the UI.
 * Do not invent history, fleet size, certifications, or coverage that has not been confirmed.
 */
export const company = {
  /** Details below are taken from the company's visiting card. */
  name: 'Hindustan Transport',
  /** Name in Kannada, shown as a secondary line. Leave empty to hide. */
  nameLocal: 'ಹಿಂದೂಸ್ತಾನ್ ಟ್ರಾನ್ಸ್ ಪೋರ್ಟ್',
  tagline: 'Logistics, Transport Contractors & Commission Agents',
  legalName: '[LEGAL ENTITY NAME]',
  /** GST registration number. Shown in the top bar, footer, and structured data. */
  gstin: '29ELBPR2283E1ZX',
  headquarters: 'Mangaluru, Karnataka, India',
  officeAddress: '1st Floor, City Neralu Building, NH 66, Hosabettu, Mangaluru, Karnataka 575019',
  /** Google Maps link for the office. Addresses on the site open this when clicked. */
  mapsUrl: 'https://maps.app.goo.gl/aftUeHDEqoggny7c7',
  /** Structured parts of the office address (used for search-engine structured data). */
  postalAddress: {
    street: '1st Floor, City Neralu Building, NH 66, Hosabettu',
    locality: 'Mangaluru',
    region: 'Karnataka',
    postalCode: '575019',
  },
  /** Digits only with country code, no plus sign. Example: 9198XXXXXXXX */
  whatsappNumber: '919741519252',
  /** Primary display telephone, used for "Call" buttons. */
  phone: '+91 97415 19252',
  /** Every published number, shown in the contact section and footer. */
  phones: ['+91 97415 19252', '+91 97401 72952', '+91 97405 99252', '+91 89711 09252'],
  email: 'transporthindustann@gmail.com',
  instagramUrl: '',
  linkedinUrl: '',
  /** Production origin without trailing slash, e.g. https://www.example.com */
  websiteDomain: '',
  /** Official logo file in /public. */
  logoSrc: '/logo.png',
  faviconSrc: '/favicon.svg',
} as const

/** Brand palette taken from the visiting card (royal blue + yellow). Mirrored in src/index.css @theme. */
export const brand = {
  colors: {
    night: '#0A1033',
    ink: '#111A4D',
    royal: '#2433A0',
    signal: '#F6C21C',
    mist: '#E9ECF6',
    steel: '#8C94B8',
  },
} as const

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/#home' },
  { id: 'about', label: 'About Us', href: '/#about' },
  { id: 'services', label: 'Services', href: '/#services' },
  { id: 'coverage', label: 'Coverage', href: '/#coverage' },
  { id: 'contact', label: 'Contact', href: '/#contact' },
]

export const services: ServiceCategory[] = [
  {
    id: 'full-truckload',
    title: 'Full Truckload Transportation',
    shortTitle: 'Full Truckload',
    description:
      'Dedicated vehicle movement for shipments that require the capacity of a full truck from pickup to destination.',
    image: '/images/service-ftl.jpg',
    imageAlt: 'Hindustan Transport Ashok Leyland container truck parked at a container yard',
    enabled: true,
  },
  {
    id: 'commercial-goods',
    title: 'Commercial Goods Transportation',
    shortTitle: 'Commercial Goods',
    description:
      'Point-to-point movement of commercial cargo for manufacturers, traders, and distributors.',
    image: '/images/service-commercial.jpg',
    imageAlt: 'Hindustan Transport truck loaded with timber and secured with straps',
    enabled: true,
  },
  {
    id: 'intercity',
    title: 'Intercity Transportation',
    shortTitle: 'Intercity',
    description:
      'Coordinated cargo movement between cities, subject to confirmed routing and vehicle availability.',
    image: '/images/service-intercity.jpg',
    imageAlt: 'Three Hindustan Transport trucks in convoy on a rural road lined with palm trees',
    enabled: true,
  },
  {
    id: 'interstate',
    title: 'Interstate Transportation',
    shortTitle: 'Interstate',
    description:
      'Transportation of goods across state borders where the route can be confirmed by our team.',
    image: '/images/service-interstate.jpg',
    imageAlt: 'Hindustan Transport container truck on a highway at sunrise',
    enabled: true,
  },
  {
    id: 'transport-contracting',
    title: 'Transport Contracting & Commission Agency',
    shortTitle: 'Contracting & Agency',
    description:
      'As transport contractors and commission agents, we arrange a suitable vehicle for your load through our network of vehicle owners — so you deal with one point of contact.',
    image: '/images/service-contracting.jpg',
    imageAlt: 'Hindustan Transport truck loaded with blue drums outside a warehouse',
    enabled: true,
  },
  {
    id: 'part-load',
    title: 'Part-Load Transportation',
    shortTitle: 'Part Load',
    description:
      'Shared-vehicle movement for smaller consignments, offered only when confirmed for the requested route.',
    image: '/images/service-ftl.jpg',
    imageAlt: 'Freight truck prepared for cargo movement',
    enabled: false,
  },
]

export const vehicleTypes: VehicleType[] = [
  { id: 'lcv', label: 'Light commercial vehicle' },
  { id: 'mcv', label: 'Medium commercial vehicle' },
  { id: 'hcv', label: 'Heavy commercial / full truckload' },
  { id: 'trailer', label: 'Trailer / high-capacity vehicle' },
  { id: 'other', label: 'Other / Not Sure' },
]

/**
 * Add only regions the company has confirmed.
 * Unconfirmed or placeholder entries stay hidden while `confirmed` is false.
 */
export const serviceableRegions: ServiceRegion[] = [
  { id: 'placeholder-region', label: '[CONFIRMED REGION]', confirmed: false },
]

export const enabledServices = services.filter((service) => service.enabled)
export const confirmedRegions = serviceableRegions.filter((region) => region.confirmed)

export function isPlaceholder(value: string): boolean {
  return value.trim() === '' || value.includes('[')
}

export function displayName(): string {
  return isPlaceholder(company.name) ? 'Transportation Partner' : company.name
}

export function hasWhatsApp(): boolean {
  return /^\d{10,15}$/.test(company.whatsappNumber)
}

export function hasPhone(): boolean {
  return company.phone.trim() !== '' && !isPlaceholder(company.phone)
}

export function hasEmail(): boolean {
  return company.email.includes('@') && !isPlaceholder(company.email)
}

/** States whose cities are suggested first in the quote form's city fields (home region first). */
export const suggestionPriorityStates: string[] = ['Karnataka', 'Kerala', 'Goa', 'Maharashtra', 'Tamil Nadu']

export function hasAddress(): boolean {
  return company.officeAddress.trim() !== '' && !isPlaceholder(company.officeAddress)
}

export function hasSocial(url: string): boolean {
  return url.startsWith('http') && !url.includes('[')
}

export function siteOrigin(): string {
  if (company.websiteDomain.startsWith('http')) {
    return company.websiteDomain.replace(/\/$/, '')
  }
  return ''
}

/** tel: link from a display number, keeping only digits and a leading plus. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function hasGstin(): boolean {
  return /^\d{2}[A-Z0-9]{13}$/.test(company.gstin)
}

/** All configured phone numbers, falling back to the primary one. */
export function allPhones(): string[] {
  const list = company.phones.filter((phone) => !isPlaceholder(phone))
  return list.length > 0 ? list : hasPhone() ? [company.phone] : []
}
