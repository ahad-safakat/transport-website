import { describe, expect, it } from 'vitest'
import { allCities, citiesByState, stateForCity } from './indianCities'
import { indianStates } from './indianStates'

describe('indian city suggestions', () => {
  it('has cities for every state and union territory', () => {
    for (const state of indianStates) {
      expect(citiesByState[state].length, state).toBeGreaterThan(0)
    }
  })

  it('has no duplicate city within a state', () => {
    for (const [state, cities] of Object.entries(citiesByState)) {
      expect(new Set(cities).size, state).toBe(cities.length)
    }
  })

  it('detects the state for an unambiguous city, ignoring case and spaces', () => {
    expect(stateForCity('mangaluru')).toBe('Karnataka')
    expect(stateForCity('  Panaji ')).toBe('Goa')
    expect(stateForCity('Kochi')).toBe('Kerala')
  })

  it('does not guess when a city name exists in two states or is unknown', () => {
    expect(allCities.filter((item) => item.city === 'Udaipur')).toHaveLength(2)
    expect(stateForCity('Udaipur')).toBeNull()
    expect(stateForCity('Somewhere Small')).toBeNull()
    expect(stateForCity('')).toBeNull()
  })
})
