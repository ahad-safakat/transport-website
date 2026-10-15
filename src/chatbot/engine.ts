import { confirmedRegions, displayName, enabledServices, vehicleTypes } from '../config/company'
import { whatsappDefaultMessage } from '../config/content'
import type { QuotePayload } from '../lib/quoteValidation'

export type ChatRole = 'assistant' | 'user'
export type QuickReply = { id: string; label: string }

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
}

export type QuoteDraft = Partial<
  Pick<QuotePayload, 'pickupCity' | 'deliveryCity' | 'vehicleType' | 'cargoDescription' | 'preferredPickupDate'>
>

export type ChatStep =
  | 'idle'
  | 'quote-pickup'
  | 'quote-destination'
  | 'quote-vehicle'
  | 'quote-cargo'
  | 'quote-date'
  | 'quote-summary'

export type ChatState = {
  step: ChatStep
  draft: QuoteDraft
}

export const defaultQuickReplies: QuickReply[] = [
  { id: 'quote', label: 'Get a Transportation Quote' },
  { id: 'services', label: 'Explore Our Services' },
  { id: 'routes', label: 'Check Serviceable Routes' },
  { id: 'whatsapp', label: 'Contact Us on WhatsApp' },
]

export function createChatState(): ChatState {
  return { step: 'idle', draft: {} }
}

export function greetingText(): string {
  return `Hello! Welcome to ${displayName()}. Where would you like to transport your goods today?`
}

