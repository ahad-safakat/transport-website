import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import {
  allPhones,
  company,
  hasAddress,
  hasEmail,
  hasGstin,
  hasPhone,
  hasSocial,
  hasWhatsApp,
  telHref,
} from '../../config/company'
import { contactCopy, privacyNotice, whatsappDefaultMessage } from '../../config/content'
import { validateContact, type ContactErrors, type ContactPayload } from '../../lib/quoteValidation'
import { fieldClass } from '../../lib/formStyles'
import { buildWhatsAppUrl, openWhatsApp } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { InstagramIcon, LinkedInIcon } from '../ui/SocialIcons'

type Status = { state: 'idle' } | { state: 'submitting' } | { state: 'success' } | { state: 'error'; message: string }

const emptyContact = (): ContactPayload => ({ fullName: '', mobile: '', email: '', message: '', website: '', startedAt: Date.now() })

export function Contact() {
  const whatsapp = buildWhatsAppUrl(whatsappDefaultMessage)
  const [values, setValues] = useState<ContactPayload>(emptyContact)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const formRef = useRef<HTMLFormElement>(null)
  const inFlight = useRef(false)

  function update<K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (inFlight.current) return
    const nextErrors = validateContact(values)
    setErrors(nextErrors)
    const first = (['fullName', 'mobile', 'email', 'message'] as const).find((key) => nextErrors[key])
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    inFlight.current = true
    setStatus({ state: 'submitting' })
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'contact', ...values }),
      })
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: ContactErrors }
      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors)
        setStatus({
          state: 'error',
          message: data.errors?.startedAt ?? data.error ?? 'The message could not be delivered. Please use phone or WhatsApp.',
        })
        return
      }
      setStatus({ state: 'success' })
      setValues(emptyContact())
    } catch {
      setStatus({ state: 'error', message: 'The message could not be delivered. Check your connection, or use phone or WhatsApp.' })
    } finally {
      inFlight.current = false
    }
  }

  const fieldProps = <K extends keyof ContactPayload>(key: K) => ({
    id: `contact-${key}`,
    name: key,
    value: values[key] as string,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `contact-${key}-error` : undefined,
    className: fieldClass,
  })

  const hasAnyDirect = hasPhone() || hasEmail() || hasAddress() || Boolean(whatsapp)

  return (
    <section id="contact" className="section-pad bg-white">
      <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHeading eyebrow="Contact" title={contactCopy.heading} intro={contactCopy.supporting} />
          <ul className="mt-10 divide-y divide-navy/10 border-y border-navy/10">
            {hasPhone() ? (
              <ContactRow icon={<Phone size={18} />} label="Telephone">
                <span className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                  {allPhones().map((phone) => (
                    <a key={phone} href={telHref(phone)} className="hover:text-accent-ink">
                      {phone}
                    </a>
                  ))}
                </span>
              </ContactRow>
            ) : null}
            {whatsapp ? (
              <ContactRow icon={<MessageCircle size={18} />} label="WhatsApp">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-accent-ink">
                  Message us on WhatsApp
                </a>
              </ContactRow>
            ) : null}
            {hasEmail() ? (
              <ContactRow icon={<Mail size={18} />} label="Email">
                <a href={`mailto:${company.email}`} className="break-all hover:text-accent-ink">
                  {company.email}
                </a>
              </ContactRow>
            ) : null}
            {hasAddress() ? (
              <ContactRow icon={<MapPin size={18} />} label="Office">
                <span className="font-medium">
                  <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent-ink">
                    {company.officeAddress}
                  </a>
                  {hasGstin() ? <span className="mt-1 block text-sm text-slate">GSTIN {company.gstin}</span> : null}
                </span>
              </ContactRow>
            ) : null}
          </ul>
          {!hasAnyDirect ? (
            <p className="mt-6 text-sm text-slate">Direct contact details will appear here once they are configured.</p>
          ) : null}
          {hasSocial(company.instagramUrl) || hasSocial(company.linkedinUrl) ? (
            <div className="mt-8 flex gap-3">
              {hasSocial(company.linkedinUrl) ? (
                <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center border border-navy/15 transition-colors hover:border-navy hover:bg-navy hover:text-white">
                  <LinkedInIcon />
                </a>
              ) : null}
              {hasSocial(company.instagramUrl) ? (
                <a href={company.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center border border-navy/15 transition-colors hover:border-navy hover:bg-navy hover:text-white">
                  <InstagramIcon />
                </a>
              ) : null}
            </div>
          ) : null}
        </Reveal>

        <Reveal delay={0.1}>
          <form ref={formRef} onSubmit={onSubmit} className="bg-cream p-6 md:p-9" noValidate aria-busy={status.state === 'submitting'}>
            <h3 className="text-xl font-extrabold tracking-tight">General enquiry</h3>
            <p className="mt-1.5 text-sm text-slate">For transport quotations, the quote form above gets you a faster response.</p>
            <div className="honeypot" aria-hidden="true">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={(e) => update('website', e.target.value)} />
              </label>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id="contact-fullName" label="Name" error={errors.fullName} required>
                <input {...fieldProps('fullName')} required autoComplete="name" maxLength={120} onChange={(e) => update('fullName', e.target.value)} />
              </Field>
              <Field id="contact-mobile" label="Mobile" error={errors.mobile} required>
                <input {...fieldProps('mobile')} required type="tel" inputMode="tel" autoComplete="tel" maxLength={16} onChange={(e) => update('mobile', e.target.value)} />
              </Field>
              <Field id="contact-email" label="Email" error={errors.email} optional wide>
                <input {...fieldProps('email')} type="email" autoComplete="email" maxLength={160} onChange={(e) => update('email', e.target.value)} />
              </Field>
              <Field id="contact-message" label="Message" error={errors.message} required wide>
                <textarea {...fieldProps('message')} required className={`${fieldClass} min-h-32 resize-y`} maxLength={1000} onChange={(e) => update('message', e.target.value)} />
              </Field>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate">{privacyNotice}</p>
            <div aria-live="polite" className="mt-4">
              {status.state === 'success' ? (
                <p className="border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status">
                  Message received. Our team will respond using the details you provided.
                </p>
              ) : null}
              {status.state === 'error' ? (
                <p className="border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
                  {status.message}
                </p>
              ) : null}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" disabled={status.state === 'submitting'}>
                {status.state === 'submitting' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  'Send message'
                )}
              </Button>
              {status.state === 'error' && hasWhatsApp() ? (
                <Button
                  variant="whatsapp"
                  onClick={() =>
                    openWhatsApp(
                      ['Hello, I have an enquiry.', values.fullName ? `Name: ${values.fullName}` : null, values.message || null]
                        .filter(Boolean)
                        .join('\n'),
                    )
                  }
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Continue on WhatsApp
                </Button>
              ) : null}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function ContactRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-4 py-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-navy text-accent" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0 text-[15px] font-bold">
        <p className="text-[11px] font-bold tracking-[0.16em] text-navy/50 uppercase">{label}</p>
        <div className="mt-1">{children}</div>
      </div>
    </li>
  )
}
