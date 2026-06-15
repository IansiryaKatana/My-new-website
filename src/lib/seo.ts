import { siteConfig } from '../data/site'

type PageMeta = {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}

function resolveImageUrl(image: string) {
  if (/^https?:\/\//i.test(image)) return image
  return `${siteConfig.url}${image.startsWith('/') ? image : `/${image}`}`
}

export function createPageMeta({
  title,
  description,
  path = '',
  image = '/images/ian-cutout.svg',
  type = 'website',
}: PageMeta) {
  const url = `${siteConfig.url}${path}`
  const imageUrl = resolveImageUrl(image)

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    sameAs: Object.values(siteConfig.social),
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location,
    },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.tagline,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
  }
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  }
}

