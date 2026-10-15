import { enabledServices, vehicleTypes } from '../src/config/company.ts'
import { isValidMobile, validateQuote, type QuotePayload } from '../src/lib/quoteValidation.ts'

type JsonRecord = Record<string, unknown>

export type QuoteProcessResult = {
  status: number
  body: JsonRecord
}

const rateWindowMs = 10 * 60 * 1000
const rateLimit = 6
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < rateWindowMs)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > rateLimit
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function sanitize(value: string, max = 500): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max)
}

function parseQuote(raw: JsonRecord): QuotePayload {
  return {
    fullName: sanitize(asString(raw.fullName), 120),
    companyName: sanitize(asString(raw.companyName), 160),
    mobile: sanitize(asString(raw.mobile), 20),
    email: sanitize(asString(raw.email), 160),
    pickupAddress: sanitize(asString(raw.pickupAddress), 240),
    pickupCity: sanitize(asString(raw.pickupCity), 80),
    pickupState: sanitize(asString(raw.pickupState), 80),
    deliveryAddress: sanitize(asString(raw.deliveryAddress), 240),
    deliveryCity: sanitize(asString(raw.deliveryCity), 80),
    deliveryState: sanitize(asString(raw.deliveryState), 80),
    preferredPickupDate: sanitize(asString(raw.preferredPickupDate), 20),
    vehicleType: sanitize(asString(raw.vehicleType), 40),
    cargoDescription: sanitize(asString(raw.cargoDescription), 1000),
    cargoWeight: sanitize(asString(raw.cargoWeight), 80),
    additionalRequirements: sanitize(asString(raw.additionalRequirements), 1000),
    serviceId: sanitize(asString(raw.serviceId), 60),
    website: asString(raw.website),
    startedAt: asNumber(raw.startedAt),
  }
}

async function sendEmail(subject: string, text: string, env: Record<string, string | undefined>) {
  const apiKey = env.RESEND_API_KEY
  const to = env.QUOTE_NOTIFICATION_EMAIL
  const from = env.QUOTE_FROM_EMAIL || 'Website Enquiries <onboarding@resend.dev>'

  if (!apiKey || !to) {
    return { ok: false as const, code: 'EMAIL_NOT_CONFIGURED' }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, text }),
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error('Resend error', response.status, detail)
    return { ok: false as const, code: 'EMAIL_PROVIDER_ERROR' }
  }

  return { ok: true as const }
}

function quoteEmail(payload: QuotePayload): string {
  const vehicle = vehicleTypes.find((item) => item.id === payload.vehicleType)?.label ?? payload.vehicleType
  const service = enabledServices.find((item) => item.id === payload.serviceId)?.title ?? payload.serviceId
  return [
    'New transportation enquiry',
    '',
    `Name: ${payload.fullName}`,
    `Company: ${payload.companyName || '—'}`,
    `Mobile: ${payload.mobile}`,
    `Email: ${payload.email || '—'}`,
    `Pickup: ${payload.pickupAddress}, ${payload.pickupCity}, ${payload.pickupState}`,
    `Delivery: ${payload.deliveryAddress}, ${payload.deliveryCity}, ${payload.deliveryState}`,
    `Preferred pickup date: ${payload.preferredPickupDate}`,
    `Vehicle: ${vehicle}`,
    `Service: ${service || 'General'}`,
    `Cargo: ${payload.cargoDescription}`,
    `Weight: ${payload.cargoWeight}`,
    `Additional: ${payload.additionalRequirements || '—'}`,
  ].join('\n')
}

export async function processQuoteSubmission(
  raw: unknown,
  meta: { ip: string; env: Record<string, string | undefined> },
): Promise<QuoteProcessResult> {
  if (rateLimited(meta.ip || 'unknown')) {
    return { status: 429, body: { ok: false, error: 'Too many enquiries from this network. Please wait and try again.' } }
  }

  if (!raw || typeof raw !== 'object') {
    return { status: 400, body: { ok: false, error: 'Invalid enquiry payload.' } }
  }

  const record = raw as JsonRecord
  const kind = asString(record.kind) || 'quote'

  if (kind === 'contact') {
    const name = sanitize(asString(record.fullName), 120)
    const mobile = sanitize(asString(record.mobile), 20)
    const email = sanitize(asString(record.email), 160)
    const message = sanitize(asString(record.cargoDescription), 1000)
    const website = asString(record.website)
    if (website.trim()) {
      return { status: 200, body: { ok: true } }
    }
    if (!name || !isValidMobile(mobile) || !message) {
      return { status: 400, body: { ok: false, error: 'Name, a valid mobile number, and a message are required.' } }
    }
    const sent = await sendEmail(
      `Website contact from ${name}`,
      `Name: ${name}\nMobile: ${mobile}\nEmail: ${email || '—'}\n\n${message}`,
      meta.env,
    )
    if (!sent.ok) {
      return {
        status: 503,
        body: {
          ok: false,
          code: sent.code,
          error:
            sent.code === 'EMAIL_NOT_CONFIGURED'
              ? 'Email delivery is not configured yet. Please use WhatsApp or telephone.'
              : 'The email provider rejected this enquiry. Please try WhatsApp.',
        },
      }
    }
    return { status: 200, body: { ok: true } }
  }

  const payload = parseQuote(record)
  if (payload.website.trim()) {
    return { status: 200, body: { ok: true } }
  }

  const errors = validateQuote(payload, { server: true })
  if (Object.keys(errors).length > 0) {
    return { status: 400, body: { ok: false, error: 'Please correct the highlighted fields.', errors } }
  }

  const sent = await sendEmail(`Transportation enquiry from ${payload.fullName}`, quoteEmail(payload), meta.env)
  if (!sent.ok) {
    return {
      status: 503,
      body: {
        ok: false,
        code: sent.code,
        error:
          sent.code === 'EMAIL_NOT_CONFIGURED'
            ? 'Email delivery is not configured yet. Your details remain on the form — continue on WhatsApp or try again after configuration.'
            : 'The email provider could not accept this enquiry. Your details remain on the form.',
      },
    }
  }

  return { status: 200, body: { ok: true } }
}

export async function readJsonBody(req: { [Symbol.asyncIterator](): AsyncIterator<Buffer | string> }): Promise<unknown> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  const text = Buffer.concat(chunks).toString('utf8')
  if (!text) return {}
  return JSON.parse(text) as unknown
}
