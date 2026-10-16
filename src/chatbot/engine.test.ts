import { describe, expect, it } from 'vitest'
import { createChatState, handleChatInput, parseDate, type ChatState } from './engine'

function run(inputs: string[], start: ChatState = createChatState()) {
  let state = start
  let last = handleChatInput(state, inputs[0])
  state = last.state
  for (const input of inputs.slice(1)) {
    last = handleChatInput(state, input)
    state = last.state
  }
  return last
}

const reply = (text: string) => handleChatInput(createChatState(), text).replies.join('\n')

describe('chatbot quick replies', () => {
  it('routes "Check Serviceable Routes" to routes, not services', () => {
    expect(reply('Check Serviceable Routes')).toMatch(/confirm/i)
    expect(reply('Check Serviceable Routes')).not.toMatch(/categories/)
  })

  it('lists configured services', () => {
    expect(reply('Explore Our Services')).toMatch(/Full Truckload Transportation/)
    expect(reply('Explore Our Services')).not.toMatch(/Part-Load/) // disabled in config
  })

  it('offers a WhatsApp link without opening it automatically', () => {
    const result = handleChatInput(createChatState(), 'Contact Us on WhatsApp')
    expect(result.whatsappMessage).toMatch(/enquire about your transportation services/)
  })
})

describe('chatbot free text', () => {
  it.each([
    ['What services do you offer?', /categories/],
    ['How do I request a quote?', /Request a Quote form/],
    ['Which cities do you serve?', /team will confirm/],
    ['What truck types can I request?', /vehicle categories/],
    ['How can I contact the company?', /reach the team|not been published/],
    ['Can you confirm vehicle availability?', /can’t confirm/],
    ['What is the price from Delhi to Mumbai?', /can’t confirm/],
    ['Can I track my truck live?', /can’t confirm/],
    ['What is the meaning of life?', /automated assistant, not a member of staff/],
    ['What is your GST number?', /29ELBPR2283E1ZX/],
    ['I own a lorry, can I attach my truck?', /Partner with us/],
    ['Can I talk to an agent?', /reach the team/],
    ['Where is your office?', /Hosabettu, Mangaluru/],
  ])('%s', (input, expected) => {
    expect(reply(input)).toMatch(expected)
  })

  it('starts a quote for "How do I transport goods between two cities?"', () => {
    const result = handleChatInput(createChatState(), 'How do I transport goods between two cities?')
    expect(result.state.step).toBe('quote-pickup')
  })

  it('does not start a quote just because a message contains "to"', () => {
    expect(handleChatInput(createChatState(), 'I want to know more').state.step).toBe('idle')
  })

  it('rejects empty input', () => {
    expect(reply('   ')).toMatch(/type a short message/)
  })
})

describe('chatbot quote flow', () => {
  it('collects details and transfers them to the form', () => {
    const summary = run(['Get a Transportation Quote', 'Pune', 'Chennai', 'Heavy commercial / full truckload', 'Steel coils', '25/12/2099'])
    expect(summary.state.step).toBe('quote-summary')
    expect(summary.replies[0]).toMatch(/Pune[\s\S]*Chennai[\s\S]*Steel coils[\s\S]*25\/12\/2099/)

    const transfer = handleChatInput(summary.state, 'Continue to Quote Form')
    expect(transfer.transferToForm).toEqual({
      pickupCity: 'Pune',
      deliveryCity: 'Chennai',
      vehicleType: 'hcv',
      cargoDescription: 'Steel coils',
      preferredPickupDate: '2099-12-25',
    })
    expect(transfer.state.step).toBe('idle')
  })

  it('prepares a WhatsApp message from the collected details', () => {
    const summary = run(['1', 'Surat', 'Jaipur', 'not sure', 'Textiles', 'skip'])
    const result = handleChatInput(summary.state, 'Continue on WhatsApp')
    expect(result.whatsappMessage).toContain('Pickup: Surat')
    expect(result.whatsappMessage).toContain('Vehicle: Other / Not Sure')
    expect(result.whatsappMessage).not.toContain('Preferred pickup date')
  })

  it('re-asks on invalid or past dates', () => {
    const atDate = run(['1', 'A', 'B', 'lcv', 'Boxes'])
    expect(handleChatInput(atDate.state, 'tomorrow').state.step).toBe('quote-date')
    expect(handleChatInput(atDate.state, '01/01/2000').replies[0]).toMatch(/in the past/)
  })

  it('can be cancelled', () => {
    const mid = run(['1', 'Pune'])
    const cancelled = handleChatInput(mid.state, 'cancel')
    expect(cancelled.state).toEqual(createChatState())
  })
})

