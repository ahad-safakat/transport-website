import { describe, expect, it } from 'vitest'
import { findPlaces, findRoute, matchPlace } from './places'

describe('places', () => {
  it('understands misspelt routes', () => {
    const route = findRoute('from managlore to banaglore')
    expect(route?.pickup.city).toBe('Mangaluru')
    expect(route?.destination.city).toBe('Bengaluru')
  })

  it('matches a misspelt single city', () => {
    expect(matchPlace('chenai')?.city).toBe('Chennai')
    expect(matchPlace('mangalroe')?.city).toBe('Mangaluru')
  })

  it.each([
    'I need a truck please, what should I do?',
    'Do you transport cement and machinery between states?',
    'What documents are required for delivery?',
    'Tell me about your company and services',
  ])('finds no city in "%s"', (text) => {
    expect(findPlaces(text)).toEqual([])
  })
})
