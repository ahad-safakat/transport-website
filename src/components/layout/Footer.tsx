import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  allPhones,
  company,
  displayName,
  enabledServices,
  hasAddress,
  hasEmail,
  hasGstin,
  hasPhone,
  hasSocial,
  isPlaceholder,
  navItems,
  telHref,
} from '../../config/company'
import { footerCopy, whatsappDefaultMessage } from '../../config/content'
import { useQuotePrefill } from '../../context/quotePrefill'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from '../ui/SocialIcons'

const year = new Date().getFullYear()
const headingClass = 'text-[11px] font-bold tracking-[0.18em] text-white/45 uppercase'
const linkClass = 'text-white/75 transition-colors hover:text-accent'

export function Footer() {
  const whatsapp = buildWhatsAppUrl(whatsappDefaultMessage)
  const { requestQuote } = useQuotePrefill()
  const brandName = isPlaceholder(company.name) ? 'Freight Transport' : company.name
  const socials = [
    hasSocial(company.linkedinUrl) ? { label: 'LinkedIn', href: company.linkedinUrl, icon: <LinkedInIcon /> } : null,
    hasSocial(company.instagramUrl) ? { label: 'Instagram', href: company.instagramUrl, icon: <InstagramIcon /> } : null,
    whatsapp ? { label: 'WhatsApp', href: whatsapp, icon: <WhatsAppIcon /> } : null,
  ].filter((item) => item !== null)

  return (
    <footer className="dark-focus relative bg-navy pb-24 text-white md:pb-0">
      <div className="h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent" aria-hidden="true" />
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={company.logoSrc} alt="" className="h-12 w-auto" width={95} height={48} loading="lazy" />
            <span className="flex flex-col">
              <span className="text-sm font-extrabold tracking-[0.16em] uppercase">{brandName}</span>
              {company.nameLocal ? (
                <span lang="kn" className="text-xs text-accent/90">
                  {company.nameLocal}
                </span>
              ) : null}
            </span>
          </Link>
          {!isPlaceholder(company.tagline) ? <p className="mt-4 text-sm font-semibold text-accent">{company.tagline}</p> : null}
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">{footerCopy.intro}</p>
          {socials.length > 0 ? (
            <ul className="mt-6 flex gap-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} (opens in a new tab)`}
                    className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/80 transition-colors hover:border-accent hover:text-accent"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Footer">
          <p className={headingClass}>Navigate</p>
          <ul className="mt-5 space-y-3 text-sm">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/#quote"
                className={linkClass}
                onClick={(event) => {
                  event.preventDefault()
                  requestQuote()
                }}
              >
                Request a Quote
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <p className={headingClass}>Services</p>
          <ul className="mt-5 space-y-3 text-sm">
            {enabledServices.map((service) => (
              <li key={service.id}>
                <a
                  href="/#quote"
                  className={linkClass}
                  onClick={(event) => {
                    event.preventDefault()
                    requestQuote({ serviceId: service.id })
                  }}
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={headingClass}>Contact</p>
          <ul className="mt-5 space-y-4 text-sm">
            {hasPhone() ? (
              <li className="flex gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span className="flex flex-col gap-1">
                  {allPhones().map((phone) => (
                    <a key={phone} href={telHref(phone)} className={linkClass}>
                      {phone}
                    </a>
                  ))}
                </span>
              </li>
            ) : null}
            {hasEmail() ? (
              <li className="flex gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <a href={`mailto:${company.email}`} className={`${linkClass} break-all`}>
                  {company.email}
                </a>
              </li>
            ) : null}
            {whatsapp ? (
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-accent">
                  <WhatsAppIcon size={16} />
                </span>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Chat on WhatsApp
                </a>
              </li>
            ) : null}
            {hasAddress() ? (
              <li className="flex gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {company.officeAddress}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-4 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {displayName()}. All rights reserved.
            {hasGstin() ? <span className="ml-2 border-l border-white/20 pl-2">GSTIN {company.gstin}</span> : null}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-white">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
