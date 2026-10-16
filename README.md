# Transportation company website

Public website for a point-to-point freight transportation business in India. It is built to generate qualified enquiries through a quote form, WhatsApp click-to-chat, and a scripted transportation assistant.

It is **not** a driver-management, booking, or tracking platform. Warehousing, storage, fleet size, statistics, reviews, and unconfirmed coverage are intentionally not claimed anywhere.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · React Router · Framer Motion · Lucide · Vitest

```
src/
  config/company.ts      ← company details, services, vehicle types, regions, nav (edit this first)
  config/content.ts      ← all marketing copy (headlines, mission, values, process steps)
  components/sections/   ← Hero, About, Services, WhyChooseUs, HowItWorks, Coverage, QuoteForm, Contact
  components/widgets/    ← ChatWidget, WhatsAppButton
  chatbot/engine.ts      ← scripted assistant (pure function, swappable for an AI backend later)
  lib/quoteValidation.ts ← validation shared by browser and server
server/quoteHandler.ts   ← enquiry validation, spam checks, rate limit, Resend email
api/quote.ts             ← Vercel serverless function (POST /api/quote)
```

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:5173 (includes `POST /api/quote`) |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build at http://localhost:4173 (includes `POST /api/quote`) |
| `npm test` | Unit tests: chatbot intents and quote flow, validation, WhatsApp links, server handler |
| `npm run lint` | Lint with oxlint |

## 1. Company details — `src/config/company.ts`

| Field | Current value | Notes |
| --- | --- | --- |
| `name`, `nameLocal` | Hindustan Transport / ಹಿಂದೂಸ್ತಾನ್ ಟ್ರಾನ್ಸ್ ಪೋರ್ಟ್ | From the visiting card. Kannada name shows under the logo and in the footer |
| `tagline` | Logistics, Transport Contractors & Commission Agents | From the visiting card |
| `gstin` | 29ELBPR2283E1ZX | Top bar, About facts, Contact, footer, structured data |
| `officeAddress`, `postalAddress` | 1st Floor, City Neralu Building, NH 66, Hosabettu, Mangaluru 575019 | `postalAddress` feeds search-engine structured data |
| `legalName` | placeholder | Hidden until set |
| `whatsappNumber` | `917090134162` | Digits only, `91` + 10-digit number, no `+` or spaces |
| `phone`, `phones` | +91 97415 19252 (+3 more) | `phone` is used for Call buttons; `phones` lists all four card numbers |
| `email` | `ahadsafakat@gmail.com` | **Not on the visiting card** — replace with the company’s business email before launch |
| `instagramUrl`, `linkedinUrl` | empty | Hidden until set |
| `websiteDomain` | empty | e.g. `https://www.example.in` — enables canonical URLs, absolute OG images, structured data |
| `logoSrc`, `faviconSrc` | `/logo.png`, `/favicon.png` | Original HT mark cut from the visiting card (white + gold, made for dark backgrounds). Replace with a high-resolution original file when available; `apple-touch-icon.png` and `icon-512.png` are generated from it |

Also in this file:

- **`services`** — set `enabled: true` only for services the company confirms. Part-load is off by default.
- **`vehicleTypes`** — match the company’s real fleet or sourcing capability. Keep “Other / Not Sure”.
- **`serviceableRegions`** — add confirmed cities/states/routes with `confirmed: true`. Until then the Coverage section and chatbot say routes are confirmed per enquiry.

Placeholder (`[...]`) and empty values are hidden in the UI, never shown as facts. Changing the name or WhatsApp number updates every section, the chatbot, the floating button, and the footer.

## 2. Email delivery for enquiries (Resend)

1. Create an account at https://resend.com and verify your sending domain.
2. Copy `.env.example` to `.env` (never commit `.env`) and fill in:

```
RESEND_API_KEY=re_xxx
QUOTE_NOTIFICATION_EMAIL=enquiries@yourdomain.in        # comma-separate for several inboxes
QUOTE_FROM_EMAIL=Website Enquiries <quotes@yourdomain.in>
```

3. Restart `npm run dev` / `npm run preview`.

Without these variables the API returns `503 EMAIL_NOT_CONFIGURED`. The form keeps the visitor’s details, explains the problem, and offers **Review and continue on WhatsApp**. A success message is shown **only** after Resend accepts the email. Enquiry emails set `reply_to` to the customer’s email when given.

Server-side protections: validation of every field, control-character stripping, a hidden honeypot field, a minimum fill-time check, a 32 KB body limit, and a per-IP limit of 6 enquiries per 10 minutes (in-memory, per server instance).

## 3. WhatsApp

Links use the official format `https://wa.me/917090134162?text=<URL-encoded message>`. WhatsApp never sends anything automatically — the visitor reviews the prefilled message in WhatsApp and presses send. If `whatsappNumber` is invalid or empty, all WhatsApp buttons are hidden.

