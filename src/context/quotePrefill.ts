import { createContext, useContext } from 'react'
import type { QuotePayload } from '../lib/quoteValidation'

export type QuotePrefill = Partial<QuotePayload>

export type QuotePrefillContextValue = {
  /** Latest values sent to the quote form, with a version that increments on every request. */
  prefill: { values: QuotePrefill; version: number }
  /** Copies values into the quote form and brings the form into view. */
  requestQuote: (values?: QuotePrefill) => void
}

export const QuotePrefillContext = createContext<QuotePrefillContextValue | null>(null)

export function useQuotePrefill() {
  const context = useContext(QuotePrefillContext)
  if (!context) {
    throw new Error('useQuotePrefill must be used within QuotePrefillProvider')
  }
  return context
}

export function scrollToSection(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