describe('chatbot knowledge', () => {
  it.each([
    ['How does it work?', /Share your requirements/],
    ['What goods do you carry?', /Building materials/],
    ['Can you move areca nut?', /Agricultural produce/],
    ['Tell me about the company', /commission agents/],
    ['Do you have your own trucks?', /not published/],
    ['Do you transport chemicals?', /separately confirms/],
    ['Do you do house shifting?', /Household shifting/],
    ['I have a small parcel', /Smaller consignments/],
    ['Do you provide insurance?', /not published/],
    ['Why should I choose you?', /One point of contact/],
    ['Do you go to Kochi?', /Kochi, Kerala/],
    ['thanks', /welcome/],
  ])('%s', (input, expected) => {
    expect(reply(input)).toMatch(expected)
  })

  it('links the office location to Google Maps', () => {
    expect(handleChatInput(createChatState(), 'Office location').link?.href).toMatch(/maps\.app\.goo\.gl/)
  })
})

describe('chatbot route detection', () => {
  it('starts a quote with both cities filled from "Mangalore to Bangalore"', () => {
    const result = handleChatInput(createChatState(), 'need a truck from mangalore to bangalore')
    expect(result.state.step).toBe('quote-vehicle')
    expect(result.state.draft).toEqual({ pickupCity: 'Mangaluru', deliveryCity: 'Bengaluru' })
  })

  it('reads "to X from Y" the right way round', () => {
    const result = handleChatInput(createChatState(), 'deliver to Udupi from Hubli')
    expect(result.state.draft).toEqual({ pickupCity: 'Hubballi', deliveryCity: 'Udupi' })
  })

  it('accepts a route typed at the pickup question', () => {
    const result = run(['1', 'Pune to Chennai'])
    expect(result.state.step).toBe('quote-vehicle')
    expect(result.state.draft.deliveryCity).toBe('Chennai')
  })

  it('understands everyday vehicle words', () => {
    const result = run(['1', 'Mangaluru', 'Kochi', 'tempo'])
    expect(result.state.draft.vehicleType).toBe('lcv')
  })
})

describe('parseDate', () => {
  it.each([
    ['25/12/2026', '2026-12-25'],
    ['5-1-2027', '2027-01-05'],
    ['2026-12-25', '2026-12-25'],
    ['31/02/2026', ''],
    ['next week', ''],
  ])('%s → %s', (input, expected) => {
    expect(parseDate(input)).toBe(expected)
  })
})

describe('AI hand-off', () => {
  it('lets the AI answer free-text questions', () => {
    expect(handleChatInput(createChatState(), 'What is the meaning of life?').aiEligible).toBe(true)
  })

  it('keeps quotes, routes and WhatsApp scripted', () => {
    expect(handleChatInput(createChatState(), 'need a truck from Pune to Chennai').aiEligible).toBeUndefined()
    expect(handleChatInput(createChatState(), 'How do I transport goods between two cities?').aiEligible).toBeUndefined()
    expect(handleChatInput(createChatState(), 'whatsapp').aiEligible).toBeUndefined()
    expect(handleChatInput(createChatState(), 'Get a Transportation Quote').aiEligible).toBeUndefined()
  })
})
