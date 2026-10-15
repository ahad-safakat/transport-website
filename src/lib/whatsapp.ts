import { company, hasWhatsApp } from '../config/company'

export function buildWhatsAppUrl(message: string): string | null {
  if (!hasWhatsApp()) return null
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${company.whatsappNumber}?text=${encoded}`
}

export function openWhatsApp(message: string): boolean {
  const url = buildWhatsAppUrl(message)
  if (!url) return false
  window.open(url, '_blank', 'noopener,noreferrer')
  return true
}
