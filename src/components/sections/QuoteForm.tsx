import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Loader2, MessageCircle, ShieldCheck } from 'lucide-react'
import { enabledServices, hasWhatsApp, vehicleTypes } from '../../config/company'
import { privacyNotice, quoteCopy } from '../../config/content'
import { useQuotePrefill } from '../../context/quotePrefill'
import { indianStates } from '../../data/indianStates'
import {
  emptyQuote,
  quoteToWhatsAppMessage,
  todayStamp,
  validateQuote,
  type QuoteErrors,
  type QuotePayload,
} from '../../lib/quoteValidation'
import { fieldClass } from '../../lib/formStyles'
import { openWhatsApp } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { CityCombobox } from '../ui/CityCombobox'
import { Field } from '../ui/Field'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string; whatsappFallback: boolean }

type ApiResponse = { ok?: boolean; error?: string; code?: string; errors?: QuoteErrors }


const fieldOrder: (keyof QuotePayload)[] = [
  'fullName',
  'companyName',
  'mobile',
  'email',
  'pickupAddress',
  'pickupCity',
  'pickupState',
  'deliveryAddress',
  'deliveryCity',
  'deliveryState',
  'preferredPickupDate',
  'vehicleType',
  'cargoWeight',
  'cargoDescription',
]

const optionalFields = new Set<keyof QuotePayload>(['companyName', 'email', 'serviceId', 'additionalRequirements'])
const requiredFields = new Set(fieldOrder.filter((key) => !optionalFields.has(key)))

