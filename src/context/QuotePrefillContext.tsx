import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { emptyQuote, type QuotePayload } from '../lib/quoteValidation'

type QuotePrefill = Partial<QuotePayload>

type QuotePrefillContextValue = {
  prefill: QuotePrefill
  applyPrefill: (values: QuotePrefill) => void
  consumePrefill: () => QuotePrefill
}

const QuotePrefillContext = createContext<QuotePrefillContextValue | null>(null)

export function QuotePrefillProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<QuotePrefill>({})

  const applyPrefill = useCallback((values: QuotePrefill) => {
    setPrefill(values)
  }, [])

  const consumePrefill = useCallback(() => {
    const current = prefill
    setPrefill({})
    return current
  }, [prefill])

  const value = useMemo(
    () => ({ prefill, applyPrefill, consumePrefill }),
    [prefill, applyPrefill, consumePrefill],
  )

  return <QuotePrefillContext.Provider value={value}>{children}</QuotePrefillContext.Provider>
}

export function useQuotePrefill() {
  const context = useContext(QuotePrefillContext)
  if (!context) {
    throw new Error('useQuotePrefill must be used within QuotePrefillProvider')
  }
  return context
}

export function mergeQuote(base: QuotePayload, patch: QuotePrefill): QuotePayload {
  return { ...emptyQuote(), ...base, ...patch, startedAt: base.startedAt || Date.now() }
}
