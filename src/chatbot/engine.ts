import {
  allPhones,
  company,
  confirmedRegions,
  displayName,
  enabledServices,
  hasAddress,
  hasEmail,
  hasGstin,
  hasPhone,
  hasWhatsApp,
  services,
  telHref,
  vehicleTypes,
} from '../config/company'
import {
  aboutCopy,
  industriesCopy,
  partnerCopy,
  processSteps,
  whatsappDefaultMessage,
  whyCopy,
} from '../config/content'
import type { QuotePayload } from '../lib/quoteValidation'
import { findPlaces, findRoute, matchPlace, placeLabel, type Place } from './places'

/**
 * Scripted transportation assistant.
 * `handleChatInput` is a pure function (state + text in, state + replies out), so it can later be
 * swapped for a server-side AI call without changing the widget. Never answer with prices, ETAs,
 * availability, drivers, tracking, or unconfirmed routes. Company facts come from src/config only.
 */

export type ChatRole = 'assistant' | 'user'
export type QuickReply = { id: string; label: string }
/** A link button shown under a reply, e.g. "Open in Google Maps" or "Call". */
export type ChatLink = { href: string; label: string; external?: boolean }

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
  /** Optional WhatsApp click-to-chat message the visitor can review and open themselves. */
  whatsappMessage?: string
  /** Optional action to copy collected details into the quote form. */
  transferToForm?: QuoteDraft
  link?: ChatLink
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

export type EngineResult = {
  state: ChatState
  replies: string[]
  quickReplies: QuickReply[]
  whatsappMessage?: string
  transferToForm?: QuoteDraft
  link?: ChatLink
  /** True for free-text questions the AI assistant may answer instead; `replies` is then the offline fallback. */
  aiEligible?: boolean
}

export const defaultQuickReplies: QuickReply[] = [
  { id: 'quote', label: 'Get a Transportation Quote' },
  { id: 'services', label: 'Explore Our Services' },
  { id: 'routes', label: 'Check Serviceable Routes' },
  { id: 'whatsapp', label: 'Contact Us on WhatsApp' },
]

/** Follow-up topics offered after informational answers. Labels are matched by `interpretFreeText`. */
const topicReplies = {
  how: { id: 'how', label: 'How it works' },
  goods: { id: 'goods', label: 'Goods we move' },
  about: { id: 'about', label: 'About the company' },
  location: { id: 'location', label: 'Office location' },
  partner: { id: 'partner', label: 'Partner with us' },
  contact: { id: 'contact', label: 'Contact details' },
} satisfies Record<string, QuickReply>

/** Quote first, up to two related topics, WhatsApp last. */
function suggest(...topics: QuickReply[]): QuickReply[] {
  return [defaultQuickReplies[0], ...topics.slice(0, 2), defaultQuickReplies[3]]
}

const summaryReplies: QuickReply[] = [
  { id: 'whatsapp-summary', label: 'Continue on WhatsApp' },
  { id: 'cancel', label: 'Start over' },
]

const skipDateReply: QuickReply[] = [{ id: 'skip-date', label: 'Skip for now' }]

const vehicleReplies = (): QuickReply[] => vehicleTypes.map((vehicle) => ({ id: `vehicle:${vehicle.id}`, label: vehicle.label }))

export function createChatState(): ChatState {
  return { step: 'idle', draft: {} }
}

export function greetingText(): string {
  return `Hello! Welcome to ${displayName()}. Where would you like to transport your goods today?\n\nYou can type a route like “Mangaluru to Bengaluru”, or ask about our services, the goods we move, or how it works.`
}

let counter = 0
export function createMessage(role: ChatRole, text: string, extra?: Partial<ChatMessage>): ChatMessage {
  counter += 1
  return { id: `${Date.now()}-${counter}`, role, text, ...extra }
}

