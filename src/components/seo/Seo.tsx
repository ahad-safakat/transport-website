import { useEffect } from 'react'
import { company, siteOrigin } from '../../config/company'
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
    setMeta('og:type', 'website', 'property')
    setMeta('twitter:card', 'summary_large_image')
    if (canonical) {
      setLink('canonical', canonical)
      setMeta('og:url', canonical, 'property')
    }
  }, [fullTitle, desc, canonical])

  const jsonLd = origin && !company.name.includes('[')
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: company.name,
        description: desc,
        url: origin,
        telephone: company.phone || undefined,
        email: company.email || undefined,
        address: company.officeAddress.includes('[')
          ? undefined
          : {
              '@type': 'PostalAddress',
              streetAddress: company.officeAddress,
            },
      }
    : null

  return jsonLd ? (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  ) : null
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}
