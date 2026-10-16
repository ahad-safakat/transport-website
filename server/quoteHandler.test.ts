import { afterEach, describe, expect, it, vi } from 'vitest'
import { processQuoteSubmission } from './quoteHandler.ts'
import { emptyQuote, type QuotePayload } from '../src/lib/quoteValidation.ts'

let ipCounter = 0
const nextIp = () => `10.0.0.${++ipCounter}`
const configured = { RESEND_API_KEY: 're_test', QUOTE_NOTIFICATION_EMAIL: 'ops@example.com' }

function validQuote(overrides: Partial<QuotePayload> = {}): QuotePayload {
  return {
    ...emptyQuote(),
    fullName: 'Asha Rao',
    mobile: '9876543210',
    pickupAddress: 'Plot 4, MIDC',
    pickupCity: 'Pune',
    pickupState: 'Maharashtra',
    deliveryAddress: 'Unit 9, SIPCOT',
    deliveryCity: 'Chennai',
    deliveryState: 'Tamil Nadu',
    preferredPickupDate: '2099-01-15',
    vehicleType: 'hcv',
    cargoDescription: 'Steel coils',
    cargoWeight: '18 tonnes',
    startedAt: Date.now() - 60_000,
    ...overrides,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('quote submissions', () => {
  it('rejects invalid input with field errors and does not call the email provider', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const result = await processQuoteSubmission(validQuote({ mobile: '123', preferredPickupDate: '2000-01-01' }), {
      ip: nextIp(),
      env: configured,
    })
    expect(result.status).toBe(400)
    expect(result.body.errors).toMatchObject({ mobile: expect.any(String), preferredPickupDate: expect.any(String) })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('reports EMAIL_NOT_CONFIGURED instead of a false success', async () => {
    const result = await processQuoteSubmission(validQuote(), { ip: nextIp(), env: {} })
    expect(result.status).toBe(503)
    expect(result.body).toMatchObject({ ok: false, code: 'EMAIL_NOT_CONFIGURED' })
  })

  it('reports provider failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('bad key', { status: 401 })))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const result = await processQuoteSubmission(validQuote(), { ip: nextIp(), env: configured })
    expect(result.body).toMatchObject({ ok: false, code: 'EMAIL_PROVIDER_ERROR' })
  })

  it('succeeds only after the provider accepts the email', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"id":"1"}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const result = await processQuoteSubmission(validQuote({ email: 'asha@example.com' }), { ip: nextIp(), env: configured })
    expect(result).toEqual({ status: 200, body: { ok: true } })
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent.to).toEqual(['ops@example.com'])
    expect(sent.reply_to).toBe('asha@example.com')
    expect(sent.subject).toContain('Pune → Chennai')
    expect(sent.text).toContain('Steel coils')
  })

  it('drops honeypot submissions silently without sending', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const result = await processQuoteSubmission(validQuote({ website: 'spam' }), { ip: nextIp(), env: configured })
    expect(result.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects submissions completed implausibly fast', async () => {
    const result = await processQuoteSubmission(validQuote({ startedAt: Date.now() }), { ip: nextIp(), env: configured })
    expect(result.status).toBe(400)
    expect(result.body.errors).toHaveProperty('startedAt')
  })

  it('rate-limits repeated submissions from one IP', async () => {
    const ip = nextIp()
    const statuses = []
    for (let i = 0; i < 7; i++) {
      statuses.push((await processQuoteSubmission(validQuote(), { ip, env: {} })).status)
    }
    expect(statuses.at(-1)).toBe(429)
  })
})

describe('partner submissions', () => {
  const partner = {
    kind: 'partner',
    fullName: 'Ramesh',
    mobile: '9876543210',
    partnerType: 'fleet-owner',
    vehicleType: 'hcv',
    vehicleCount: '4',
    baseCity: 'Udupi',
    routes: 'Udupi – Bengaluru',
    startedAt: Date.now() - 10_000,
  }

  it('validates partner type, mobile and base city', async () => {
    const result = await processQuoteSubmission(
      { ...partner, partnerType: 'x', mobile: '1', baseCity: '' },
      { ip: nextIp(), env: configured },
    )
    expect(result.status).toBe(400)
    expect(Object.keys(result.body.errors as object).sort()).toEqual(['baseCity', 'mobile', 'partnerType'])
  })

  it('emails a valid partner enquiry', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const result = await processQuoteSubmission(partner, { ip: nextIp(), env: configured })
    expect(result.body).toEqual({ ok: true })
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent.subject).toContain('Fleet owner')
    expect(sent.text).toContain('Number of vehicles: 4')
  })

  it('reports missing email configuration', async () => {
    const result = await processQuoteSubmission(partner, { ip: nextIp(), env: {} })
    expect(result.body).toMatchObject({ ok: false, code: 'EMAIL_NOT_CONFIGURED' })
  })
})

describe('contact submissions', () => {
  it('validates required fields', async () => {
    const result = await processQuoteSubmission(
      { kind: 'contact', fullName: '', mobile: '1', email: 'x', message: '', startedAt: Date.now() - 10_000 },
      { ip: nextIp(), env: configured },
    )
    expect(result.status).toBe(400)
    expect(Object.keys(result.body.errors as object).sort()).toEqual(['email', 'fullName', 'message', 'mobile'])
  })

  it('sends a valid message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })))
    const result = await processQuoteSubmission(
      { kind: 'contact', fullName: 'Ravi', mobile: '+91 98765 43210', email: '', message: 'Hello', startedAt: Date.now() - 10_000 },
      { ip: nextIp(), env: configured },
    )
    expect(result.body).toEqual({ ok: true })
  })
})