export function handleChatInput(state: ChatState, raw: string): EngineResult {
  const input = raw.trim()
  if (!input) {
    return {
      state,
      replies: ['Please type a short message, or choose one of the options below.'],
      quickReplies: state.step === 'idle' ? defaultQuickReplies : [],
    }
  }

  const key = normalize(input)

  if (state.step !== 'idle' && /\b(cancel|stop|restart|start over|reset)\b/.test(key)) {
    return {
      state: createChatState(),
      replies: ['No problem — I’ve cleared those details. How else can I help?'],
      quickReplies: defaultQuickReplies,
    }
  }

  if (state.step !== 'idle') {
    return handleQuoteFlow(state, input, key)
  }

  // Quick-reply labels and numeric shortcuts.
  if (key === '1' || key === 'get a transportation quote') return startQuote()
  if (key === '2' || key === 'explore our services') return serviceReply(state)
  if (key === '3' || key === 'check serviceable routes') return routeReply(state)
  if (key === '4' || key === 'contact us on whatsapp') return whatsappReply(state, whatsappDefaultMessage)

  const result = interpretFreeText(state, input, key)
  // Quote flows and WhatsApp hand-offs stay scripted so their details reach the form reliably.
  const scripted = result.state.step !== 'idle' || Boolean(result.whatsappMessage)
  return scripted ? result : { ...result, aiEligible: true }
}

function startQuote(): EngineResult {
  return {
    state: { step: 'quote-pickup', draft: {} },
    replies: ['Let’s gather a few details. What is the pickup city or location? (Type “cancel” at any time to stop.)'],
    quickReplies: [],
  }
}

/** Starts a quote with pickup and destination already filled in, asking for the vehicle next. */
function startQuoteWithRoute(pickup: Place, destination: Place, intro?: string): EngineResult {
  return {
    state: { step: 'quote-vehicle', draft: { pickupCity: pickup.city, deliveryCity: destination.city } },
    replies: [
      [
        intro,
        `Got it — ${placeLabel(pickup)} → ${placeLabel(destination)}. I’ll note this route for our team to confirm.`,
        'Which vehicle type do you need? If you are unsure, choose Other / Not Sure. (Type “cancel” at any time to stop.)',
      ]
        .filter(Boolean)
        .join('\n\n'),
    ],
    quickReplies: vehicleReplies(),
  }
}

/** Uses the listed spelling when the visitor typed a known city or alias (e.g. "mangalore" → "Mangaluru"). */
function cityName(input: string) {
  return (matchPlace(input)?.city ?? input).slice(0, 80)
}

function matchVehicle(key: string) {
  const exact =
    vehicleTypes.find((vehicle) => normalize(vehicle.label) === key) ||
    vehicleTypes.find((vehicle) => key.split(/\W+/).includes(vehicle.id))
  if (exact) return exact
  const byWords: [RegExp, string][] = [
    [/not sure|don.?t know|no idea|unsure|any/, 'other'],
    [/trailer|container|high.?capacity|multi.?axle|\b(14|16|18|22) ?wheel/, 'trailer'],
    [/heavy|full|ftl|\b(10|12) ?wheel|lorry|big/, 'hcv'],
    [/medium|\b6 ?wheel|407|eicher/, 'mcv'],
    [/light|small|tempo|pick.?up|mini|\b4 ?wheel|ace/, 'lcv'],
  ]
  const id = byWords.find(([pattern]) => pattern.test(key))?.[1]
  return vehicleTypes.find((vehicle) => vehicle.id === id)
}

