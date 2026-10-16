import { useEffect, useId, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, MapPin, Menu, Phone, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { allPhones, company, hasAddress, hasGstin, hasPhone, isPlaceholder, navItems, telHref } from '../../config/company'
import { useQuotePrefill } from '../../context/quotePrefill'

const sectionIds = ['home', 'about', 'services', 'coverage', 'contact']

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const { requestQuote } = useQuotePrefill()
  const reduce = useReducedMotion()
  const onHome = location.pathname === '/'

  // Close the mobile menu on navigation (adjusting state during render).
  const [lastLocation, setLastLocation] = useState(location.key)
  if (lastLocation !== location.key) {
    setLastLocation(location.key)
    setOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  useEffect(() => {
    if (!onHome) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    // Sections without a nav item (e.g. quote) map to nothing, so the previous item stays highlighted.
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [onHome])

  const solid = scrolled || open || !onHome
  const brandName = isPlaceholder(company.name) ? 'Freight Transport' : company.name

  function goToQuote(event: MouseEvent) {
    event.preventDefault()
    setOpen(false)
    requestQuote()
  }

  return (
    <header
      className={`dark-focus fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        solid ? 'bg-navy/95 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-navy"
      >
        Skip to content
      </a>
      {/* Top info bar (desktop): collapses once the page scrolls. */}
      <div
        className={`hidden overflow-hidden border-b border-white/10 text-xs text-white/70 transition-[max-height,opacity] duration-300 md:block ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
        }`}
        aria-hidden={scrolled || undefined}
      >
        <div className="container-site flex h-9 items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-5">
            {hasAddress() ? (
              <a
                href={company.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={scrolled ? -1 : undefined}
                className="flex min-w-0 items-center gap-1.5 truncate hover:text-accent"
              >
                <MapPin size={13} className="shrink-0 text-accent" aria-hidden="true" />
                NH 66, Hosabettu, Mangaluru
              </a>
            ) : null}
            {hasGstin() ? (
              <span className="hidden items-center gap-1.5 lg:flex">
                <BadgeCheck size={13} className="text-accent" aria-hidden="true" />
                GSTIN {company.gstin}
              </span>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-4">
            {allPhones()
              .slice(0, 2)
              .map((phone) => (
                <a key={phone} href={telHref(phone)} tabIndex={scrolled ? -1 : undefined} className="flex items-center gap-1.5 font-semibold text-white/85 hover:text-accent">
                  <Phone size={13} className="text-accent" aria-hidden="true" />
                  {phone}
                </a>
              ))}
          </div>
        </div>
      </div>
      <div className={`container-site flex items-center justify-between gap-4 transition-[height] duration-300 ${scrolled ? 'h-16' : 'h-[76px]'}`}>
        <Link to="/" className="flex min-w-0 items-center gap-3 text-white" aria-label={`${brandName} — home`}>
          <img src={company.logoSrc} alt="" className="h-10 w-auto shrink-0 sm:h-11" width={87} height={44} />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-extrabold tracking-[0.14em] uppercase sm:text-[15px]">{brandName}</span>
            {company.nameLocal ? (
              <span lang="kn" className="truncate text-[11px] leading-4 text-accent/90">
                {company.nameLocal}
              </span>
            ) : null}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = onHome && active === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? 'location' : undefined}
                className={`relative py-2 text-sm font-semibold tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-accent after:transition-transform after:duration-300 ${
                  isActive ? 'text-white after:scale-x-100' : 'text-white/75 after:scale-x-0 hover:text-white hover:after:scale-x-100'
                }`}
              >
                {item.label}
              </a>
            )
          })}
          <a
            href="/#quote"
            onClick={goToQuote}
            className="btn-shine rounded-sm bg-accent px-5 py-2.5 text-xs font-extrabold tracking-[0.12em] text-navy uppercase transition-colors hover:bg-accent-dark"
          >
            Request a Quote
          </a>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-white lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="mobile-menu"
            id={menuId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-navy lg:hidden"
          >
            <nav className="container-site flex flex-col py-4" aria-label="Mobile">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={onHome && active === item.id ? 'location' : undefined}
                  className={`flex min-h-12 items-center border-b border-white/5 text-lg font-bold ${
                    onHome && active === item.id ? 'text-accent' : 'text-white'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a href="/#quote" onClick={goToQuote} className="mt-5 bg-accent px-4 py-3.5 text-center text-sm font-extrabold tracking-[0.12em] text-navy uppercase">
                Request a Quote
              </a>
              {hasPhone() ? (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {allPhones().map((phone) => (
                    <a key={phone} href={telHref(phone)} className="flex min-h-11 items-center justify-center gap-1.5 border border-white/10 text-xs font-semibold text-white/80">
                      <Phone size={13} className="text-accent" aria-hidden="true" />
                      {phone.replace('+91 ', '')}
                    </a>
                  ))}
                </div>
              ) : null}
              {hasGstin() ? <p className="mt-4 text-center text-[11px] text-white/45">GSTIN {company.gstin}</p> : null}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
