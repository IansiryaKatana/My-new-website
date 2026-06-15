import demosConfig from '../../demos.config.json'

export function getDemoBySlug(slug: string) {
  return demosConfig.demos.find((demo) => demo.slug === slug)
}

export function demoPreviewPath(slug: string) {
  return `/demos/${slug}/`
}

export function isDemoPreviewPath(href: string) {
  return href.startsWith('/demos/')
}

export function getConfiguredDemoSlugs() {
  return demosConfig.demos.map((demo) => demo.slug)
}
