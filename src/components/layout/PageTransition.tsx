import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '../../lib/utils'

type PageThemeColor = '#10140D' | '#D8D7C3' | '#34392E'

function themeForPath(pathname: string): PageThemeColor {
  if (pathname.startsWith('/certifications')) return '#D8D7C3'
  return '#10140D'
}

type PageTransitionProps = {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [washActive, setWashActive] = useState(false)
  const previousPath = useRef(pathname)
  const fromColor = useRef<PageThemeColor>(themeForPath(pathname))
  const toColor = useRef<PageThemeColor>(themeForPath(pathname))

  useEffect(() => {
    if (pathname === previousPath.current) return

    fromColor.current = themeForPath(previousPath.current)
    toColor.current = themeForPath(pathname)
    previousPath.current = pathname
    setWashActive(true)

    const timer = window.setTimeout(() => {
      setWashActive(false)
    }, 420)

    return () => window.clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none fixed inset-0 z-[60] transition-opacity duration-[420ms] ease-out',
          washActive ? 'opacity-90' : 'opacity-0',
        )}
        style={{
          background: `linear-gradient(125deg, ${fromColor.current} 0%, ${toColor.current} 48%, #003B36 100%)`,
        }}
      />

      <div key={pathname} className="page-transition-enter">
        {children}
      </div>
    </>
  )
}
