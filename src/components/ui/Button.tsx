import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'whatsapp'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  href?: string
  external?: boolean
  children: ReactNode
}

const styles: Record<Variant, string> = {
  primary:
    'btn-shine bg-accent text-navy hover:bg-accent-dark border-transparent shadow-[0_10px_30px_-10px_rgba(255,194,26,0.7)] hover:-translate-y-px',
  secondary: 'bg-white/5 text-white border-white/35 backdrop-blur-sm hover:border-white hover:bg-white/15',
  ghost: 'bg-transparent text-navy border-navy/20 hover:border-navy hover:bg-navy hover:text-white',
  light: 'bg-white text-navy border-transparent hover:bg-cream',
  whatsapp: 'bg-[#1FA855] text-white border-transparent hover:bg-[#178a45]',
}

const shared =
  'group/btn inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-60'

export function Button({ variant = 'primary', href, external, className = '', children, ...props }: Props) {
  const cls = `${shared} ${styles[variant]} ${className}`
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={props.onClick as unknown as MouseEventHandler<HTMLAnchorElement>}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  )
}
