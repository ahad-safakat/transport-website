import { hasWhatsApp } from '../../config/company'
import { whatsappDefaultMessage } from '../../config/content'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { WhatsAppIcon } from '../ui/SocialIcons'

/** Floating click-to-chat button. Renders nothing when no valid number is configured. */
export function WhatsAppButton() {
  const href = hasWhatsApp() ? buildWhatsAppUrl(whatsappDefaultMessage) : null
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group isolate fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift ring-4 ring-white/70 transition-transform duration-200 hover:scale-105 md:right-6 md:bottom-6"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] animate-[wa-ping_2.8s_ease-out_infinite]" aria-hidden="true" />
      <WhatsAppIcon size={28} />
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-sm bg-navy px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
        Chat on WhatsApp
      </span>
    </a>
  )
}
