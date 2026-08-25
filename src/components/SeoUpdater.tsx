import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { SITE_NAME, SITE_URL, matchRouteSeo } from '@/lib/seo'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function SeoUpdater() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = matchRouteSeo(pathname)
    const title =
      seo.title === SITE_NAME || seo.title.startsWith(SITE_NAME)
        ? seo.title
        : `${seo.title} | ${SITE_NAME}`
    const url = SITE_URL + (pathname === '/' ? '/' : pathname)

    document.title = title
    upsertMeta('name', 'description', seo.description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', seo.description)
    upsertMeta('property', 'og:url', url)
    upsertCanonical(url)
  }, [pathname])

  return null
}
