import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'

import { LiveDemosCarousel } from '../live-demos/LiveDemosCarousel'
import { useProjects } from '../../contexts/CmsContext'
import { getLiveDemoProjects } from '../../lib/cms/queries'

export function LiveDemosSection() {
  const projects = useProjects()
  const liveDemos = getLiveDemoProjects(projects)

  useEffect(() => {
    if (typeof window === 'undefined' || window.location.hash !== '#live-demos') return

    const frame = window.requestAnimationFrame(() => {
      document.getElementById('live-demos')?.scrollIntoView({ behavior: 'smooth' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  if (liveDemos.length === 0) return null

  return (
    <section
      id="live-demos"
      className="bg-[#10140D] px-6 py-20 text-[#D8D7C3] sm:px-10 lg:px-16"
      aria-labelledby="live-demos-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="live-demos-heading"
          className="font-display text-4xl font-black uppercase leading-[0.9] text-white sm:text-5xl lg:text-6xl"
        >
          Live demos
        </h2>
        <Link
          to="/live-demos"
          className="font-display text-sm font-black uppercase tracking-[0.12em] text-[#D8D7C3]/75 transition-colors hover:text-white"
        >
          View all
          <span aria-hidden="true" className="ml-2">
            ↗
          </span>
        </Link>
      </div>

      <div className="mt-10">
        <LiveDemosCarousel projects={liveDemos} variant="featured" />
      </div>
    </section>
  )
}
