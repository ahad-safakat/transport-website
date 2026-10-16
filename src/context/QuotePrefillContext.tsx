import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { QuotePrefillContext, scrollToSection, type QuotePrefill } from './quotePrefill'

export function QuotePrefillProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<{ values: QuotePrefill; version: number }>({ values: {}, version: 0 })
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const requestQuote = useCallback(
    (values: QuotePrefill = {}) => {
      setPrefill((current) => ({ values, version: current.version + 1 }))
      if (pathname !== '/') {
        navigate('/#quote')
        return
      }
      if (window.location.hash !== '#quote') {
        window.history.replaceState(null, '', '/#quote')
      }
      requestAnimationFrame(() => scrollToSection('quote'))
    },
    [navigate, pathname],
  )

  const value = useMemo(() => ({ prefill, requestQuote }), [prefill, requestQuote])

  return <QuotePrefillContext.Provider value={value}>{children}</QuotePrefillContext.Provider>
}