function handleQuoteFlow(state: ChatState, input: string, key: string): EngineResult {
  switch (state.step) {
    case 'quote-pickup': {
      const route = findRoute(input)
      if (route) return startQuoteWithRoute(route.pickup, route.destination)
      return {
        state: { step: 'quote-destination', draft: { ...state.draft, pickupCity: cityName(input) } },
        replies: ['Where should the cargo be delivered?'],
        quickReplies: [],
      }
    }

    case 'quote-destination':
      return {
        state: { step: 'quote-vehicle', draft: { ...state.draft, deliveryCity: cityName(input) } },
        replies: ['Which vehicle type do you need? If you are unsure, choose Other / Not Sure.'],
        quickReplies: vehicleReplies(),
      }

    case 'quote-vehicle': {
      const match = matchVehicle(key)
      return {
        state: { step: 'quote-cargo', draft: { ...state.draft, vehicleType: match?.id ?? 'other' } },
        replies: [
          match
            ? 'Briefly describe the cargo and approximate weight if you know it (for example: 10 tonnes of cement bags, machinery parts, areca nut sacks).'
            : 'I’ve noted the vehicle as “Other / Not Sure” — our team will confirm a suitable option. Briefly describe the cargo.',
        ],
        quickReplies: [],
      }
    }

    case 'quote-cargo':
      return {
        state: { step: 'quote-date', draft: { ...state.draft, cargoDescription: input.slice(0, 500) } },
        replies: [
          [
            specialCargoPattern.test(key)
              ? 'Noted. This type of cargo is accepted only when our team separately confirms it, so please mention any handling needs when they contact you.'
              : null,
            'What is the preferred pickup date? Type it as DD/MM/YYYY, or skip.',
          ]
            .filter(Boolean)
            .join('\n\n'),
        ],
        quickReplies: skipDateReply,
      }

    case 'quote-date': {
      const skipped = key.includes('skip') || key === 'no' || key === 'not sure'
      const preferredPickupDate = skipped ? '' : parseDate(input)
      if (!skipped && !preferredPickupDate) {
        return {
          state,
          replies: ['Please enter the date as DD/MM/YYYY (for example 25/12/2026), or choose “Skip for now”.'],
          quickReplies: skipDateReply,
        }
      }
      if (preferredPickupDate && preferredPickupDate < todayStamp()) {
        return {
          state,
          replies: ['That date is in the past. Please enter an upcoming pickup date, or choose “Skip for now”.'],
          quickReplies: skipDateReply,
        }
      }
      const draft = { ...state.draft, preferredPickupDate }
      const vehicleLabel = vehicleTypes.find((item) => item.id === draft.vehicleType)?.label ?? 'To be confirmed'
      const summary = [
        'Here is what I have:',
        `Pickup: ${draft.pickupCity || '—'}`,
        `Destination: ${draft.deliveryCity || '—'}`,
        `Vehicle: ${vehicleLabel}`,
        `Cargo: ${draft.cargoDescription || '—'}`,
        `Preferred date: ${draft.preferredPickupDate ? formatDate(draft.preferredPickupDate) : 'Not specified'}`,
        '',
        'I can’t confirm price, availability, or a booking. How would you like to continue?',
      ].join('\n')
      return { state: { step: 'quote-summary', draft }, replies: [summary], quickReplies: summaryReplies }
    }

    case 'quote-summary':
      if (key.includes('whatsapp')) {
        return { ...whatsappReply(state, draftToWhatsApp(state.draft)), state: createChatState() }
      }
      return {
        state,
        replies: ['Choose “Continue on WhatsApp” to send these details, or “Start over”.'],
        quickReplies: summaryReplies,
      }

    default:
      return interpretFreeText(createChatState(), input, key)
  }
}

function whatsappReply(state: ChatState, message: string): EngineResult {
  if (!hasWhatsApp()) {
    return {
      state: { ...state, step: 'idle' },
      replies: ['WhatsApp is not configured on this website yet. Please use the quote form or the Contact section.'],
      quickReplies: defaultQuickReplies,
    }
  }
  return {
    state: { ...state, step: 'idle' },
    replies: ['Use the button below to open WhatsApp with a prefilled message. Review it there and send it yourself.'],
    quickReplies: defaultQuickReplies,
    whatsappMessage: message,
  }
}

function serviceReply(state: ChatState): EngineResult {
  const list = enabledServices.map((service) => `• ${service.title} — ${service.description}`).join('\n')
  return {
    state: { ...state, step: 'idle' },
    replies: [
      `We offer point-to-point transportation in these categories:\n${list}\n\nWe move goods from pickup to destination — we do not offer warehousing or storage. Specialised or regulated cargo is accepted only when separately confirmed.`,
    ],
    quickReplies: suggest(topicReplies.goods, topicReplies.how),
  }
}

function routeReply(state: ChatState, places: Place[] = []): EngineResult {
  const regions =
    confirmedRegions.length > 0
      ? `Our confirmed service regions:\n${confirmedRegions.map((region) => `• ${region.label}`).join('\n')}`
      : `Our office is on NH 66 in Mangaluru, Karnataka, and we arrange point-to-point transportation on routes our team can confirm. Coverage is not assumed for every city or corridor.`
  const asked = places.length > 0 ? `You asked about ${places.map(placeLabel).join(' and ')}. ` : ''
  return {
    state: { ...state, step: 'idle' },
    replies: [
      `${regions}\n\n${asked}I can’t confirm specific routes. Share your pickup and destination in a quote enquiry and the company team will confirm whether they can assist.`,
    ],
    quickReplies: suggest(topicReplies.how),
  }
}

