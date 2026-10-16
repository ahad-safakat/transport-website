import { useRef, useState, type FormEvent } from 'react'
import { CheckCircle2, Handshake, Loader2, MessageCircle } from 'lucide-react'
import { hasWhatsApp, vehicleTypes } from '../../config/company'
import { partnerCopy } from '../../config/content'
import { fieldClass } from '../../lib/formStyles'
import { partnerTypes, validatePartner, type PartnerErrors, type PartnerPayload } from '../../lib/quoteValidation'
import { openWhatsApp } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Reveal } from '../ui/Reveal'

type Status = { state: 'idle' } | { state: 'submitting' } | { state: 'success' } | { state: 'error'; message: string }

const emptyPartner = (): PartnerPayload => ({
  fullName: '',
  mobile: '',
  partnerType: '',
  vehicleType: '',
  vehicleCount: '',
  baseCity: '',
  routes: '',
  website: '',
  startedAt: Date.now(),
})

const order: (keyof PartnerPayload)[] = ['fullName', 'mobile', 'partnerType', 'vehicleType', 'vehicleCount', 'baseCity']

export function Partner() {
  const [values, setValues] = useState<PartnerPayload>(emptyPartner)
  const [errors, setErrors] = useState<PartnerErrors>({})
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const formRef = useRef<HTMLFormElement>(null)
  const inFlight = useRef(false)

  function update<K extends keyof PartnerPayload>(key: K, value: PartnerPayload[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (inFlight.current) return
    const nextErrors = validatePartner(values)
    setErrors(nextErrors)
    const first = order.find((key) => nextErrors[key])
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
        body: JSON.stringify({ kind: 'partner', ...values }),
      })
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: PartnerErrors }
      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors)
        setStatus({ state: 'error', message: data.errors?.startedAt ?? data.error ?? 'Your details could not be sent. Please call or WhatsApp us.' })
        return
      }
      setStatus({ state: 'success' })
      setValues(emptyPartner())
    } catch {
      setStatus({ state: 'error', message: 'Your details could not be sent. Check your connection, or call or WhatsApp us.' })
    } finally {
      inFlight.current = false
    }
  }

  function continueOnWhatsApp() {
    const type = partnerTypes.find((item) => item.id === values.partnerType)?.label
    const vehicle = vehicleTypes.find((item) => item.id === values.vehicleType)?.label
    openWhatsApp(
      [
        'Hello, I would like to partner with you as a vehicle owner / agent.',
        values.fullName ? `Name: ${values.fullName}` : null,
        type ? `I am a: ${type}` : null,
        vehicle ? `Vehicle: ${vehicle}${values.vehicleCount ? ` × ${values.vehicleCount}` : ''}` : null,
        values.baseCity ? `Base city: ${values.baseCity}` : null,
        values.routes ? `Routes: ${values.routes}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }

  const fieldProps = <K extends keyof PartnerPayload>(key: K) => ({
    id: `partner-${key}`,
    name: key,
    value: values[key] as string,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `partner-${key}-error` : undefined,
    className: fieldClass,
  })

  return (
    <section id="partner" className="dark-focus relative isolate overflow-hidden bg-navy text-white">
      <img
        src="/images/partner-truck.jpg"
        alt=""
        className="absolute inset-y-0 left-0 -z-20 hidden h-full w-1/2 object-cover object-[center_60%] opacity-30 lg:block"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/70 via-navy to-navy" aria-hidden="true" />

      <div className="container-site section-pad grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow eyebrow-on-dark flex items-center gap-2">
            <Handshake size={16} aria-hidden="true" />
            {partnerCopy.eyebrow}
          </p>
          <h2 className="display-title mt-3 text-3xl sm:text-4xl md:text-[2.75rem]">{partnerCopy.heading}</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/75 md:text-lg">{partnerCopy.intro}</p>
          <ul className="mt-8 space-y-3">
            {partnerCopy.points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm font-semibold text-white/85">
                <CheckCircle2 size={18} className="shrink-0 text-accent" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form ref={formRef} onSubmit={onSubmit} noValidate className="bg-white p-6 text-navy md:p-9" aria-busy={status.state === 'submitting'}>
            <h3 className="text-xl font-extrabold tracking-tight">Partnership enquiry</h3>
            <div className="honeypot" aria-hidden="true">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={(e) => update('website', e.target.value)} />
              </label>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id="partner-fullName" label="Name" error={errors.fullName} required>
                <input {...fieldProps('fullName')} required autoComplete="name" maxLength={120} onChange={(e) => update('fullName', e.target.value)} />
              </Field>
              <Field id="partner-mobile" label="Mobile" error={errors.mobile} required>
                <input {...fieldProps('mobile')} required type="tel" inputMode="tel" autoComplete="tel" maxLength={16} onChange={(e) => update('mobile', e.target.value)} />
              </Field>
              <Field id="partner-partnerType" label="I am a" error={errors.partnerType} required>
                <select {...fieldProps('partnerType')} required onChange={(e) => update('partnerType', e.target.value)}>
                  <option value="">Select</option>
                  {partnerTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="partner-baseCity" label="Base city" error={errors.baseCity} required>
                <input {...fieldProps('baseCity')} required maxLength={80} onChange={(e) => update('baseCity', e.target.value)} />
              </Field>
              <Field id="partner-vehicleType" label="Vehicle type" error={errors.vehicleType} optional>
                <select {...fieldProps('vehicleType')} onChange={(e) => update('vehicleType', e.target.value)}>
                  <option value="">Select</option>
                  {vehicleTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="partner-vehicleCount" label="Number of vehicles" error={errors.vehicleCount} optional>
                <input {...fieldProps('vehicleCount')} inputMode="numeric" maxLength={4} onChange={(e) => update('vehicleCount', e.target.value.replace(/\D/g, ''))} />
              </Field>
              <Field id="partner-routes" label="Usual routes" optional wide>
                <input {...fieldProps('routes')} maxLength={500} placeholder="e.g. Mangaluru – Bengaluru, Mangaluru – Goa" onChange={(e) => update('routes', e.target.value)} />
              </Field>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate">{partnerCopy.disclaimer}</p>
            <div aria-live="polite" className="mt-4">
              {status.state === 'success' ? (
                <p className="border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status">
                  Thank you — your details were sent. Our team will contact you.
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
                  'Send details'
                )}
              </Button>
              {hasWhatsApp() ? (
                <Button variant={status.state === 'error' ? 'whatsapp' : 'ghost'} onClick={continueOnWhatsApp}>
                  <MessageCircle size={16} aria-hidden="true" />
                  Send on WhatsApp
                </Button>
              ) : null}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
