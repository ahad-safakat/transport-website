import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { company, hasEmail, hasPhone } from '../../config/company'

type Props = {
  title: string
  children: ReactNode
}

export function LegalLayout({ title, children }: Props) {
  return (
    <article>
      <header className="dark-focus bg-navy pt-36 pb-14 text-white">
        <div className="container-site max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>
          <p className="eyebrow eyebrow-on-dark mt-8">Legal</p>
          <h1 className="display-title mt-3 text-4xl md:text-5xl">{title}</h1>
        </div>
      </header>
      <div className="container-site max-w-3xl py-14 md:py-20">
        <p className="border-l-2 border-accent bg-cream px-4 py-3 text-sm text-slate">
          Starter copy for legal review before launch. This page is not a statement of regulatory compliance.
        </p>
        <div className="mt-10 space-y-10 text-[15px] leading-7 text-slate [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-navy [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
        {hasEmail() || hasPhone() ? (
          <p className="mt-12 border-t border-navy/10 pt-6 text-sm text-slate">
            Questions about this page:{' '}
            {hasEmail() ? (
              <a href={`mailto:${company.email}`} className="font-semibold text-navy underline-offset-4 hover:underline">
                {company.email}
              </a>
            ) : (
              <span className="font-semibold text-navy">{company.phone}</span>
            )}
          </p>
        ) : null}
      </div>
    </article>
  )
}