function contactReply(state: ChatState): EngineResult {
  const lines = [
    hasPhone() ? `Phone: ${allPhones().join(', ')}` : null,
    hasEmail() ? `Email: ${company.email}` : null,
    hasAddress() ? `Office: ${company.officeAddress}` : null,
    hasWhatsApp() ? 'WhatsApp: choose “Contact Us on WhatsApp” below' : null,
  ].filter(Boolean)
  return {
    state,
    replies: [
      lines.length > 0
        ? `You can reach the team directly:\n${lines.join('\n')}\n\nThe Contact section on this page also has a general enquiry form.`
        : 'Direct contact details have not been published yet. Please use the quote form or the general enquiry form in the Contact section.',
    ],
    quickReplies: suggest(topicReplies.location),
    link: hasPhone() ? { href: telHref(company.phone), label: `Call ${company.phone}` } : undefined,
  }
}

function locationReply(state: ChatState): EngineResult {
  if (!hasAddress()) return contactReply(state)
  return {
    state,
    replies: [`Our office is at:\n${company.officeAddress}\n\nIt’s on NH 66 at Hosabettu, Mangaluru. Please call ahead before visiting.`],
    quickReplies: suggest(topicReplies.contact),
    link: company.mapsUrl ? { href: company.mapsUrl, label: 'Open in Google Maps', external: true } : undefined,
  }
}

function aboutReply(state: ChatState): EngineResult {
  const local = company.nameLocal ? ` (${company.nameLocal})` : ''
  return {
    state,
    replies: [
      `${displayName()}${local} — ${company.tagline}.\n\n${aboutCopy.intro}\n\n${aboutCopy.body}${
        hasGstin() ? `\n\nWe are GST registered (GSTIN ${company.gstin}).` : ''
      }`,
    ],
    quickReplies: suggest(topicReplies.how, topicReplies.goods),
  }
}

function processReply(state: ChatState): EngineResult {
  const steps = processSteps.map((step, index) => `${index + 1}. ${step.title} — ${step.text}`).join('\n')
  return {
    state,
    replies: [`Here’s how it works:\n${steps}\n\nSubmitting an enquiry does not assign a vehicle — transport begins only after quotation and confirmation.`],
    quickReplies: suggest(topicReplies.goods),
  }
}

function goodsReply(state: ChatState): EngineResult {
  const list = industriesCopy.items.map((item) => `• ${item.title}: ${item.text}`).join('\n')
  return {
    state,
    replies: [
      `We welcome enquiries from businesses across sectors, for example:\n${list}\n\nTell us what you are moving and our team will confirm a suitable vehicle. Specialised, regulated, or refrigerated cargo is accepted only when separately confirmed.`,
    ],
    quickReplies: suggest(topicReplies.how),
  }
}

function whyReply(state: ChatState): EngineResult {
  const list = whyCopy.items.map((item) => `• ${item.title} — ${item.text}`).join('\n')
  return {
    state,
    replies: [`Why businesses choose ${displayName()}:\n${list}`],
    quickReplies: suggest(topicReplies.about, topicReplies.how),
  }
}

const specialCargoPattern =
  /hazard|dangerous|chemical|acid|gas cylinder|explosive|inflammable|flammable|refrigerat|cold chain|frozen|perishable|reefer|odc|over.?dimension|over.?size|tanker|liquid|livestock|animal|valuable|gold|cash/

