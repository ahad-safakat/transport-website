import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { enabledServices, hasWhatsApp, vehicleTypes } from '../../config/company'
import { privacyNotice } from '../../config/content'
import { useQuotePrefill } from '../../context/QuotePrefillContext'
import { indianStates } from '../../data/indianStates'
import {
  emptyQuote,
  quoteToWhatsAppMessage,
  validateQuote,
  type QuoteErrors,
  type QuotePayload,
} from '../../lib/quoteValidation'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string; whatsappFallback: boolean }

const fieldClass =
  'mt-1.5 w-full border border-navy/15 bg-white px-3 py-2.5 text-sm text-navy outline-none transition-colors focus:border-accent'
const labelClass = 'block text-xs font-bold tracking-[0.12em] text-navy/70 uppercase'

export function QuoteForm() {
  const { prefill } = useQuotePrefill()
  const [values, setValues] = useState<QuotePayload>(() => emptyQuote())
  const [errors, setErrors] = useState<QuoteErrors>({})
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })
  const applied = useRef(false)

  useEffect(() => {
    if (!applied.current) {
      applied.current = true
    }
    if (Object.keys(prefill).length === 0) return
    setValues((current) => ({ ...current, ...prefill }))
  }, [prefill])

  function update<K extends keyof QuotePayload>(key: K, value: QuotePayload[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (submit.status === 'submitting') return

    const nextErrors = validateQuote(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSubmit({ status: 'idle' })
      return
    }

    setSubmit({ status: 'submitting' })
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        code?: string
      }

      if (!response.ok || !data.ok) {
        const needsWhatsApp = data.code === 'EMAIL_NOT_CONFIGURED' || response.status >= 500
        setSubmit({
          status: 'error',
          message:
            data.error ||
            'We could not submit this enquiry to our team. Your details are still on this form.',
          whatsappFallback: needsWhatsApp && hasWhatsApp(),
        })
        return
      }

      setSubmit({ status: 'success' })
    } catch {
      setSubmit({
        status: 'error',
        message: 'The enquiry could not be sent. Check your connection and try again, or continue on WhatsApp.',
        whatsappFallback: hasWhatsApp(),
      })
    }
  }

  const whatsappUrl = hasWhatsApp() ? buildWhatsAppUrl(quoteToWhatsAppMessage(values)) : null

  return (
    <section id="quote" className="section-pad bg-cream">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Enquiry"
            title="REQUEST A TRANSPORTATION QUOTE."
            intro="Share the movement you need. Our team reviews every enquiry and replies with pricing and availability. Submitting this form does not book a vehicle."
          />
          <p className="mt-6 text-sm leading-6 text-slate">{privacyNotice}</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="bg-white p-5 shadow-sm md:p-8" aria-describedby="quote-status">
          <input
            tabIndex={-1}
            autoComplete="off"
            className="honeypot"
            name="website"
            value={values.website}
            onChange={(event) => update('website', event.target.value)}
            aria-hidden="true"
          />

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-sm font-bold tracking-wide uppercase">Customer details</legend>
            <Field label="Full name" error={errors.fullName}>
              <input
                className={fieldClass}
                value={values.fullName}
                onChange={(event) => update('fullName', event.target.value)}
                autoComplete="name"
                required
              />
            </Field>
            <Field label="Company name (optional)" error={errors.companyName}>
              <input
                className={fieldClass}
                value={values.companyName}
                onChange={(event) => update('companyName', event.target.value)}
                autoComplete="organization"
              />
            </Field>
            <Field label="Mobile number" error={errors.mobile}>
              <input
                className={fieldClass}
                value={values.mobile}
                onChange={(event) => update('mobile', event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </Field>
            <Field label="Email (optional)" error={errors.email}>
              <input
                className={fieldClass}
                type="email"
                value={values.email}
                onChange={(event) => update('email', event.target.value)}
                autoComplete="email"
              />
            </Field>
          </fieldset>

          <fieldset className="mt-8 grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-sm font-bold tracking-wide uppercase">Pickup</legend>
            <div className="sm:col-span-2">
              <Field label="Pickup address or location" error={errors.pickupAddress}>
                <input
                  className={fieldClass}
                  value={values.pickupAddress}
                  onChange={(event) => update('pickupAddress', event.target.value)}
                  required
                />
              </Field>
            </div>
            <Field label="Pickup city" error={errors.pickupCity}>
              <input
                className={fieldClass}
                value={values.pickupCity}
                onChange={(event) => update('pickupCity', event.target.value)}
                required
              />
            </Field>
            <Field label="Pickup state" error={errors.pickupState}>
              <select
                className={fieldClass}
                value={values.pickupState}
                onChange={(event) => update('pickupState', event.target.value)}
                required
              >
                <option value="">Select state</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </Field>
          </fieldset>

          <fieldset className="mt-8 grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-sm font-bold tracking-wide uppercase">Delivery</legend>
            <div className="sm:col-span-2">
              <Field label="Delivery address or location" error={errors.deliveryAddress}>
                <input
                  className={fieldClass}
                  value={values.deliveryAddress}
                  onChange={(event) => update('deliveryAddress', event.target.value)}
                  required
                />
              </Field>
            </div>
            <Field label="Delivery city" error={errors.deliveryCity}>
              <input
                className={fieldClass}
                value={values.deliveryCity}
                onChange={(event) => update('deliveryCity', event.target.value)}
                required
              />
            </Field>
            <Field label="Delivery state" error={errors.deliveryState}>
              <select
                className={fieldClass}
                value={values.deliveryState}
                onChange={(event) => update('deliveryState', event.target.value)}
                required
              >
                <option value="">Select state</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </Field>
          </fieldset>

          <fieldset className="mt-8 grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-sm font-bold tracking-wide uppercase">Shipment</legend>
            <Field label="Preferred pickup date" error={errors.preferredPickupDate}>
              <input
                className={fieldClass}
                type="date"
                value={values.preferredPickupDate}
                onChange={(event) => update('preferredPickupDate', event.target.value)}
                required
              />
            </Field>
            <Field label="Required vehicle type" error={errors.vehicleType}>
              <select
                className={fieldClass}
                value={values.vehicleType}
                onChange={(event) => update('vehicleType', event.target.value)}
                required
              >
                <option value="">Select vehicle</option>
                {vehicleTypes.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Related service (optional)">
              <select
                className={fieldClass}
                value={values.serviceId}
                onChange={(event) => update('serviceId', event.target.value)}
              >
                <option value="">General transportation</option>
                {enabledServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Approximate cargo weight" error={errors.cargoWeight}>
              <input
                className={fieldClass}
                value={values.cargoWeight}
                onChange={(event) => update('cargoWeight', event.target.value)}
                placeholder="e.g. 8 tonnes"
                required
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Cargo description" error={errors.cargoDescription}>
                <textarea
                  className={`${fieldClass} min-h-24`}
                  value={values.cargoDescription}
                  onChange={(event) => update('cargoDescription', event.target.value)}
                  required
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Additional requirements (optional)">
                <textarea
                  className={`${fieldClass} min-h-20`}
                  value={values.additionalRequirements}
                  onChange={(event) => update('additionalRequirements', event.target.value)}
                />
              </Field>
            </div>
          </fieldset>

          <div id="quote-status" className="mt-6" aria-live="polite">
            {submit.status === 'success' ? (
              <p className="border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Enquiry received. Our team will review the details and contact you. This is not a booking
                confirmation.
              </p>
            ) : null}
            {submit.status === 'error' ? (
              <p className="border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-900">
                {submit.message}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={submit.status === 'submitting' || submit.status === 'success'}>
              {submit.status === 'submitting' ? 'Sending enquiry…' : 'Submit enquiry'}
            </Button>
            {whatsappUrl && (submit.status === 'error' || submit.status === 'idle') ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-navy/15 px-5 py-3 text-sm font-semibold"
              >
                Review and continue on WhatsApp
              </a>
            ) : null}
          </div>
          {!hasWhatsApp() ? (
            <p className="mt-4 text-xs text-slate">
              WhatsApp click-to-chat will appear here after a number is added in company configuration.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className={labelClass}>
      {label}
      {children}
      {error ? <span className="mt-1 block text-[11px] font-medium normal-case tracking-normal text-red-700">{error}</span> : null}
    </label>
  )
}
