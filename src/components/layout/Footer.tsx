import { company, displayName, enabledServices, hasEmail, hasPhone, hasSocial, hasWhatsApp, isPlaceholder, navItems } from '../../config/company'
import { footerCopy, whatsappDefaultMessage } from '../../config/content'
import { buildWhatsAppUrl } from '../../lib/whatsapp'

export function Footer() {
  const whatsapp = hasWhatsApp() ? buildWhatsAppUrl(whatsappDefaultMessage) : null

  return (
    <footer className="bg-navy text-white">
      <div className="container-site grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={company.logoSrc} alt="" className="h-9 w-auto" />
            <p className="text-sm font-bold tracking-[0.16em] uppercase">
              {isPlaceholder(company.name) ? 'Freight Transport' : company.name}
            </p>
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/65">{footerCopy.intro}</p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-white/45 uppercase">Navigate</p>
          <ul className="mt-4 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={item.href} className="text-white/80 hover:text-accent">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/#quote" className="text-white/80 hover:text-accent">
                Request a Quote
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-white/45 uppercase">Services</p>
          <ul className="mt-4 space-y-2 text-sm">
            {enabledServices.map((service) => (
              <li key={service.id}>
                <a href="/#quote" className="text-white/80 hover:text-accent">
                  {service.shortTitle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-site flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {displayName()}. Transportation enquiries only.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {hasPhone() ? (
            <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="hover:text-white">
              {company.phone}
            </a>
          ) : null}
          {hasEmail() ? (
            <a href={`mailto:${company.email}`} className="hover:text-white">
              {company.email}
            </a>
          ) : null}
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              WhatsApp
            </a>
          ) : null}
          {hasSocial(company.instagramUrl) ? (
            <a href={company.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Instagram
            </a>
          ) : null}
          {hasSocial(company.linkedinUrl) ? (
            <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              LinkedIn
            </a>
          ) : null}
          <a href="/privacy" className="hover:text-white">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-white">
            Terms and Conditions
          </a>
        </div>
      </div>
    </footer>
  )
}