function interpretFreeText(state: ChatState, input: string, key: string): EngineResult {
  const reply = (replies: string[], quickReplies: QuickReply[] = defaultQuickReplies): EngineResult => ({
    state,
    replies,
    quickReplies,
  })
  const route = findRoute(input)

  if (/^(hi+|hello|hey|hai|hlo|helo|namaste|namaskara|namaskar|good (morning|afternoon|evening))\b/.test(key) && key.length < 30 && !route) {
    return reply([`Hello! I can help you start a transportation enquiry with ${displayName()}. Choose an option below, type a route like “Mangaluru to Bengaluru”, or ask a question.`])
  }
  if (/^(thanks?|thank you|thx|ty|ok(ay)? thanks?|great|perfect|super|nice)\b/.test(key) && key.length < 40) {
    return reply(['You’re welcome! Is there anything else I can help you with?'])
  }
  if (/^(bye|goodbye|see you|ok bye)\b/.test(key)) {
    return reply([`Thank you for visiting ${displayName()}. Reach out any time on the quote form, phone, or WhatsApp.`])
  }
  if (/\b(job|jobs|career|hiring|vacanc|work for you|driver job|recruit)/.test(key)) {
    return {
      ...contactReply(state),
      replies: ['No job openings are published on this website. Please contact the office directly to ask about opportunities.'],
    }
  }
  if (/availab|driver|track|price|pricing|cost|rate|charge|\beta\b|how long|delivery time|guarantee|how much|kitna|freight/.test(key)) {
    const disclaimer =
      'I can’t confirm prices, delivery times, vehicle availability, driver details, or live tracking. Our team shares pricing and availability after reviewing your enquiry.'
    if (route) return startQuoteWithRoute(route.pickup, route.destination, `${disclaimer} I can start an enquiry for this route so they can quote it.`)
    return reply([disclaimer], [defaultQuickReplies[0], defaultQuickReplies[3]])
  }
  if (route) return startQuoteWithRoute(route.pickup, route.destination)

  if (/are you (a )?(bot|robot|human|real|person|ai)|who am i talking/.test(key)) {
    return reply([`I’m an automated assistant for ${displayName()}, not a member of staff. A team member follows up on every enquiry.`])
  }
  if (key.includes('how') && /quote|quotation|request|book|enquir/.test(key) && !/goods|cargo/.test(key)) {
    return reply([
      'Fill in the Request a Quote form on this page, or I can collect the basics here and copy them into the form for you. Our team reviews every enquiry and contacts you with pricing and availability. Submitting an enquiry does not assign a truck.',
    ])
  }
  if (/how (it|does it|do you|does this|does the process) work|process|steps|procedure|what happens (after|next)|after (i )?submit/.test(key)) {
    return processReply(state)
  }
  if (/\bgst|gstin|registered|registration|legit|genuine/.test(key)) {
    return reply([
      hasGstin()
        ? `${displayName()} is GST registered. GSTIN: ${company.gstin}.`
        : 'Registration details have not been published on this website yet. Please contact the team directly.',
    ])
  }
  if (/what (is|does) (a )?(commission agent|transport contractor)|(agent|contractor)s? mean|do you (own|have) (your own )?(trucks|lorries|vehicles|fleet)|own fleet|fleet size|how many (trucks|lorries|vehicles)/.test(key)) {
    const agency = services.find((service) => service.id === 'transport-contracting')
    return reply(
      [
        `${displayName()} works as transport contractors and commission agents. ${agency?.description ?? ''}\n\nFleet size and vehicle ownership details are not published on this website — our team confirms the right vehicle for each enquiry.`,
      ],
      suggest(topicReplies.how, topicReplies.partner),
    )
  }
  if (/my (truck|lorry|vehicle)|attach|\bowner|partner|join|transport agent|become an agent|broker|commission|loads? for my/.test(key)) {
    return reply(
      [`${partnerCopy.intro}\n\nWe work with:\n${partnerCopy.points.map((point) => `• ${point}`).join('\n')}\n\nUse the “Partner with us” form on this page to share your vehicle and route details. ${partnerCopy.disclaimer}`],
      suggest(topicReplies.contact),
    )
  }
  if (/\b(house|home|household|office) ?(shift|move|moving|relocat)|packers|movers|relocation|bike transport|car transport|two.?wheeler/.test(key)) {
    return reply(
      ['We focus on commercial goods transportation for businesses. Household shifting and vehicle transport are not listed services — please contact the team directly to check whether they can help.'],
      suggest(topicReplies.goods, topicReplies.contact),
    )
  }
  if (/part.?load|\bptl\b|\bltl\b|small (load|consignment|quantity)|parcel|courier|shared (truck|vehicle|load)|few boxes/.test(key)) {
    return reply(
      ['Our listed services focus on full-vehicle movement. Smaller consignments or shared loads are arranged only when our team confirms them for the requested route — share the details in a quote enquiry and they’ll let you know.'],
      suggest(topicReplies.goods),
    )
  }
  if (specialCargoPattern.test(key)) {
    return reply(
      ['Specialised, regulated, refrigerated, or oversized cargo is accepted only when our team separately confirms it. Please describe the cargo and any handling needs in a quote enquiry, or call the team to discuss.'],
      suggest(topicReplies.contact),
    )
  }
  if (/\bpay|payment|invoice|bill\b|billing|advance|credit|insurance|insured|e.?way|documents?|paperwork|lorry receipt|\blr\b|\bpod\b|damage|claim/.test(key)) {
    return reply(
      ['Payment terms, invoicing, insurance, and documentation (such as e-way bills or lorry receipts) are not published on this website. They are discussed and agreed with our team when your transport is confirmed.'],
      suggest(topicReplies.how, topicReplies.contact),
    )
  }
  if (/timing|working hours|office hours|business hours|open (on|today|now)|when are you open|sunday|holiday/.test(key)) {
    return {
      ...contactReply(state),
      replies: ['Office hours are not published on this website. You can submit a quote enquiry any time, and our team will respond; for urgent needs, please call.'],
    }
  }
  if (/complain|problem|issue|delay|lost|urgent|emergency/.test(key)) {
    return {
      ...contactReply(state),
      replies: ['I’m sorry to hear that. I can’t look up shipments, so please call the team directly so they can help right away.'],
    }
  }
  if (/why (should|choose|you)|benefit|advantage|better than|trust|reliable|different/.test(key)) {
    return whyReply(state)
  }
  if (/mission|vision|values/.test(key)) {
    return reply(
      [`Mission: ${aboutCopy.mission.text}\n\nVision: ${aboutCopy.vision.text}\n\nValues:\n${aboutCopy.values.map((value) => `• ${value.title} — ${value.text}`).join('\n')}`],
      suggest(topicReplies.about),
    )
  }
  if (/about (you|your company|the company|the business|hindustan)|who are you|tell me about (you|your|the company|hindustan)|what is hindustan|your company|know more|what (kind of )?business/.test(key)) {
    return aboutReply(state)
  }
  if (/quote|quotation|book a truck|need a truck|need a lorry|transport (my |the )?goods|move (my |the )?goods|ship goods|send goods|\bbetween\b/.test(key)) {
    return startQuote()
  }
  if (/where (is|are) (your|the) office|office location|location|address|directions|map|visit (you|your|the office)/.test(key)) {
    return locationReply(state)
  }
  if (/goods we move|what (goods|cargo|items|materials|products|kind of (goods|cargo|load|material))|(can|do) you (carry|move|transport|handle|take|shift)|industr|sector|cement|steel|tiles|areca|arecanut|coconut|grain|rice|machinery|fmcg|timber|furniture|fertili|cashew|fish/.test(key)) {
    return goodsReply(state)
  }
  const places = findPlaces(input)
  if (places.length > 0 || /route|cities|city|serve|coverage|cover|state|where do you|deliver to|go to/.test(key)) {
    return routeReply(state, places)
  }
  if (/truck|vehicle|fleet|lorry|trailer|tempo|container/.test(key)) {
    const list = vehicleTypes.map((item) => `• ${item.label}`).join('\n')
    return reply([
      `You can request these vehicle categories:\n${list}\n\nThe right vehicle and its availability are confirmed only after our team reviews the enquiry.`,
    ])
  }
  if (/service|offer|what do you do|warehous|storage/.test(key)) {
    return serviceReply(state)
  }
  if (key.includes('whatsapp')) {
    return whatsappReply(state, whatsappDefaultMessage)
  }
  if (/contact|phone|call|number|email|mail|office|reach|talk|human|person|agent/.test(key)) {
    return contactReply(state)
  }

  return reply(
    [
      'I don’t have a verified answer for that — I’m an automated assistant, not a member of staff. Please use the quote form or contact the company team directly.\n\nI can help with services, goods we move, how it works, routes, our office location, or partnering with us.',
    ],
    suggest(topicReplies.about, topicReplies.how),
  )
}

function draftToWhatsApp(draft: QuoteDraft): string {
  const vehicle = vehicleTypes.find((item) => item.id === draft.vehicleType)?.label
  return [
    'Hello, I would like a transportation quotation.',
    draft.pickupCity ? `Pickup: ${draft.pickupCity}` : null,
    draft.deliveryCity ? `Destination: ${draft.deliveryCity}` : null,
    vehicle ? `Vehicle: ${vehicle}` : null,
    draft.cargoDescription ? `Cargo: ${draft.cargoDescription}` : null,
    draft.preferredPickupDate ? `Preferred pickup date: ${formatDate(draft.preferredPickupDate)}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

/** Accepts DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY or YYYY-MM-DD. Returns YYYY-MM-DD, or '' if invalid. */
export function parseDate(value: string): string {
  const text = value.trim()
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text)
  const dmy = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/.exec(text)
  let year: number
  let month: number
  let day: number
  if (iso) {
    year = Number(iso[1])
    month = Number(iso[2])
    day = Number(iso[3])
  } else if (dmy) {
    day = Number(dmy[1])
    month = Number(dmy[2])
    year = Number(dmy[3])
    if (year < 100) year += 2000
  } else {
    return ''
  }
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return ''
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

function todayStamp() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
