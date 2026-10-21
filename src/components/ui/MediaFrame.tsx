import type { ReactNode } from 'react'

const corner = 'absolute h-6 w-6 border-accent sm:h-9 sm:w-9'

/** Offset outline and corner brackets drawn around a media card. */
export function MediaFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-2.5 rounded-[2.1rem] border border-navy/10 sm:-inset-4 sm:rounded-[2.4rem]"
        aria-hidden="true"
      >
        <span className={`${corner} -top-px -left-px rounded-tl-[2.1rem] border-t-2 border-l-2 sm:rounded-tl-[2.4rem]`} />
        <span className={`${corner} -top-px -right-px rounded-tr-[2.1rem] border-t-2 border-r-2 sm:rounded-tr-[2.4rem]`} />
        <span className={`${corner} -bottom-px -left-px rounded-bl-[2.1rem] border-b-2 border-l-2 sm:rounded-bl-[2.4rem]`} />
        <span className={`${corner} -right-px -bottom-px rounded-br-[2.1rem] border-r-2 border-b-2 sm:rounded-br-[2.4rem]`} />
      </div>
      {children}
    </div>
  )
}
