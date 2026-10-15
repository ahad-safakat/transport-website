export function IndiaMap() {
  return (
    <div className="relative overflow-hidden bg-navy p-6 text-white md:p-8">
      <img
        src="/images/coverage-highway.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-charcoal/80" />
      <div className="relative">
        <p className="eyebrow">India-focused movement</p>
        <p className="mt-3 max-w-sm text-lg font-bold tracking-tight">
          Route confirmation happens with your enquiry — not as a public live map.
        </p>
        <svg viewBox="0 0 200 240" className="mx-auto mt-6 h-64 w-auto text-white/80" aria-hidden="true">
          <path
            fill="currentColor"
            fillOpacity="0.12"
            stroke="#F28C28"
            strokeWidth="1.4"
            d="M108 12c6 4 14 8 16 16 3 9-2 16 2 24 4 8 12 8 14 16 3 9-4 14-2 22 2 8 10 10 10 18s-10 12-10 20c0 10 8 12 6 20-2 9-12 10-16 16-4 7 0 16-6 20-7 5-16 2-22 8-5 6-4 16-12 18-9 3-16-6-24-6-9 0-14 8-22 6-9-2-10-12-12-20-2-8 4-14 2-22-2-8-10-10-10-18 0-9 10-12 12-20 2-8-4-14 0-22 4-8 14-8 18-16 4-7-2-16 4-22 6-6 16-2 22-8 5-5 4-14 12-16 6-2 12 4 18 6z"
          />
          <circle cx="96" cy="88" r="3.5" fill="#F28C28" />
          <circle cx="118" cy="130" r="3.5" fill="#F28C28" />
          <circle cx="78" cy="150" r="3.5" fill="#F28C28" />
          <path d="M96 88c12 14 8 28 22 42M96 88c-10 22-6 40-18 62" stroke="#F28C28" strokeDasharray="3 4" />
        </svg>
        <p className="mt-2 text-xs leading-5 text-white/55">
          Decorative coverage visual only. No live vehicle positions are shown. Add confirmed regions in
          company configuration when they are verified.
        </p>
      </div>
    </div>
  )
}
