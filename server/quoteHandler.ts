import { enabledServices, vehicleTypes } from '../src/config/company.ts'
import {
  partnerTypes,
  validateContact,
  validatePartner,
  validateQuote,
  type ContactPayload,
  type PartnerPayload,
  type QuotePayload,
} from '../src/lib/quoteValidation.ts'

type JsonRecord = Record<string, unknown>

export type QuoteProcessResult = {
  status: number
  body: JsonRecord
}

const rateWindowMs = 10 * 60 * 1000
const rateLimit = 6
const hits = new Map<string, number[]>()

/** In-memory, per-instance limit. On serverless hosts each instance keeps its own window. */
function rateLimited(ip: string): boolean {
  const now = Date.now()
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= rateWindowMs)) hits.delete(key)
    }
  }
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
  // Strip control characters (keeping tab/newline) from user input before it is emailed.
  // oxlint-disable-next-line no-control-regex
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function sendEmail(subject: string, text: string, env: Record<string, string | undefined>, replyTo?: string) {
  const apiKey = env.RESEND_API_KEY
  const to = env.QUOTE_NOTIFICATION_EMAIL
  const from = env.QUOTE_FROM_EMAIL || 'Website Enquiries <onboarding@resend.dev>'

  if (!apiKey || !to) {
    return { ok: false as const, code: 'EMAIL_NOT_CONFIGURED' }
  }

  let response: Response
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: to.split(',').map((address) => address.trim()).filter(Boolean),
        subject: subject.replace(/[\r\n]+/g, ' '),
        text,
        ...(replyTo && emailPattern.test(replyTo) ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    })
  } catch (error) {
    console.error('Resend request failed', error)
    return { ok: false as const, code: 'EMAIL_PROVIDER_ERROR' }
  }

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

  if (kind === 'partner') {
    const partner: PartnerPayload = {
      fullName: sanitize(asString(record.fullName), 120),
      mobile: sanitize(asString(record.mobile), 20),
      partnerType: sanitize(asString(record.partnerType), 40),
      vehicleType: sanitize(asString(record.vehicleType), 40),
      vehicleCount: sanitize(asString(record.vehicleCount), 6),
      baseCity: sanitize(asString(record.baseCity), 80),
      routes: sanitize(asString(record.routes), 500),
      website: asString(record.website),
      startedAt: asNumber(record.startedAt),
    }
    if (partner.website.trim()) {
      return { status: 200, body: { ok: true } }
    }
    const partnerErrors = validatePartner(partner, { server: true })
    if (Object.keys(partnerErrors).length > 0) {
      return { status: 400, body: { ok: false, error: 'Please correct the highlighted fields.', errors: partnerErrors } }
    }
    const typeLabel = partnerTypes.find((type) => type.id === partner.partnerType)?.label ?? partner.partnerType
    const vehicleLabel = vehicleTypes.find((type) => type.id === partner.vehicleType)?.label ?? '—'
    const sent = await sendEmail(
      `Partner enquiry: ${typeLabel} — ${partner.fullName} (${partner.baseCity})`,
      [
        'New vehicle owner / agent partnership enquiry',
        '',
        `Name: ${partner.fullName}`,
        `Mobile: ${partner.mobile}`,
        `Partner type: ${typeLabel}`,
        `Vehicle type: ${vehicleLabel}`,
        `Number of vehicles: ${partner.vehicleCount || '—'}`,
        `Base city: ${partner.baseCity}`,
        `Usual routes: ${partner.routes || '—'}`,
      ].join('\n'),
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
              ? 'Email delivery is not configured yet. Please call or WhatsApp us instead.'
              : 'The email provider could not accept this enquiry. Please call or WhatsApp us instead.',
        },
      }
    }
    return { status: 200, body: { ok: true } }
  }

  if (kind === 'contact') {
    const contact: ContactPayload = {
      fullName: sanitize(asString(record.fullName), 120),
      mobile: sanitize(asString(record.mobile), 20),
      email: sanitize(asString(record.email), 160),
      message: sanitize(asString(record.message), 1000),
      website: asString(record.website),
      startedAt: asNumber(record.startedAt),
    }
    // Honeypot filled: accept silently so bots get no signal, but send nothing.
    if (contact.website.trim()) {
      return { status: 200, body: { ok: true } }
    }
    const contactErrors = validateContact(contact, { server: true })
    if (Object.keys(contactErrors).length > 0) {
      return { status: 400, body: { ok: false, error: 'Please correct the highlighted fields.', errors: contactErrors } }
    }
    const sent = await sendEmail(
      `Website contact from ${contact.fullName}`,
      `Name: ${contact.fullName}\nMobile: ${contact.mobile}\nEmail: ${contact.email || '—'}\n\n${contact.message}`,
      meta.env,
      contact.email,
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

  const sent = await sendEmail(
    `Transportation enquiry: ${payload.pickupCity} → ${payload.deliveryCity} (${payload.fullName})`,
    quoteEmail(payload),
    meta.env,
    payload.email,
  )
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
  let size = 0
  for await (const chunk of req) {
    const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    size += buffer.length
    if (size > 32 * 1024) throw new Error('Request body too large')
    chunks.push(buffer)
  }
  const text = Buffer.concat(chunks).toString('utf8')
  if (!text) return {}
  return JSON.parse(text) as unknown
}
