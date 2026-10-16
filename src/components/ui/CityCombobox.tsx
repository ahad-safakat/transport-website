import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { MapPin } from 'lucide-react'
import { suggestionPriorityStates } from '../../config/company'
import { allCities, citiesByState, stateForCity } from '../../data/indianCities'
import type { indianStates } from '../../data/indianStates'

type StateName = (typeof indianStates)[number]

type Props = {
  id: string
  name: string
  value: string
  /** Currently selected state; suggestions are limited to it when set. */
  state: string
  className: string
  required?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  placeholder?: string
  onChange: (city: string) => void
  /** Called when a picked or typed city identifies a state and none is selected yet. */
  onStateDetected: (state: StateName) => void
}

const MAX_RESULTS = 8

/**
 * City input with type-ahead suggestions from src/data/indianCities.ts.
 * Free text is always allowed, so smaller towns that aren't listed can still be entered.
 */
export function CityCombobox({ id, value, state, onChange, onStateDetected, className, ...inputProps }: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const options = useMemo(() => {
    const query = value.trim().toLowerCase()
    const pool =
      state && state in citiesByState
        ? citiesByState[state as StateName].map((city) => ({ city, state: state as StateName }))
        : allCities
    // Home-region cities first, then alphabetical.
    const rank = (item: { state: string }) => {
      const index = suggestionPriorityStates.indexOf(item.state)
      return index === -1 ? suggestionPriorityStates.length : index
    }
    const byPriority = (a: { city: string; state: string }, b: { city: string; state: string }) =>
      rank(a) - rank(b) || a.city.localeCompare(b.city)
    const starts = pool.filter((item) => item.city.toLowerCase().startsWith(query)).sort(byPriority)
    const contains = query
      ? pool.filter((item) => !item.city.toLowerCase().startsWith(query) && item.city.toLowerCase().includes(query)).sort(byPriority)
      : []
    const ordered = [...starts, ...contains]
    // Hide the list when the only suggestion is exactly what's already typed.
    if (ordered.length === 1 && ordered[0].city.toLowerCase() === query) return []
    return ordered.slice(0, MAX_RESULTS)
  }, [value, state])

  const showList = open && options.length > 0

  function choose(index: number) {
    const option = options[index]
    if (!option) return
    onChange(option.city)
    if (!state) onStateDetected(option.state)
    setOpen(false)
    setActive(-1)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((current) => (options.length ? (current + 1) % options.length : -1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setActive((current) => (options.length ? (current - 1 + options.length) % options.length : -1))
    } else if (event.key === 'Enter' && showList && active >= 0) {
      event.preventDefault()
      choose(active)
    } else if (event.key === 'Escape' && showList) {
      event.preventDefault()
      setOpen(false)
      setActive(-1)
    }
  }

  function onBlur() {
    setOpen(false)
    setActive(-1)
    if (!state) {
      const detected = stateForCity(value)
      if (detected) onStateDetected(detected)
    }
  }

  return (
    <div className="relative">
      <input
        {...inputProps}
        ref={inputRef}
        id={id}
        value={value}
        className={className}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        maxLength={80}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onFocus={() => setOpen(true)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      <ul
        id={listId}
        role="listbox"
        hidden={!showList}
        className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto border border-navy/15 bg-white py-1 shadow-[0_18px_40px_-12px_rgba(10,10,10,0.35)]"
      >
        {options.map((option, index) => (
          <li
            key={`${option.city}-${option.state}`}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={index === active}
            // mousedown fires before the input's blur, so the choice registers.
            onMouseDown={(event) => {
              event.preventDefault()
              choose(index)
            }}
            onMouseEnter={() => setActive(index)}
            className={`flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-[15px] ${
              index === active ? 'bg-accent/20 text-navy' : 'text-navy'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0 text-accent-ink" aria-hidden="true" />
              {option.city}
            </span>
            {!state ? <span className="text-xs text-muted">{option.state}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
