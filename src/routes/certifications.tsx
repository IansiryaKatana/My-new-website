import { createFileRoute, Link } from '@tanstack/react-router'

import { JsonLd } from '../components/seo/JsonLd'
import { PageShell } from '../components/layout/PageShell'
import { InquiryTrigger } from '../components/inquiry/InquiryTrigger'
import { buttonVariants } from '../components/ui/button'
import { useCertifications, useEducation } from '../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../lib/cms/useMarketingPage'
import { textCopyBase, textCopySm, textCopySmResponsive } from '../lib/typography'
import { breadcrumbJsonLd, createPageMeta } from '../lib/seo'

export const Route = createFileRoute('/certifications')({
  head: () =>
    createPageMeta({
      title: 'Certifications | Ian Sirya',
      description:
        'Professional certifications across project management, technical SEO, and WordPress development.',
      path: '/certifications',
    }),
  component: CertificationsPage,
})

const defaultSection = {
  eyebrow: 'Certifications',
  title: 'Licenses & credentials',
  description:
    'Professional credentials across project management, technical SEO, and WordPress development.',
}

const defaultEducationSection = {
  eyebrow: 'Education',
  title: 'Academic background',
}

function CertificationsPage() {
  const education = useEducation()
  const certifications = useCertifications()
  const page = useMarketingPage('certifications')
  const aboutPage = useMarketingPage('about')
  const section = getMarketingSection(page, 'hero', defaultSection)
  const educationSection = getMarketingSection(aboutPage, 'education', defaultEducationSection)
  const hasContent = education.length > 0 || certifications.length > 0

  return (
    <PageShell
      eyebrow={page?.eyebrow ?? section.eyebrow}
      title={page?.title ?? section.title}
      description={page?.description ?? section.description}
      backTo="/about"
      backLabel="About"
      theme="light"
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Certifications', path: '/certifications' },
        ])}
      />

      <div className="mx-auto max-w-6xl">
        {hasContent ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {education.map((item, index) => (
              <li
                key={`${item.degree}-${item.institution}`}
                className="border border-[#D8D7C3]/15 bg-[#10140D] p-5 text-[#D8D7C3] sm:p-6"
              >
                {index === 0 ? (
                  <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/60">
                    {educationSection.title}
                  </p>
                ) : null}
                <div
                  className={`flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6 ${index === 0 ? 'mt-3' : ''}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-black uppercase leading-tight sm:text-xl">
                      {item.degree}
                    </p>
                    <p className={`mt-2 ${textCopySmResponsive} text-[#D8D7C3]/75`}>
                      {item.institution}
                    </p>
                    {item.summary ? (
                      <p className={`mt-3 ${textCopySm} text-[#D8D7C3]/70`}>
                        {item.summary}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/60">
                    {item.issuedLabel}
                  </p>
                </div>
              </li>
            ))}
            {certifications.map((item) => (
              <li
                key={`${item.title}-${item.issuer}`}
                className="border border-[#11140F]/15 bg-[#D8D7C3] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0 flex-1">
                    {item.credentialUrl ? (
                      <a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display text-lg font-black uppercase leading-tight underline underline-offset-4 transition-colors hover:text-[#10140D] sm:text-xl"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <p className="font-display text-lg font-black uppercase leading-tight sm:text-xl">
                        {item.title}
                      </p>
                    )}
                    <p className={`mt-2 ${textCopySmResponsive} text-[#11140F]/75`}>
                      {item.issuer}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-xs font-black uppercase tracking-[0.18em] text-[#11140F]/60">
                    {item.issuedLabel}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`${textCopyBase} text-[#11140F]/75`}>
            Certifications will appear here once added.
          </p>
        )}

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link to="/about" className={buttonVariants({ variant: 'accent' })}>
            About me
          </Link>
          <InquiryTrigger variant="forest" inquiry={{ source: 'certifications' }}>
            Start a project
          </InquiryTrigger>
        </div>
      </div>
    </PageShell>
  )
}