type EngineResult = {
  state: ChatState
  replies: string[]
  quickReplies: QuickReply[]
  openWhatsApp?: boolean
  whatsappMessage?: string
  transferToForm?: QuoteDraft
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createMessage(role: ChatRole, text: string): ChatMessage {
  return { id: uid(), role, text }
}

export function handleChatInput(state: ChatState, raw: string): EngineResult {
  const input = raw.trim()
  if (!input) {
    return {
      state,
      replies: ['Please type a short message, or choose one of the options below.'],
      quickReplies: defaultQuickReplies,
    }
  }

  if (state.step.startsWith('quote-') || state.step === 'quote-summary') {
    return handleQuoteFlow(state, input)
  }

  const key = normalize(input)
  if (key.includes('quote') || key === '1' || key.includes('transportation quote')) {
    return startQuote(state)
  }
  if (key.includes('service') || key === '2') {
    return serviceReply(state)
  }
  if (key.includes('route') || key.includes('cit') || key === '3' || key.includes('cover')) {
    return routeReply(state)
  }
  if (key.includes('whatsapp') || key === '4' || key.includes('contact')) {
    return {
      state: { ...state, step: 'idle' },
      replies: ['You can continue this conversation on WhatsApp. Review the prefilled message before sending.'],
      quickReplies: defaultQuickReplies,
      openWhatsApp: true,
      whatsappMessage: whatsappDefaultMessage,
    }
  }

  return interpretFreeText(state, key)
}

function startQuote(state: ChatState): EngineResult {
  return {
    state: { ...state, step: 'quote-pickup', draft: {} },
    replies: ['Let’s gather a few details. What is the pickup city or location?'],
    quickReplies: [],
  }
}

function handleQuoteFlow(state: ChatState, input: string): EngineResult {
  const key = normalize(input)

  if (state.step === 'quote-summary') {
    if (key.includes('form') || key.includes('continue to quote')) {
      return {
        state: { ...state, step: 'idle' },
        replies: ['I’m opening the full quote form with these details for you to review and complete.'],
        quickReplies: defaultQuickReplies,
        transferToForm: state.draft,
      }
    }
    if (key.includes('whatsapp')) {
      return {
        state: { ...state, step: 'idle' },
        replies: ['A WhatsApp message with these details is ready. Please review it and send it yourself.'],
        quickReplies: defaultQuickReplies,
        openWhatsApp: true,
        whatsappMessage: draftToWhatsApp(state.draft),
      }
    }
    return {
      state,
      replies: ['Choose “Continue to Quote Form” or “Continue on WhatsApp”.'],
      quickReplies: summaryReplies,
    }
  }

  if (state.step === 'quote-pickup') {
    const next = { ...state, step: 'quote-destination' as const, draft: { ...state.draft, pickupCity: input } }
    return {
      state: next,
      replies: ['Where should the cargo be delivered?'],
      quickReplies: [],
    }
  }

  if (state.step === 'quote-destination') {
    const next = { ...state, step: 'quote-vehicle' as const, draft: { ...state.draft, deliveryCity: input } }
    return {
      state: next,
      replies: ['Which vehicle type do you need? If you are unsure, choose Other / Not Sure.'],
      quickReplies: vehicleTypes.map((vehicle) => ({ id: `vehicle:${vehicle.id}`, label: vehicle.label })),
    }
  }

  if (state.step === 'quote-vehicle') {
    const match =
      vehicleTypes.find((vehicle) => `vehicle:${vehicle.id}` === input) ||
      vehicleTypes.find((vehicle) => normalize(vehicle.label) === key) ||
      vehicleTypes.find((vehicle) => key.includes(vehicle.id))
    const vehicleType = match?.id ?? 'other'
    const next = { ...state, step: 'quote-cargo' as const, draft: { ...state.draft, vehicleType } }
    return {
      state: next,
      replies: ['Briefly describe the cargo.'],
      quickReplies: [],
    }
  }

  if (state.step === 'quote-cargo') {
    const next = { ...state, step: 'quote-date' as const, draft: { ...state.draft, cargoDescription: input } }
    return {
      state: next,
      replies: ['What is the preferred pickup date? You can type a date or skip.'],
      quickReplies: [{ id: 'skip-date', label: 'Skip for now' }],
    }
  }

  const preferredPickupDate = key === 'skip-date' || key.includes('skip') ? '' : input
  const draft = { ...state.draft, preferredPickupDate }
  const vehicleLabel = vehicleTypes.find((item) => item.id === draft.vehicleType)?.label ?? 'To be confirmed'
  const summary = [
    'Here is what I have:',
    `Pickup: ${draft.pickupCity || '—'}`,
    `Destination: ${draft.deliveryCity || '—'}`,
    `Vehicle: ${vehicleLabel}`,
    `Cargo: ${draft.cargoDescription || '—'}`,
    `Preferred date: ${draft.preferredPickupDate || 'Not specified'}`,
    '',
    'I cannot confirm price, availability, or a booking. Choose how you would like to continue.',
  ].join('\n')

  return {
    state: { step: 'quote-summary', draft },
    replies: [summary],
    quickReplies: summaryReplies,
  }
}

const summaryReplies: QuickReply[] = [
  { id: 'form', label: 'Continue to Quote Form' },
  { id: 'whatsapp', label: 'Continue on WhatsApp' },
]

function serviceReply(state: ChatState): EngineResult {
  const list = enabledServices.map((service) => `• ${service.title}`).join('\n')
  return {
    state: { ...state, step: 'idle' },
    replies: [
      `We offer point-to-point transportation in these categories:\n${list}\n\nWe do not advertise warehousing or storage. Specialised cargo is accepted only when separately confirmed.`,
    ],
    quickReplies: defaultQuickReplies,
  }
}

function routeReply(state: ChatState): EngineResult {
  const regions =
    confirmedRegions.length > 0
      ? confirmedRegions.map((region) => `• ${region.label}`).join('\n')
      : 'Confirmed regions have not been published on this website yet.'
  return {
    state: { ...state, step: 'idle' },
    replies: [
      `${regions}\n\nIf your route is not listed, our team needs to confirm it. Share pickup and destination in a quote enquiry.`,
    ],
    quickReplies: defaultQuickReplies,
  }
}

function interpretFreeText(state: ChatState, key: string): EngineResult {
  if (key.includes('truck') || key.includes('vehicle') || key.includes('fleet')) {
    const list = vehicleTypes.map((item) => `• ${item.label}`).join('\n')
    return {
      state,
      replies: [
        `You can request these vehicle categories:\n${list}\n\nAvailability is confirmed only after our team reviews the enquiry.`,
      ],
      quickReplies: defaultQuickReplies,
    }
  }
  if (key.includes('how') && (key.includes('quote') || key.includes('request') || key.includes('book'))) {
    return {
      state,
      replies: [
        'Use Request a Quote on this website, or start the quote conversation here. A team member reviews the details and contacts you. Submitting a form does not assign a truck.',
      ],
      quickReplies: defaultQuickReplies,
    }
  }
  if (key.includes('between') || key.includes('from') || key.includes('to ') || key.includes('transport goods')) {
    return startQuote(state)
  }
  if (key.includes('availab') || key.includes('driver') || key.includes('track') || key.includes('price') || key.includes('rate') || key.includes('eta')) {
    return {
      state,
      replies: [
        'I cannot confirm prices, delivery times, vehicle availability, driver details, or live tracking. Our team will discuss that after reviewing your enquiry.',
      ],
      quickReplies: defaultQuickReplies,
    }
  }
  if (key.includes('phone') || key.includes('email') || key.includes('address') || key.includes('reach')) {
    return {
      state,
      replies: ['Use the Contact section for published details, or continue on WhatsApp if a number is configured.'],
      quickReplies: defaultQuickReplies,
    }
  }

  return {
    state,
    replies: [
      'I don’t have a verified answer for that. I’m an automated assistant, not a person on shift. Please use the quote form or WhatsApp so the company team can help.',
    ],
    quickReplies: defaultQuickReplies,
  }
}

function draftToWhatsApp(draft: QuoteDraft): string {
  const vehicle = vehicleTypes.find((item) => item.id === draft.vehicleType)?.label
  return [
    'Hello, I would like a transportation quotation.',
    draft.pickupCity ? `Pickup: ${draft.pickupCity}` : null,
    draft.deliveryCity ? `Destination: ${draft.deliveryCity}` : null,
    vehicle ? `Vehicle: ${vehicle}` : null,
    draft.cargoDescription ? `Cargo: ${draft.cargoDescription}` : null,
    draft.preferredPickupDate ? `Preferred pickup date: ${draft.preferredPickupDate}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

function normalize(value: string) {
  return value.toLowerCase()
}
