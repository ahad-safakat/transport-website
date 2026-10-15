import { MessageCircle } from 'lucide-react'
import { hasWhatsApp } from '../../config/company'
import { whatsappDefaultMessage } from '../../config/content'
import { buildWhatsAppUrl } from '../../lib/whatsapp'

export function WhatsAppButton() {
  if (!hasWhatsApp()) return null
  const href = buildWhatsAppUrl(whatsappDefaultMessage)
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105 md:right-6 md:bottom-6"
      aria-label="Enquire on WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  )
}
