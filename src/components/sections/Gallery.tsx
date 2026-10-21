import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Camera, ChevronRight } from 'lucide-react'
import { galleryCopy, gallerySlides } from '../../config/content'
import { MediaFrame } from '../ui/MediaFrame'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const pad = (value: number) => String(value).padStart(2, '0')

export function Gallery() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const total = gallerySlides.length
  const slide = gallerySlides[index]
  const counter = `${pad(index + 1)} / ${pad(total)}`

  function next() {
    setIndex((current) => (current + 1) % total)
  }

  return (
    <section id="gallery" className="section-pad bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading eyebrow={galleryCopy.eyebrow} title={galleryCopy.heading} intro={galleryCopy.intro} />
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-14 max-w-5xl">
          <MediaFrame>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-navy shadow-[0_40px_80px_-40px_rgba(10,10,10,0.7)] ring-1 ring-navy/10">
            <div className="relative aspect-[4/5] sm:aspect-[16/10]">
              {gallerySlides.map((item, itemIndex) => (
                <div
                  key={item.src}
                  className={`absolute inset-0 ${reduce ? '' : 'transition-opacity duration-500'} ${
                    itemIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden={itemIndex !== index}
                >
                  {/* Blurred fill so portrait photos show in full without empty bars. */}
                  <img
                    src={item.src}
                    alt=""
                    className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-75"
                    loading={itemIndex === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <img
                    src={item.src}
                    alt={itemIndex === index ? item.alt : ''}
                    className="absolute inset-0 h-full w-full object-contain"
                    loading={itemIndex === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </div>
              ))}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-navy/10"
                aria-hidden="true"
              />

              <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-3 sm:top-5 sm:left-5 sm:right-5">
                <p className="inline-flex items-center gap-2 rounded-full bg-navy/70 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.16em] text-white uppercase backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
                    <span className="relative h-2 w-2 rounded-full bg-accent" />
                  </span>
                  {galleryCopy.badge}
                  <span className="tracking-normal text-white/70">{counter}</span>
                </p>
              </div>

              <button
                type="button"
                aria-label={galleryCopy.nextLabel}
                onClick={next}
                className="dark-focus absolute top-1/2 right-3 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-navy/70 text-white shadow-lift backdrop-blur-md transition-colors hover:bg-accent hover:text-navy sm:right-5 sm:h-14 sm:w-14"
              >
                <ChevronRight size={28} aria-hidden="true" />
              </button>
            </div>

            {/* Below the photo on phones so it stays visible; overlaid from sm up. */}
            <div className="relative z-10 -mt-4 px-3 pb-3 sm:absolute sm:inset-x-5 sm:bottom-5 sm:mt-0 sm:px-0 sm:pb-0">
              <div className="rounded-2xl bg-navy/88 p-5 text-white shadow-lift backdrop-blur-md sm:max-w-[calc(100%-4.5rem)] sm:p-6">
                <p className="flex items-start gap-3 text-base font-extrabold tracking-tight sm:text-xl" aria-live="polite">
                  <Camera size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  {slide.alt}
                </p>
                <div className="mt-4 flex gap-1.5 pl-8" aria-hidden="true">
                  {gallerySlides.map((item, itemIndex) => (
                    <span
                      key={item.src}
                      className={`h-1 flex-1 rounded-full ${reduce ? '' : 'transition-colors duration-300'} ${
                        itemIndex <= index ? 'bg-accent' : 'bg-white/15'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          </MediaFrame>
        </Reveal>

        <Reveal delay={0.14} className="mx-auto mt-10 max-w-5xl">
          <ul className="grid grid-cols-7 gap-2 sm:gap-3" aria-label="Choose a photo">
            {gallerySlides.map((item, itemIndex) => {
              const active = itemIndex === index
              return (
                <li key={item.src}>
                  <button
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    aria-label={`Show photo ${itemIndex + 1}: ${item.alt}`}
                    aria-current={active ? 'true' : undefined}
                    className={`group relative block aspect-square w-full overflow-hidden rounded-lg bg-navy ring-offset-2 transition sm:aspect-[4/3] sm:rounded-xl ${
                      active ? 'ring-2 ring-accent' : 'ring-1 ring-navy/10 hover:ring-navy/30'
                    }`}
                  >
                    <img
                      src={item.src}
                      alt=""
                      className={`h-full w-full object-cover transition ${
                        active ? 'opacity-100' : 'opacity-55 group-hover:opacity-90'
                      } ${reduce ? '' : 'duration-300 group-hover:scale-105'}`}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute bottom-1 left-1 hidden rounded bg-navy/75 px-1.5 py-0.5 text-[10px] font-bold text-white sm:block">
                      {pad(itemIndex + 1)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
