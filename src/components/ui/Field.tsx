import type { ReactNode } from 'react'
import { labelClass } from '../../lib/formStyles'

type Props = {
  id: string
  label: string
  error?: string
  required?: boolean
  optional?: boolean
  wide?: boolean
  children: ReactNode
}

/** Label + control + inline error. The control must use `id` and `aria-describedby={`${id}-error`}`. */
export function Field({ id, label, error, required, optional, wide, children }: Props) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required ? (
          <span className="text-accent-ink" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
        {optional ? <span className="font-medium tracking-normal normal-case text-muted"> (optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
