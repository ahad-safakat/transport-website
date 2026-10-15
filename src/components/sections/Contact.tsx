import { useState, type FormEvent } from 'react'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import {
  company,
  hasAddress,
  hasEmail,
  hasPhone,
  hasSocial,
  hasWhatsApp,
  isPlaceholder,
} from '../../config/company'
import { contactCopy, privacyNotice, whatsappDefaultMessage } from '../../config/content'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'

export function Contact() {
  const whatsapp = hasWhatsApp() ? buildWhatsAppUrl(whatsappDefaultMessage) : null
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (status === 'submitting') return
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Name, mobile number, and message are required.')
      setStatus('error')
      return
    }
    setStatus('submitting')
    setError('')
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'contact',
          fullName: name,
          email,
          mobile: phone,
          cargoDescription: message,
          website: honeypot,
          startedAt: Date.now() - 3000,
        }),
      })
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!response.ok || !data.ok) {
        setStatus('error')
        setError(data.error || 'The message could not be delivered. Please use phone or WhatsApp.')
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setError('The message could not be delivered. Please use phone or WhatsApp.')
    }
  }

  return (
    <section id="contact" className="section-pad bg-white">
      <div className="container-site grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Contact" title={contactCopy.heading} intro={contactCopy.supporting} />
          <ul className="mt-10 space-y-5">
            {hasPhone() ? (
              <li className="flex gap-3 text-sm">
                <Phone size={18} className="mt-0.5 text-accent" />
                <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="font-semibold">
                  {company.phone}
                </a>
              </li>
            ) : null}
            {whatsapp ? (
              <li className="flex gap-3 text-sm">
                <MessageCircle size={18} className="mt-0.5 text-accent" />
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold">
                  Message on WhatsApp
                </a>
              </li>
            ) : null}
            {hasEmail() ? (
              <li className="flex gap-3 text-sm">
                <Mail size={18} className="mt-0.5 text-accent" />
                <a href={`mailto:${company.email}`} className="font-semibold">
                  {company.email}
                </a>
              </li>
            ) : null}
            {hasAddress() ? (
              <li className="flex gap-3 text-sm">
                <MapPin size={18} className="mt-0.5 text-accent" />
                <span>
                  {company.officeAddress}
                  {!isPlaceholder(company.headquarters) ? (
                    <span className="mt-1 block text-slate">{company.headquarters}</span>
                  ) : null}
                </span>
              </li>
            ) : (
              <li className="text-sm text-slate">
                Office address and direct contact numbers will appear here once they are configured.
              </li>
            )}
          </ul>
          <div className="mt-8 flex gap-4 text-sm font-semibold">
            {hasSocial(company.instagramUrl) ? (
              <a href={company.instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            ) : null}
            {hasSocial(company.linkedinUrl) ? (
              <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>

        <form onSubmit={onSubmit} className="border border-navy/10 p-5 md:p-8" noValidate>
          <h3 className="text-lg font-bold">General enquiry</h3>
          <input
            className="honeypot"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
            aria-hidden="true"
          />
          <label className="mt-5 block text-xs font-bold tracking-[0.12em] uppercase">
            Name
            <input className="mt-1.5 w-full border border-navy/15 px-3 py-2.5 text-sm" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="mt-4 block text-xs font-bold tracking-[0.12em] uppercase">
            Mobile
            <input className="mt-1.5 w-full border border-navy/15 px-3 py-2.5 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>
          <label className="mt-4 block text-xs font-bold tracking-[0.12em] uppercase">
            Email (optional)
            <input className="mt-1.5 w-full border border-navy/15 px-3 py-2.5 text-sm" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="mt-4 block text-xs font-bold tracking-[0.12em] uppercase">
            Message
            <textarea className="mt-1.5 min-h-28 w-full border border-navy/15 px-3 py-2.5 text-sm" value={message} onChange={(e) => setMessage(e.target.value)} required />
          </label>
          <p className="mt-3 text-xs leading-5 text-slate">{privacyNotice}</p>
          {status === 'success' ? (
            <p className="mt-4 text-sm text-emerald-800">Message received. Our team will respond.</p>
          ) : null}
          {status === 'error' ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
          <div className="mt-5">
            <Button type="submit" disabled={status === 'submitting' || status === 'success'}>
              {status === 'submitting' ? 'Sending…' : 'Send message'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
