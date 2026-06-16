import { useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const GA_MEASUREMENT_ID = 'G-DHFJ0GMM6N'

export function GoogleAnalyticsPageviews() {
  const locationKey = useRouterState({
    select: (state) => state.location.pathname,
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

    const pagePath = `${window.location.pathname}${window.location.search}${window.location.hash}`

    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
      send_to: GA_MEASUREMENT_ID,
    })
  }, [locationKey])

  return null
}
