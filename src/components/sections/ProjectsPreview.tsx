import { useProjects } from '../../contexts/CmsContext'
import { getFeaturedProjects } from '../../lib/cms/queries'
import { getMarketingSection, useMarketingPage } from '../../lib/cms/useMarketingPage'
import { ProjectCard } from '../projects/ProjectCard'
import { SectionHeading } from '../layout/SectionHeading'

type WorkPreviewSection = {
  eyebrow: string
  title: string
  description: string
  actionLabel: string
  actionTo: string
}

export function ProjectsPreview() {
  const projects = useProjects()
  const featured = getFeaturedProjects(projects)
  const homePage = useMarketingPage('home')
  const section = getMarketingSection<WorkPreviewSection>(homePage, 'workPreview', {
    eyebrow: 'Selected work',
    title: 'Projects built for scale, clarity and craft',
    description:
      'A sample of full stack engagements spanning commerce, design systems, analytics, and platform APIs.',
    actionLabel: 'All projects',
    actionTo: '/portfolio',
  })

  return (
    <section
      id="work"
      className="bg-[#D8D7C3] px-6 py-20 text-[#11140F] sm:px-10 lg:px-16"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          action={{ label: section.actionLabel, to: section.actionTo }}
          invert
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} invert showImage={false} />
          ))}
        </div>
      </div>
    </section>
  )
}
