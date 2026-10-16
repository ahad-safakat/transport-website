import { useEffect } from 'react'
import {
  allPhones,
  company,
  confirmedRegions,
  hasAddress,
  hasEmail,
  hasGstin,
  hasPhone,
  hasSocial,
  isPlaceholder,
  siteOrigin,
} from '../../config/company'
import { siteDescription, siteTitle } from '../../config/content'

type Props = {
  title?: string
  description?: string
  path?: string
}

export function Seo({ title, description, path = '/' }: Props) {
  const fullTitle = title ?? siteTitle
  const desc = description ?? siteDescription
  const origin = siteOrigin()
  const canonical = origin ? `${origin}${path}` : undefined

  useEffect(() => {
    document.title = fullTitle
    setMeta('description', desc)
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', desc, 'property')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', desc)
    if (!isPlaceholder(company.name)) setMeta('og:site_name', company.name, 'property')
    if (canonical) {
      setLink('canonical', canonical)
      setMeta('og:url', canonical, 'property')
      setMeta('og:image', `${origin}/images/hero-truck.jpg`, 'property')
      setMeta('twitter:image', `${origin}/images/hero-truck.jpg`)
    }
  }, [fullTitle, desc, canonical, origin])

  // Structured data only from verified, configured facts — no ratings, reviews, or invented details.
  const jsonLd =
    origin && !isPlaceholder(company.name)
      ? {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          alternateName: company.nameLocal || undefined,
          taxID: hasGstin() ? company.gstin : undefined,
          name: company.name,
          description: siteDescription,
          url: origin,
          logo: `${origin}${company.logoSrc}`,
          telephone: hasPhone() ? allPhones() : undefined,
          email: hasEmail() ? company.email : undefined,
          address: hasAddress()
            ? {
                '@type': 'PostalAddress',
                streetAddress: company.postalAddress.street,
                addressLocality: company.postalAddress.locality,
                addressRegion: company.postalAddress.region,
                postalCode: company.postalAddress.postalCode,
                addressCountry: 'IN',
              }
            : undefined,
          areaServed: confirmedRegions.length > 0 ? confirmedRegions.map((region) => region.label) : undefined,
          sameAs: [company.linkedinUrl, company.instagramUrl].filter(hasSocial),
        }
      : null

  return jsonLd && path === '/' ? (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  ) : null
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}
