import { describe, expect, it } from 'vitest'
import { company } from '../config/company'
import { buildWhatsAppUrl } from './whatsapp'
import { emptyQuote, isValidMobile, quoteToWhatsAppMessage, validateQuote } from './quoteValidation'

describe('WhatsApp links', () => {
  it('uses the configured number in wa.me format with an encoded message', () => {
    const url = buildWhatsAppUrl('Hello & welcome — 10% off? #1\nLine 2')
    expect(url).toBe(
      `https://wa.me/${company.whatsappNumber}?text=Hello%20%26%20welcome%20%E2%80%94%2010%25%20off%3F%20%231%0ALine%202`,
    )
    expect(company.whatsappNumber).toMatch(/^91\d{10}$/)
  })

  it('builds a quote message from form values', () => {
    const message = quoteToWhatsAppMessage({
      ...emptyQuote(),
      fullName: 'Asha',
      mobile: '9876543210',
      pickupCity: 'Pune',
      deliveryCity: 'Chennai',
      vehicleType: 'other',
    })
    expect(message).toContain('Vehicle: Other / Not Sure')
    expect(message).not.toContain('Company:')
  })
})

describe('form validation', () => {
  it.each([
    ['9876543210', true],
    ['+91 98765 43210', true],
    ['919876543210', true],
    ['5876543210', false],
    ['98765', false],
  ])('mobile %s → %s', (value, expected) => {
    expect(isValidMobile(value)).toBe(expected)
  })

  it('requires the core transport fields', () => {
    const errors = validateQuote(emptyQuote())
    expect(Object.keys(errors).sort()).toEqual(
      [
        'cargoDescription',
        'cargoWeight',
        'deliveryAddress',
        'deliveryCity',
        'deliveryState',
        'fullName',
        'mobile',
        'pickupAddress',
        'pickupCity',
        'pickupState',
        'preferredPickupDate',
        'vehicleType',
      ].sort(),
    )
  })
})
