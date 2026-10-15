export type ServiceCategory = {
  id: string
  title: string
  shortTitle: string
  description: string
  image: string
  imageAlt: string
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
  name: '[COMPANY NAME]',
  tagline: '[TAGLINE]',
  legalName: '[LEGAL ENTITY NAME]',
  headquarters: '[CITY, STATE, INDIA]',
  officeAddress: '[OFFICE ADDRESS]',
  /** Digits only with country code, no plus sign. Example: 9198XXXXXXXX */
  whatsappNumber: '917090134162',
  /** Display telephone, e.g. +91 98XXXXXXXX */
  phone: '',
  email: 'ahadsafakat@gmail.com',
  instagramUrl: '',
  linkedinUrl: '',
  /** Production origin without trailing slash, e.g. https://www.example.com */
  websiteDomain: '',
  logoSrc: '/logo.svg',
  faviconSrc: '/favicon.svg',
} as const

export const brand = {
  colors: {
    navy: '#0B1220',
    charcoal: '#151C28',
    white: '#FFFFFF',
    light: '#F4F6F8',
    accent: '#F28C28',
    slate: '#5B6778',
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
    imageAlt: 'Heavy-duty freight truck on an open highway',
    enabled: true,
  },
  {
    id: 'commercial-goods',
    title: 'Commercial Goods Transportation',
    shortTitle: 'Commercial Goods',
    description:
      'Point-to-point movement of commercial cargo for manufacturers, traders, and distributors.',
    image: '/images/service-commercial.jpg',
    imageAlt: 'Commercial freight truck travelling with cargo',
    enabled: true,
  },
  {
    id: 'intercity',
    title: 'Intercity Transportation',
    shortTitle: 'Intercity',
    description:
      'Coordinated cargo movement between cities, subject to confirmed routing and vehicle availability.',
    image: '/images/service-intercity.jpg',
    imageAlt: 'Freight truck on a long-distance highway journey',
    enabled: true,
  },
  {
    id: 'interstate',
    title: 'Interstate Transportation',
    shortTitle: 'Interstate',
    description:
      'Transportation of goods across state borders where the route can be confirmed by our team.',
    image: '/images/service-interstate.jpg',
    imageAlt: 'Long-haul truck travelling across an interstate highway',
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
