import { useEffect, useId, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { company, displayName, isPlaceholder, navItems } from '../../config/company'

const sectionIds = ['home', 'about', 'services', 'coverage', 'quote', 'contact']

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const menuId = useId()
  const location = useLocation()
  const onHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!onHome) return
    const observers: IntersectionObserver[] = []
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((observer) => observer.disconnect())
  }, [onHome])

  const solid = scrolled || open || !onHome
  const navLinkClass = (id: string) =>
    `text-sm font-semibold tracking-wide transition-colors ${
      active === id && onHome ? 'text-accent' : solid ? 'text-white/80 hover:text-white' : 'text-white/85 hover:text-white'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-navy/95 shadow-lg shadow-black/20 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-site flex h-[76px] items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-3 text-white">
          <img src={company.logoSrc} alt="" className="h-9 w-auto" width={40} height={40} />
          <span className="truncate text-sm font-bold tracking-[0.14em] uppercase">
            {isPlaceholder(company.name) ? 'Freight Transport' : company.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} className={navLinkClass(item.id)}>
              {item.label}
            </a>
          ))}
          <a
            href="/#quote"
            className="rounded-sm bg-accent px-4 py-2.5 text-sm font-bold tracking-wide text-navy transition-colors hover:bg-accent-dark"
          >
            Request a Quote
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-white lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div id={menuId} className="border-t border-white/10 bg-navy lg:hidden">
          <nav className="container-site flex flex-col gap-1 py-4" aria-label="Mobile">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="px-1 py-3 text-base font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/#quote"
              className="mt-2 bg-accent px-4 py-3 text-center text-sm font-bold text-navy"
              onClick={() => setOpen(false)}
            >
              Request a Quote
            </a>
            <p className="px-1 pt-3 text-xs text-white/50">{displayName()}</p>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
