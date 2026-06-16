import { useState } from 'react'

import type { Project } from '../../data/projects'
import { cn } from '../../lib/utils'
import { ShowMoreControls } from '../ui/ShowMoreControls'

import { LiveDemoCard } from './LiveDemoCard'
import { LiveDemosCarousel } from './LiveDemosCarousel'

type LiveDemosDisplayProps = {
  projects: Project[]
  batchSize?: number
  className?: string
}

export function LiveDemosDisplay({
  projects,
  batchSize = 3,
  className,
}: LiveDemosDisplayProps) {
  const [visibleCount, setVisibleCount] = useState(batchSize)
  const visibleProjects = projects.slice(0, visibleCount)

  if (projects.length === 0) return null

  return (
    <div className={cn('grid gap-10', className)}>
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
        {visibleProjects.map((project) => (
          <LiveDemoCard key={project.slug} project={project} className="w-full" />
        ))}
      </div>

      <div className="lg:hidden">
        <LiveDemosCarousel projects={visibleProjects} variant="featured" />
      </div>

      <ShowMoreControls
        visibleCount={visibleCount}
        totalCount={projects.length}
        batchSize={batchSize}
        onShowMore={() => setVisibleCount((count) => Math.min(count + batchSize, projects.length))}
        onShowLess={() => setVisibleCount(batchSize)}
      />
    </div>
  )
}
