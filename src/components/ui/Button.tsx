import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  href?: string
  children: ReactNode
}

const styles: Record<Variant, string> = {
  primary:
    'bg-accent text-navy hover:bg-accent-dark border-transparent shadow-[0_8px_24px_rgba(242,140,40,0.28)]',
  secondary:
    'bg-transparent text-white border-white/40 hover:border-white hover:bg-white/10',
  ghost:
    'bg-transparent text-navy border-navy/15 hover:border-accent hover:text-accent',
  light:
    'bg-white text-navy border-transparent hover:bg-cream',
}

const shared =
  'inline-flex items-center justify-center gap-2 rounded-sm border px-5 py-3 text-sm font-semibold tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60'

export function Button({ variant = 'primary', href, className = '', children, ...props }: Props) {
  const cls = `${shared} ${styles[variant]} ${className}`
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
