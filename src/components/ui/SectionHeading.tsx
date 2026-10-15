type Props = {
  eyebrow?: string
  title: string
  intro?: string
  light?: boolean
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, intro, light = false, align = 'left' }: Props) {
  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2
        className={`display-title text-3xl sm:text-4xl md:text-[2.75rem] ${light ? 'text-white' : 'text-navy'}`}
      >
        {title}
      </h2>
      {intro ? (
        <p className={`mt-5 text-base leading-7 md:text-lg ${light ? 'text-white/75' : 'text-slate'}`}>
          {intro}
        </p>
      ) : null}
    </div>
  )
}