## 4. Deploy (Vercel, recommended)

1. Push this repository to GitHub and import it at https://vercel.com/new (framework preset: Vite).
2. In **Settings → Environment Variables** add `RESEND_API_KEY`, `QUOTE_NOTIFICATION_EMAIL`, `QUOTE_FROM_EMAIL`, and `GEMINI_API_KEY` for the AI chat assistant.
3. Deploy. `vercel.json` routes `/api/quote` and `/api/chat` to their functions in `api/` and all other paths to the SPA.
4. Before launch, run `npx vercel dev` locally or submit a test enquiry on the preview deployment to confirm the function and email work end to end.

Any other Node host works too: `npm run build`, then serve `dist/` with an SPA fallback to `index.html` and run `api/quote.ts` (or `processQuoteSubmission` from `server/quoteHandler.ts`) behind `POST /api/quote`.

### Custom domain

1. Vercel → Project → **Settings → Domains** → add `www.yourdomain.in` and `yourdomain.in`.
2. At your registrar add the DNS records Vercel shows (typically an `A` record for the apex and a `CNAME` for `www`). HTTPS is issued automatically.
3. Set `websiteDomain` in `src/config/company.ts`, and replace `https://www.example.com` in `public/sitemap.xml` and the `Sitemap:` line in `public/robots.txt` with the real domain. Redeploy.

## Chatbot

A scripted engine (`src/chatbot/engine.ts`) with an optional Google Gemini assistant. The scripted part handles the four quick replies, a guided quote (pickup → destination → vehicle → cargo → optional date, then summary), and common free-text questions (services, routes, vehicles, contact, how to quote, availability/pricing). It never states prices, delivery times, availability, drivers, tracking, or confirmed routes, and it says it is automated. Type “cancel” to restart a quote. “Continue to Quote Form” copies the details into the form; “Continue on WhatsApp” shows a button that opens a prefilled chat.

**AI answers (Google Gemini).** Set `GEMINI_API_KEY` in `.env` (and in Vercel), then restart `npm run dev`. Free-text questions are sent to `POST /api/chat` (`server/chatHandler.ts`), which calls the Gemini API with a system prompt built from `src/config/company.ts` and `src/config/content.ts` — edit those files and the assistant learns the change. The quote steps, route detection, quick replies and WhatsApp hand-off stay scripted. If the key is missing or Gemini fails, the scripted answer is shown instead. Limits: 30 messages per visitor per 10 minutes, last 12 messages of history, about 80-word replies. Optional `GEMINI_MODEL` overrides the default `gemini-flash-latest`. The key is never sent to the browser — never prefix it with `VITE_`.

## Testing results

Verified on this build:

- `npm run build`, `npm run lint` — pass, no warnings.
- `npm test` — 48 tests pass (chatbot routing, GST and partner intents and quote flow, date parsing, form/contact validation, WhatsApp URL encoding with the configured number, server handler: invalid input, missing email config → 503, provider failure, success only after provider accepts, honeypot, fast-fill rejection, rate limit, partner enquiries).
- `npm run preview` + HTTP checks — home, `/privacy` (SPA fallback), images return 200; `GET /api/quote` → 405; malformed JSON → 400; valid enquiry without credentials → 503 `EMAIL_NOT_CONFIGURED`.
- Headless Chrome screenshots at 360 px, 390 px, and 1440 px — no horizontal overflow, mobile menu/hero/forms/timeline lay out correctly, floating buttons do not overlap each other.

**Not verified (needs credentials or a live deployment):** real email delivery through Resend, and the Vercel function runtime (`api/quote.ts` imports TypeScript files with `.ts` extensions; confirm with `vercel dev` or a preview deployment).

## Known limitations

- Rate limiting is in-memory per server instance. For heavy spam use Vercel Firewall or a shared store (e.g. Upstash).
- Hero, About, and Full Truckload photos show non-Indian trucks with visible third-party branding. Replace them with the company’s own vehicle photography when available.
- `/privacy` and `/terms` are starter copy for legal review; they claim no registration, insurance, or compliance.
- Page meta tags are updated client-side; social preview crawlers read the defaults in `index.html` (update those once the name and domain are final).

## Photography credits

Photos of Hindustan Transport trucks (`hero-truck.jpg` and the five `service-*.jpg` card images) were supplied by the company. The remaining images are from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license) (free commercial use, no attribution required — credited here as courtesy).

| File | Source |
| --- | --- |
| `coverage-highway.jpg` | https://unsplash.com/photos/nweJJ3DKwnw |
| `partner-truck.jpg` | https://unsplash.com/photos/vqonZik8jbU |
| `about-truck.jpg` | Unsplash (added in the initial setup) |
