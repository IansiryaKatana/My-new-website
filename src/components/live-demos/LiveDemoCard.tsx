import type { Project } from '../../data/projects'
import { resolveProjectHref } from '../../lib/projectLinks'
import { textCopySm } from '../../lib/typography'
import { cn } from '../../lib/utils'

type LiveDemoCardProps = {
  project: Project
  className?: string
}

export function LiveDemoCard({ project, className }: LiveDemoCardProps) {
  const link = resolveProjectHref(project.href)
  if (!link || !project.coverImageUrl) return null

  const label = `Launch ${project.title} live demo`

  return (
    <a
      href={link.href}
      aria-label={label}
      className={cn(
        'group relative block aspect-[808/632] shrink-0 snap-start overflow-hidden bg-[#171B14]',
        className,
      )}
    >
      <img
        src={project.coverImageUrl}
        alt=""
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        loading="lazy"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-10 h-12 w-12 bg-white sm:h-14 sm:w-14"
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
        <h3 className="font-display text-3xl font-black uppercase leading-[0.9] text-white sm:text-4xl">
          {project.title}
        </h3>
        {project.summary ? (
          <p className={cn('mt-2 line-clamp-2 text-white/85', textCopySm)}>
            {project.summary}
          </p>
        ) : null}
      </div>
    </a>
  )
}
