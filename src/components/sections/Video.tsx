import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, Pause, Play, Truck, Volume2, VolumeX } from 'lucide-react'
import { videoCopy } from '../../config/content'
import { useQuotePrefill } from '../../context/quotePrefill'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function Video() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { requestQuote } = useQuotePrefill()
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [missing, setMissing] = useState(false)

  const play = useCallback(() => {
    const el = videoRef.current
    if (!el || missing) return
    void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [missing])

  const pause = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    el.pause()
    setPlaying(false)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          pause()
          return
        }
        if (!reduce) play()
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [pause, play])

  function togglePlay() {
    if (playing) pause()
    else play()
  }

  function toggleMute() {
    const el = videoRef.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
  }

  return (
    <section id="film" className="section-pad bg-cream">
      <div className="container-site">
        <Reveal>
          <SectionHeading eyebrow={videoCopy.eyebrow} title={videoCopy.heading} intro={videoCopy.intro} />
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-12 max-w-4xl">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-navy shadow-[0_40px_80px_-40px_rgba(10,10,10,0.7)] ring-1 ring-navy/10">
            <div className="relative aspect-[4/5] sm:aspect-[16/10]">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster={videoCopy.poster}
                src={videoCopy.src}
                muted
                loop
                playsInline
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onError={() => {
                  setMissing(true)
                  setPlaying(false)
                }}
                aria-label={videoCopy.heading}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-navy/10"
                aria-hidden="true"
              />

              <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-3 sm:top-5 sm:left-5 sm:right-5">
                <p className="inline-flex items-center gap-2 rounded-full bg-navy/70 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.16em] text-white uppercase backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-red-500/70" />
                    <span className="relative h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  {videoCopy.badge}
                </p>
                <div className="flex gap-2">
                  <ControlButton
                    label={muted ? 'Unmute video' : 'Mute video'}
                    onClick={toggleMute}
                    disabled={missing}
                  >
                    {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </ControlButton>
                  <ControlButton
                    label={playing ? 'Pause video' : 'Play video'}
                    onClick={togglePlay}
                    disabled={missing}
                  >
                    {playing ? <Pause size={16} /> : <Play size={16} />}
                  </ControlButton>
                </div>
              </div>

              <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-5 sm:bottom-5">
                <div className="rounded-2xl bg-navy/88 p-5 text-white shadow-lift backdrop-blur-md sm:p-6">
                  <p className="flex items-start gap-3 text-lg font-extrabold tracking-tight sm:text-2xl">
                    <Truck size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    {videoCopy.overlayTitle}
                  </p>
                  <Button
                    className="mt-5"
                    href="/#quote"
                    onClick={(event) => {
                      event.preventDefault()
                      requestQuote()
                    }}
                  >
                    {videoCopy.cta}
                    <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="dark-focus grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-navy/55 text-white backdrop-blur-md transition-colors hover:bg-navy/80 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}
