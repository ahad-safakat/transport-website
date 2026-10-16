import { allCities } from '../data/indianCities'

export type Place = { city: string; state: string | null }

/** Older or common spellings people type, mapped to the names used in src/data/indianCities.ts. */
const aliases: Record<string, string> = {
  mangalore: 'Mangaluru',
  bangalore: 'Bengaluru',
  bengalore: 'Bengaluru',
  mysore: 'Mysuru',
  bombay: 'Mumbai',
  madras: 'Chennai',
  calcutta: 'Kolkata',
  cochin: 'Kochi',
  trivandrum: 'Thiruvananthapuram',
  calicut: 'Kozhikode',
  hubli: 'Hubballi',
  belgaum: 'Belagavi',
  gulbarga: 'Kalaburagi',
  shimoga: 'Shivamogga',
  gurgaon: 'Gurugram',
  baroda: 'Vadodara',
  pondicherry: 'Puducherry',
  panjim: 'Panaji',
  madgaon: 'Margao',
  vasco: 'Vasco da Gama',
}

/** City names that are also everyday English words, so they are never treated as places on their own. */
const ignored = new Set(['along'])

type Entry = { name: string; place: Place }

let entries: Entry[] | null = null

function getEntries(): Entry[] {
  if (entries) return entries
  const byName = new Map<string, Place>()
  for (const { city, state } of allCities) {
    const key = city.toLowerCase()
    if (ignored.has(key)) continue
    const existing = byName.get(key)
    // The same town name in two states: keep the city but leave the state unknown.
    byName.set(key, existing ? { city, state: existing.state === state ? state : null } : { city, state })
  }
  for (const [alias, city] of Object.entries(aliases)) {
    const place = byName.get(city.toLowerCase())
    if (place) byName.set(alias, place)
  }
  // Longest first, so "New Delhi" wins over "Delhi".
  entries = [...byName.entries()].map(([name, place]) => ({ name, place })).sort((a, b) => b.name.length - a.name.length)
  return entries
}

/** Edit distance where swapping two neighbouring letters counts as one edit ("managlore" → "mangalore"). */
function editDistance(a: string, b: string): number {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) rows[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1)
    }
  }
  return rows[a.length][b.length]
}

/**
 * The one listed single-word city a misspelt word is closest to, e.g. "banaglore" → Bengaluru.
 * Only words of 6+ letters are tried, allowing 1 typo (2 for 9+ letters); ties are rejected.
 */
function closestPlace(word: string): Place | null {
  if (word.length < 6) return null
  const allowed = word.length >= 9 ? 2 : 1
  let best: Entry | null = null
  let bestDistance = allowed + 1
  let tie = false
  for (const entry of getEntries()) {
    if (entry.name.includes(' ') || Math.abs(entry.name.length - word.length) > allowed) continue
    const distance = editDistance(word, entry.name)
    if (distance < bestDistance) {
      best = entry
      bestDistance = distance
      tie = false
    } else if (distance === bestDistance && best && best.place.city !== entry.place.city) {
      tie = true
    }
  }
  return best && !tie ? best.place : null
}

/** Every listed city mentioned in the text (allowing small typos), in the order it appears. */
export function findPlaces(text: string): Place[] {
  const lower = ` ${text.toLowerCase().replace(/[^a-z\s]/g, ' ')} `
  const taken: [number, number][] = []
  const found: { index: number; place: Place }[] = []
  addExactMatches(lower, taken, found)
  const words = /[a-z]+/g
  for (let match = words.exec(lower); match; match = words.exec(lower)) {
    const span: [number, number] = [match.index, match.index + match[0].length]
    if (taken.some(([start, end]) => span[0] < end && start < span[1])) continue
    const place = closestPlace(match[0])
    if (place) found.push({ index: match.index - 1, place })
  }
  return found.sort((a, b) => a.index - b.index).map((item) => item.place)
}

function addExactMatches(lower: string, taken: [number, number][], found: { index: number; place: Place }[]) {
  for (const { name, place } of getEntries()) {
    let from = 0
    for (;;) {
      const index = lower.indexOf(` ${name} `, from)
      if (index === -1) break
      const span: [number, number] = [index + 1, index + 1 + name.length]
      from = index + 1
      if (taken.some(([start, end]) => span[0] < end && start < span[1])) continue
      taken.push(span)
      found.push({ index, place })
    }
  }
}

/** The listed city when the whole text is one place name, a known alias, or a close misspelling; else null. */
export function matchPlace(text: string): Place | null {
  const key = text.trim().toLowerCase().replace(/\s+/g, ' ')
  return getEntries().find((entry) => entry.name === key)?.place ?? (/^[a-z]+$/.test(key) ? closestPlace(key) : null)
}

/**
 * Pickup and destination from messages like "Mangalore to Bangalore", "from Pune to Chennai"
 * or "to Kochi from Udupi". Needs two listed cities and a route word between them.
 */
export function findRoute(text: string): { pickup: Place; destination: Place } | null {
  const lower = text.toLowerCase()
  if (!/\bto\b|\bfrom\b|\bbetween\b|->|→|–| - /.test(lower)) return null
  const places = findPlaces(text)
  if (places.length < 2 || places[0].city === places[1].city) return null
  const [first, second] = places
  // "to X from Y" lists the destination first.
  const fromIndex = lower.search(/\bfrom\b/)
  const toIndex = lower.search(/\bto\b/)
  if (fromIndex !== -1 && toIndex !== -1 && toIndex < fromIndex) return { pickup: second, destination: first }
  return { pickup: first, destination: second }
}

/** "Kochi, Kerala" when the state is known. */
export function placeLabel(place: Place): string {
  return place.state ? `${place.city}, ${place.state}` : place.city
}