export function QuoteForm() {
  const { prefill } = useQuotePrefill()
  const reduce = useReducedMotion()
  const [values, setValues] = useState<QuotePayload>(() => emptyQuote())
  const [errors, setErrors] = useState<QuoteErrors>({})
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })
  const [appliedVersion, setAppliedVersion] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)
  const inFlight = useRef(false)

  // Apply values sent from service cards or the chatbot (adjusting state during render, not in an effect).
  if (prefill.version !== appliedVersion) {
    setAppliedVersion(prefill.version)
    setValues((current) => ({ ...current, ...prefill.values }))
    if (submit.status === 'success') setSubmit({ status: 'idle' })
  }

  function update<K extends keyof QuotePayload>(key: K, value: QuotePayload[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))
  }

  function focusFirstError(nextErrors: QuoteErrors) {
    const first = fieldOrder.find((key) => nextErrors[key])
    if (!first) return
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)
      el?.focus({ preventScroll: true })
      el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    })
  }

  function validateOrFocus(): boolean {
    const nextErrors = validateQuote(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors)
      return false
    }
    return true
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (inFlight.current || submit.status === 'success') return
    if (!validateOrFocus()) {
      setSubmit({ status: 'idle' })
      return
    }

    inFlight.current = true
    setSubmit({ status: 'submitting' })
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = (await response.json().catch(() => ({}))) as ApiResponse

      if (!response.ok || !data.ok) {
        if (data.errors && Object.keys(data.errors).length > 0) {
          setErrors(data.errors)
          focusFirstError(data.errors)
        }
        const message =
          data.errors?.startedAt ??
          data.error ??
          'We could not submit this enquiry to our team. Your details are still on this form.'
        setSubmit({
          status: 'error',
          message,
          whatsappFallback: hasWhatsApp() && (data.code === 'EMAIL_NOT_CONFIGURED' || response.status >= 500 || !data.errors),
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
    } finally {
      inFlight.current = false
    }
  }

  function continueOnWhatsApp() {
    if (!validateOrFocus()) return
    openWhatsApp(quoteToWhatsAppMessage(values))
  }

  function startNewEnquiry() {
    setValues(emptyQuote())
    setErrors({})
    setSubmit({ status: 'idle' })
  }

  const submitting = submit.status === 'submitting'
  const fieldProps = <K extends keyof QuotePayload>(key: K) => ({
    id: `quote-${key}`,
    name: key,
    value: values[key] as string,
    required: requiredFields.has(key) || undefined,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `quote-${key}-error` : undefined,
    className: fieldClass,
  })

  return (
    <section id="quote" className="section-pad scroll-mt-16 bg-cream">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="Enquiry" title={quoteCopy.heading} intro={quoteCopy.intro} />
          <ul className="mt-8 space-y-4">
            {quoteCopy.points.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-6 text-navy/80">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-8 flex gap-3 border-l-2 border-accent bg-white px-4 py-3 text-xs leading-5 text-slate">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
            {privacyNotice}
          </p>
        </Reveal>

        <div className="relative bg-white shadow-[0_24px_60px_-30px_rgba(10,10,10,0.35)]">
          <div className="h-1 bg-accent" aria-hidden="true" />
          <AnimatePresence mode="wait" initial={false}>
            {submit.status === 'success' ? (
              <motion.div
                key="success"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                className="p-6 md:p-10"
                role="status"
                tabIndex={-1}
                ref={(el) => el?.focus({ preventScroll: true })}
              >
                <CheckCircle2 size={40} className="text-accent-ink" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-extrabold tracking-tight">Enquiry received.</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate">
                  Thank you, {values.fullName.split(' ')[0] || 'there'}. Our team will review the details for{' '}
                  <strong className="text-navy">
                    {values.pickupCity} → {values.deliveryCity}
                  </strong>{' '}
                  and contact you on {values.mobile}. This is not a booking confirmation — pricing and availability
                  will be shared after review.
                </p>
                <div className="mt-8">
                  <Button variant="ghost" onClick={startNewEnquiry}>
                    Submit another enquiry
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={onSubmit}
                noValidate
                className="p-5 sm:p-7 md:p-9"
                aria-describedby="quote-status"
                aria-busy={submitting}
                exit={reduce ? undefined : { opacity: 0 }}
              >
                <div className="honeypot" aria-hidden="true">
                  <label>
                    Website
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      name="website"
                      value={values.website}
                      onChange={(event) => update('website', event.target.value)}
                    />
                  </label>
                </div>

                <FieldGroup title="Your details" step="01">
                  <Field id="quote-fullName" label="Full name" error={errors.fullName} required>
                    <input {...fieldProps('fullName')} onChange={(e) => update('fullName', e.target.value)} autoComplete="name" maxLength={120} />
                  </Field>
                  <Field id="quote-companyName" label="Company name" optional>
                    <input {...fieldProps('companyName')} onChange={(e) => update('companyName', e.target.value)} autoComplete="organization" maxLength={160} />
                  </Field>
                  <Field id="quote-mobile" label="Mobile number" error={errors.mobile} required>
                    <input
                      {...fieldProps('mobile')}
                      onChange={(e) => update('mobile', e.target.value)}
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="98XXXXXXXX"
                      maxLength={16}
                    />
                  </Field>
                  <Field id="quote-email" label="Email" error={errors.email} optional>
                    <input {...fieldProps('email')} onChange={(e) => update('email', e.target.value)} type="email" autoComplete="email" maxLength={160} />
                  </Field>
                </FieldGroup>

                <FieldGroup title="Pickup" step="02">
                  <Field id="quote-pickupAddress" label="Pickup address or location" error={errors.pickupAddress} required wide>
                    <input {...fieldProps('pickupAddress')} onChange={(e) => update('pickupAddress', e.target.value)} placeholder="Factory, unit, or landmark" maxLength={240} />
                  </Field>
                  <Field id="quote-pickupCity" label="Pickup city" error={errors.pickupCity} required>
                    <CityCombobox
                      {...fieldProps('pickupCity')}
                      state={values.pickupState}
                      placeholder="Start typing, e.g. Mangaluru"
                      onChange={(city) => update('pickupCity', city)}
                      onStateDetected={(state) => update('pickupState', state)}
                    />
                  </Field>
                  <Field id="quote-pickupState" label="Pickup state" error={errors.pickupState} required>
                    <StateSelect {...fieldProps('pickupState')} onChange={(value) => update('pickupState', value)} />
                  </Field>
                </FieldGroup>

                <FieldGroup title="Delivery" step="03">
                  <Field id="quote-deliveryAddress" label="Delivery address or location" error={errors.deliveryAddress} required wide>
                    <input {...fieldProps('deliveryAddress')} onChange={(e) => update('deliveryAddress', e.target.value)} placeholder="Consignee address or landmark" maxLength={240} />
                  </Field>
                  <Field id="quote-deliveryCity" label="Delivery city" error={errors.deliveryCity} required>
                    <CityCombobox
                      {...fieldProps('deliveryCity')}
                      state={values.deliveryState}
                      placeholder="Start typing, e.g. Bengaluru"
                      onChange={(city) => update('deliveryCity', city)}
                      onStateDetected={(state) => update('deliveryState', state)}
                    />
                  </Field>
                  <Field id="quote-deliveryState" label="Delivery state" error={errors.deliveryState} required>
                    <StateSelect {...fieldProps('deliveryState')} onChange={(value) => update('deliveryState', value)} />
                  </Field>
                </FieldGroup>

                <FieldGroup title="Shipment" step="04">
                  <Field id="quote-preferredPickupDate" label="Preferred pickup date" error={errors.preferredPickupDate} required>
                    <input
                      {...fieldProps('preferredPickupDate')}
                      onChange={(e) => update('preferredPickupDate', e.target.value)}
                      type="date"
                      min={todayStamp()}
                    />
                  </Field>
                  <Field id="quote-vehicleType" label="Required vehicle type" error={errors.vehicleType} required>
                    <select {...fieldProps('vehicleType')} onChange={(e) => update('vehicleType', e.target.value)}>
                      <option value="">Select vehicle</option>
                      {vehicleTypes.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field id="quote-serviceId" label="Related service" optional>
                    <select {...fieldProps('serviceId')} onChange={(e) => update('serviceId', e.target.value)}>
                      <option value="">General transportation</option>
                      {enabledServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field id="quote-cargoWeight" label="Approximate cargo weight" error={errors.cargoWeight} required>
                    <input {...fieldProps('cargoWeight')} onChange={(e) => update('cargoWeight', e.target.value)} placeholder="e.g. 8 tonnes" maxLength={80} />
                  </Field>
                  <Field id="quote-cargoDescription" label="Cargo description" error={errors.cargoDescription} required wide>
                    <textarea
                      {...fieldProps('cargoDescription')}
                      className={`${fieldClass} min-h-24 resize-y`}
                      onChange={(e) => update('cargoDescription', e.target.value)}
                      placeholder="What are you moving? Packaging, number of units, any handling notes."
                      maxLength={1000}
                    />
                  </Field>
                  <Field id="quote-additionalRequirements" label="Additional requirements" optional wide>
                    <textarea
                      {...fieldProps('additionalRequirements')}
                      className={`${fieldClass} min-h-20 resize-y`}
                      onChange={(e) => update('additionalRequirements', e.target.value)}
                      maxLength={1000}
                    />
                  </Field>
                </FieldGroup>

                <div id="quote-status" className="mt-8" aria-live="polite">
                  {submit.status === 'error' ? (
                    <div className="border border-red-700/20 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900" role="alert">
                      <p>{submit.message}</p>
                      {submit.whatsappFallback ? (
                        <p className="mt-1 text-red-900/80">
                          Your details have not been lost. You can review them and send them to us on WhatsApp instead.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  {Object.values(errors).some(Boolean) && submit.status !== 'error' ? (
                    <p className="text-sm text-red-700">Please complete the highlighted fields.</p>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button type="submit" disabled={submitting} className="sm:min-w-52">
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        Sending enquiry…
                      </>
                    ) : (
                      'Submit enquiry'
                    )}
                  </Button>
                  {hasWhatsApp() ? (
                    <Button
                      type="button"
                      variant={submit.status === 'error' && submit.whatsappFallback ? 'whatsapp' : 'ghost'}
                      onClick={continueOnWhatsApp}
                      disabled={submitting}
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      Review and continue on WhatsApp
                    </Button>
                  ) : null}
                </div>
                <p className="mt-4 text-xs leading-5 text-slate">
                  Submitting this form sends an enquiry, not a booking. WhatsApp opens with your details prefilled — nothing
                  is sent until you press send.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function FieldGroup({ title, step, children }: { title: string; step: string; children: ReactNode }) {
  return (
    <fieldset className="mt-8 grid gap-x-4 gap-y-5 first-of-type:mt-0 sm:grid-cols-2">
      <legend className="mb-4 flex w-full items-center gap-3 text-sm font-extrabold tracking-[0.08em] uppercase">
        <span className="text-accent-ink">{step}</span>
        {title}
        <span className="h-px flex-1 bg-navy/10" aria-hidden="true" />
      </legend>
      {children}
    </fieldset>
  )
}

function StateSelect({
  onChange,
  ...props
}: {
  id: string
  name: string
  value: string
  required?: boolean
  className: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  onChange: (value: string) => void
}) {
  return (
    <select {...props} onChange={(event) => onChange(event.target.value)} autoComplete="off">
      <option value="">Select state</option>
      {indianStates.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
  )
}
