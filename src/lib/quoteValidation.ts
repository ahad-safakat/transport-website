import { vehicleTypes } from '../config/company.ts'

export type QuotePayload = {
  fullName: string
  companyName: string
  mobile: string
  email: string
  pickupAddress: string
  pickupCity: string
  pickupState: string
  deliveryAddress: string
  deliveryCity: string
  deliveryState: string
  preferredPickupDate: string
  vehicleType: string
  cargoDescription: string
  cargoWeight: string
  additionalRequirements: string
  serviceId: string
  website: string
  startedAt: number
}

export type QuoteErrors = Partial<Record<keyof QuotePayload, string>>

export const emptyQuote = (): QuotePayload => ({
  fullName: '',
  companyName: '',
  mobile: '',
  email: '',
  pickupAddress: '',
  pickupCity: '',
  pickupState: '',
  deliveryAddress: '',
  deliveryCity: '',
  deliveryState: '',
  preferredPickupDate: '',
  vehicleType: '',
  cargoDescription: '',
  cargoWeight: '',
  additionalRequirements: '',
  serviceId: '',
  website: '',
  startedAt: Date.now(),
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeMobile(value: string): string {
  return value.replace(/[^\d]/g, '')
}

export function isValidMobile(value: string): boolean {
  const digits = normalizeMobile(value)
  if (/^91\d{10}$/.test(digits)) return true
  if (/^[6-9]\d{9}$/.test(digits)) return true
  return false
}

function todayStamp(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function required(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label} is required.`
  return undefined
}

export function validateQuote(payload: QuotePayload, options?: { server?: boolean }): QuoteErrors {
  const errors: QuoteErrors = {}
  const vehicleIds = vehicleTypes.map((item) => item.id)

  const nameError = required(payload.fullName, 'Full name')
  if (nameError) errors.fullName = nameError

  if (!isValidMobile(payload.mobile)) {
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.'
  }

  if (payload.email.trim() && !emailPattern.test(payload.email.trim())) {
    errors.email = 'Enter a valid email address or leave this field blank.'
  }

  const pickupAddress = required(payload.pickupAddress, 'Pickup address')
  if (pickupAddress) errors.pickupAddress = pickupAddress
  const pickupCity = required(payload.pickupCity, 'Pickup city')
  if (pickupCity) errors.pickupCity = pickupCity
  const pickupState = required(payload.pickupState, 'Pickup state')
  if (pickupState) errors.pickupState = pickupState

  const deliveryAddress = required(payload.deliveryAddress, 'Delivery address')
  if (deliveryAddress) errors.deliveryAddress = deliveryAddress
  const deliveryCity = required(payload.deliveryCity, 'Delivery city')
  if (deliveryCity) errors.deliveryCity = deliveryCity
  const deliveryState = required(payload.deliveryState, 'Delivery state')
  if (deliveryState) errors.deliveryState = deliveryState

  if (!payload.preferredPickupDate) {
    errors.preferredPickupDate = 'Preferred pickup date is required.'
  } else if (payload.preferredPickupDate < todayStamp()) {
    errors.preferredPickupDate = 'Pickup date cannot be in the past.'
  }

  if (!payload.vehicleType || !vehicleIds.includes(payload.vehicleType)) {
    errors.vehicleType = 'Select a vehicle type.'
  }

  const cargo = required(payload.cargoDescription, 'Cargo description')
  if (cargo) errors.cargoDescription = cargo

  const weight = required(payload.cargoWeight, 'Approximate cargo weight')
  if (weight) errors.cargoWeight = weight

  if (options?.server) {
    if (payload.website.trim()) {
      errors.website = 'Rejected.'
    }
    if (!payload.startedAt || Date.now() - payload.startedAt < 2000) {
      errors.startedAt = 'Please take a moment to review your details before submitting.'
    }
  }

  return errors
}

export function quoteToWhatsAppMessage(payload: QuotePayload): string {
  const vehicle = vehicleTypes.find((item) => item.id === payload.vehicleType)?.label ?? payload.vehicleType
  return [
    'Hello, I would like a transportation quotation.',
    '',
    `Name: ${payload.fullName}`,
    payload.companyName ? `Company: ${payload.companyName}` : null,
    `Mobile: ${payload.mobile}`,
    payload.email ? `Email: ${payload.email}` : null,
    `Pickup: ${payload.pickupAddress}, ${payload.pickupCity}, ${payload.pickupState}`,
    `Delivery: ${payload.deliveryAddress}, ${payload.deliveryCity}, ${payload.deliveryState}`,
    `Preferred pickup date: ${payload.preferredPickupDate}`,
    `Vehicle: ${vehicle}`,
    `Cargo: ${payload.cargoDescription}`,
    `Approximate weight: ${payload.cargoWeight}`,
    payload.additionalRequirements ? `Additional requirements: ${payload.additionalRequirements}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}
