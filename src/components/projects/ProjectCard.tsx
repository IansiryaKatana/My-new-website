import { Link } from '@tanstack/react-router'
import type { Project } from '../../data/projects'
import { BEHANCE_COVER_ASPECT_CLASS } from '../../lib/media'
import { resolveProjectHref } from '../../lib/projectLinks'
import { textCopySm } from '../../lib/typography'

type ProjectCardProps = {
  project: Project
  invert?: boolean
  showImage?: boolean
}

function cardPreviewImage(project: Project) {
  return (
    project.featuredImageUrl ??
    project.thumbnailUrls?.[0] ??
    project.coverImageUrl
  )
}

export function ProjectCard({ project, invert = false, showImage = true }: ProjectCardProps) {
  const surface = invert
    ? 'border-[#11140F]/15 bg-[#D8D7C3] text-[#11140F] hover:border-[#11140F]/40'
    : 'border-[#D8D7C3]/15 bg-[#171B14] text-[#D8D7C3] hover:border-[#D8D7C3]/40'

  const preview = showImage ? cardPreviewImage(project) : null
  const referenceLink = resolveProjectHref(project.href)

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden border transition-colors duration-300 ${surface}`}
    >
      {preview ? (
        <Link to="/portfolio/$slug" params={{ slug: project.slug }} className="block overflow-hidden bg-[#10140D]">
          <img
            src={preview}
            alt=""
            className={`${BEHANCE_COVER_ASPECT_CLASS} w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]`}
            loading="lazy"
          />
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <p className="font-display text-xs font-black uppercase tracking-[0.18em] opacity-70">
            {project.year}
          </p>
          <p className="font-display text-xs font-black uppercase tracking-[0.18em] opacity-70">
            {project.role}
          </p>
        </div>

        <h3 className="mt-6 font-display text-3xl font-black uppercase leading-[0.9] sm:text-4xl">
          <Link
            to="/portfolio/$slug"
            params={{ slug: project.slug }}
            className="transition-colors group-hover:opacity-80"
          >
            {project.title}
          </Link>
        </h3>

        <p className={`mt-4 flex-1 ${textCopySm} opacity-80`}>{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full border px-3 py-1 font-display text-[0.65rem] font-black uppercase tracking-[0.12em] ${
                invert
                  ? 'border-[#11140F]/20 text-[#11140F]'
                  : 'border-[#D8D7C3]/25 text-[#D8D7C3]'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/portfolio/$slug"
            params={{ slug: project.slug }}
            className={`inline-flex items-center font-display text-sm font-black uppercase transition-[color,transform] duration-300 group-hover:translate-x-1 ${
              invert ? 'group-hover:text-[#765F47]' : 'group-hover:text-white'
            }`}
          >
            View case study
            <span aria-hidden="true" className="ml-3">
              ↗
            </span>
          </Link>
          {referenceLink ? (
            referenceLink.isExternal ? (
              <a
                href={referenceLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-display text-xs font-black uppercase tracking-[0.12em] opacity-70 transition-opacity hover:opacity-100 ${
                  invert ? 'hover:text-[#765F47]' : 'hover:text-white'
                }`}
              >
                Live site ↗
              </a>
            ) : (
              <a
                href={referenceLink.href}
                className={`font-display text-xs font-black uppercase tracking-[0.12em] opacity-70 transition-opacity hover:opacity-100 ${
                  invert ? 'hover:text-[#765F47]' : 'hover:text-white'
                }`}
              >
                {referenceLink.kind === 'demo' ? 'Launch demo →' : 'View project →'}
              </a>
            )
          ) : null}
        </div>
      </div>
    </article>
  )
}
