import { useReducedMotion } from 'framer-motion'

/**
 * Decorative point-to-point route visual. It deliberately shows no real cities, live vehicles, or
 * tracking data — confirmed regions are listed beside it from company configuration.
 * To use an interactive map later, replace this component (and document the map provider's API key setup).
 */
export function RouteVisual() {
  const reduce = useReducedMotion()

  return (
    <figure className="relative isolate overflow-hidden bg-navy text-white">
      <img
        src="/images/coverage-highway.jpg"
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_65%] opacity-35"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy via-navy/85 to-charcoal/70" aria-hidden="true" />

      <div className="p-7 md:p-10">
        <p className="eyebrow eyebrow-on-dark">Point A → Point B</p>
        <p className="mt-3 max-w-sm text-xl font-extrabold tracking-tight md:text-2xl">
          Direct movement between your pickup and your destination.
        </p>

        <svg viewBox="0 0 400 220" className="mt-8 h-auto w-full" role="img" aria-label="Illustration of a route from a pickup point to a destination">
          <defs>
            <pattern id="route-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.12" />
            </pattern>
          </defs>
          <rect width="400" height="220" fill="url(#route-grid)" />
          <path
            id="route-path"
            d="M48 168 C 120 168, 120 60, 200 96 S 300 150, 352 52"
            fill="none"
            stroke="white"
            strokeOpacity="0.18"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M48 168 C 120 168, 120 60, 200 96 S 300 150, 352 52"
            fill="none"
            stroke="#FFC21A"
            strokeWidth="2.5"
            strokeDasharray="6 8"
            strokeLinecap="round"
          >
            {reduce ? null : <animate attributeName="stroke-dashoffset" from="56" to="0" dur="1.6s" repeatCount="indefinite" />}
          </path>
          {reduce ? null : (
            <circle r="5" fill="#FFC21A">
              <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
                <mpath href="#route-path" />
              </animateMotion>
            </circle>
          )}
          <g>
            <circle cx="48" cy="168" r="14" fill="#FFC21A" fillOpacity="0.18" />
            <circle cx="48" cy="168" r="6" fill="#FFC21A" />
            <text x="48" y="202" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" letterSpacing="2">
              PICKUP
            </text>
          </g>
          <g>
            <circle cx="352" cy="52" r="14" fill="white" fillOpacity="0.15" />
            <circle cx="352" cy="52" r="6" fill="white" />
            <text x="352" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" letterSpacing="2">
              DESTINATION
            </text>
          </g>
        </svg>

        <figcaption className="mt-6 border-t border-white/10 pt-4 text-xs leading-5 text-white/55">
          Illustrative only — no live vehicle positions or tracking data are shown. Every route is confirmed by our
          team when you enquire.
        </figcaption>
      </div>
    </figure>
  )
}
