import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { PackageCheck, Pause, Play, Route, Truck, Volume2, VolumeX, Warehouse } from 'lucide-react'
import { videoCopy, videoHighlights } from '../../config/content'
import { MediaFrame } from '../ui/MediaFrame'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const highlightIcons = [Warehouse, Route, PackageCheck]

export function Video() {
  const videoRef = useRef<HTMLVideoElement>(null)
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

        <Reveal delay={0.08} className="mx-auto mt-14 max-w-5xl">
          <MediaFrame>
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
            </div>

            {/* Below the video on phones so it stays visible; overlaid from sm up. */}
            <div className="relative z-10 -mt-4 px-3 pb-3 sm:absolute sm:inset-x-5 sm:bottom-5 sm:mt-0 sm:px-0 sm:pb-0">
              <div className="rounded-2xl bg-navy/88 p-5 text-white shadow-lift backdrop-blur-md sm:p-6">
                <p className="flex items-start gap-3 text-lg font-extrabold tracking-tight sm:text-2xl">
                  <Truck size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  {videoCopy.overlayTitle}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2 pl-[34px]">
                  {videoCopy.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-white/80 uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          </MediaFrame>
        </Reveal>

        <ol className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-3 sm:gap-5">
          {videoHighlights.map((item, index) => {
            const Icon = highlightIcons[index]
            return (
              <Reveal
                key={item.title}
                as="li"
                delay={0.1 + index * 0.06}
                className="relative overflow-hidden border-t-2 border-accent bg-white p-6 shadow-[0_20px_40px_-30px_rgba(10,10,10,0.45)]"
              >
                <span
                  className="pointer-events-none absolute -right-1 -bottom-5 text-7xl font-extrabold tracking-tighter text-navy/[0.05]"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex h-11 w-11 items-center justify-center bg-navy text-accent" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate">{item.text}</p>
              </Reveal>
            )
          })}
        </ol>
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
