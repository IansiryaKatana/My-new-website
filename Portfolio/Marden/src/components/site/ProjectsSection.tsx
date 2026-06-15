import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCms } from '#/contexts/CmsContext'
import type { CmsProject } from '#/lib/cms/types'
import { CTAButton } from './CTAButton'

gsap.registerPlugin(ScrollTrigger)

export function ProjectsSection() {
  const { snapshot } = useCms()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [snapshot])

  if (!snapshot) return null
  const { projects, projectsSection } = snapshot
  const stacked = projects.filter((p) => p.layout === 'stacked')
  const featured = projects.find((p) => p.layout === 'featured') ?? projects[projects.length - 1]

  return (
    <section id="projects" ref={ref} className="bg-white section-pad">
      <div className="max-editorial">
        <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
          {projectsSection.eyebrow && (
            <p className="text-[11px] uppercase tracking-widest text-verden-muted">
              {projectsSection.eyebrow}
            </p>
          )}
          <div className="md:text-right">
            {projectsSection.heading && (
              <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-normal tracking-[-0.035em] text-verden-deep">
                {projectsSection.heading}
              </h2>
            )}
            {projectsSection.body && (
              <p className="mt-3 text-xs leading-relaxed text-verden-muted md:ml-auto md:max-w-md">
                {projectsSection.body}
              </p>
            )}
          </div>
        </div>

        <div className="grid min-h-[420px] gap-3 md:grid-cols-[0.8fr_1.6fr] md:min-h-[520px]">
          <div className="flex flex-col gap-3">
            {stacked.map((project) => (
              <ProjectCard key={project.id} project={project} tall={false} />
            ))}
          </div>
          {featured && <ProjectCard project={featured} tall />}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, tall }: { project: CmsProject; tall?: boolean }) {
  return (
    <article
      className={`project-card group relative overflow-hidden rounded-[4px] ${tall ? 'min-h-[280px] md:min-h-full' : 'min-h-[200px] flex-1'}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center image-cinematic transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ backgroundImage: `url(${project.image_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="relative flex h-full flex-col justify-between p-4 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/70">{project.category}</p>
            <h3 className="mt-1 text-sm font-normal tracking-tight">{project.title}</h3>
          </div>
          {project.phase && (
            <span className="text-[10px] text-white/75">{project.phase}</span>
          )}
        </div>
        <div className="flex items-end justify-between gap-4">
          <p className="max-w-xs text-[10px] leading-relaxed text-white/80">{project.description}</p>
          <CTAButton label={project.cta_label} href={project.cta_url} />
        </div>
      </div>
    </article>
  )
}
