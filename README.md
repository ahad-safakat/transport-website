# Transportation company website

Premium public website for a point-to-point freight transportation business in India. It is built for qualified enquiries: quote form, WhatsApp click-to-chat, and a scripted transportation assistant.

This is not a driver-management or tracking platform. Warehouse, storage, fleet size, and unverified coverage claims are intentionally omitted.

## Stack

Vite, React, TypeScript, Tailwind CSS, React Router, Framer Motion, Lucide.

## Configure company details

Edit `src/config/company.ts` before launch:

- Company name, tagline, headquarters, office address
- WhatsApp number as digits only with country code, for example `9198XXXXXXXX`
- Telephone and email
- Instagram / LinkedIn URLs
- Production domain (`https://www.yourdomain.com`)
- Enabled services (`enabled: true` only for confirmed offerings)
- Vehicle types actually available to source
- `serviceableRegions` with `confirmed: true` only for verified coverage

Empty or `[PLACEHOLDER]` contact fields are hidden in the UI. Changing the WhatsApp number updates the floating button, chatbot, quote fallback, footer, and contact section.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Production build

```bash
npm run build
npm run preview
```

`npm run preview` also serves `POST /api/quote`.

## Email enquiries

Copy `.env.example` to `.env` (never commit `.env`):

```
RESEND_API_KEY=
QUOTE_NOTIFICATION_EMAIL=
QUOTE_FROM_EMAIL=Website Enquiries <quotes@yourdomain.com>
```

Without these variables the API returns `EMAIL_NOT_CONFIGURED` and the form keeps the customer’s details, then offers WhatsApp if a number is configured. Success is shown only after the server accepts the enquiry.

Resend receives the enquiry payload in order to deliver email. WhatsApp receives details only when the visitor opens the prefilled click-to-chat link.

## WhatsApp

Official link format:

`https://wa.me/9198XXXXXXXX?text=ENCODED_MESSAGE`

The number must include `91` for India, with no plus sign, spaces, or punctuation.

## Chatbot

The assistant is scripted (no AI key required). It can collect pickup, destination, vehicle, cargo, and date, then transfer those values into the quote form or prepare a WhatsApp message. It will not invent prices, ETAs, availability, drivers, or live tracking.

## Deploy

Recommended: [Vercel](https://vercel.com) with this Vite app.

1. Push the repository and import the project.
2. Set `RESEND_API_KEY`, `QUOTE_NOTIFICATION_EMAIL`, and `QUOTE_FROM_EMAIL` as server environment variables.
3. Add the production domain, then set `websiteDomain` in `src/config/company.ts` and update `public/sitemap.xml`.
4. Point DNS A/CNAME records to the host. Serve the site over HTTPS.

`api/quote.ts` is the serverless handler for production. The Vite plugin in `vite.config.ts` provides the same route during `npm run dev` and `npm run preview`.

## Photography

Highway truck photographs in `public/images` are from Unsplash (permitted use). Prefer replacing them with licensed photography of the company’s actual vehicles when available.

## Legal pages

`/privacy` and `/terms` are starter copy. Have them reviewed before launch. They do not claim registration, insurance, or statutory compliance.
