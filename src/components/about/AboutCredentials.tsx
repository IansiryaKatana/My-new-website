import { Link } from '@tanstack/react-router'

import { useCertifications, useEducation } from '../../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../../lib/cms/useMarketingPage'
import { textCopySm, textCopySmResponsive } from '../../lib/typography'
import { buttonVariants } from '../ui/button'

type CredentialsSection = {
  eyebrow: string
  title: string
  description?: string
}

const defaultCertificationsTeaser: CredentialsSection = {
  eyebrow: 'Certifications',
  title: 'Licenses & credentials',
  description:
    'Professional credentials across project management, technical SEO, and WordPress development.',
}

const defaultEducationSection: CredentialsSection = {
  eyebrow: 'Education',
  title: 'Academic qualification',
}

export function AboutCredentials() {
  const education = useEducation()
  const certifications = useCertifications()
  const page = useMarketingPage('about')
  const certificationsTeaser = getMarketingSection(
    page,
    'certifications',
    defaultCertificationsTeaser,
  )
  const educationSection = getMarketingSection(page, 'education', defaultEducationSection)
  const hasContent = education.length > 0 || certifications.length > 0

  return (
    <div className="mx-auto max-w-6xl">
      <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#11140F]/60">
        {certificationsTeaser.eyebrow}
      </p>
      <h2
        id="about-certifications-teaser-heading"
        className="mt-3 font-display text-3xl font-black uppercase leading-[0.95] sm:text-4xl"
      >
        {certificationsTeaser.title}
      </h2>
      {certificationsTeaser.description ? (
        <p className={`mt-4 max-w-2xl ${textCopySmResponsive} text-[#11140F]/75`}>
          {certificationsTeaser.description}
        </p>
      ) : null}

      {hasContent ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {education.map((item, index) => (
            <li
              key={`${item.degree}-${item.institution}`}
              className="border border-[#003B36] bg-[#003B36] p-5 text-[#D8D7C3] sm:p-6"
            >
              {index === 0 ? (
                <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/70">
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
                  <p className={`mt-2 ${textCopySmResponsive} text-[#D8D7C3]/85`}>
                    {item.institution}
                  </p>
                  {item.summary ? (
                    <p className={`mt-3 ${textCopySm} text-[#D8D7C3]/75`}>{item.summary}</p>
                  ) : null}
                </div>
                <p className="shrink-0 font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/70">
                  {item.issuedLabel}
                </p>
              </div>
            </li>
          ))}
          {certifications.map((item) => (
            <li
              key={`${item.title}-${item.issuer}`}
              className="border border-[#11140F]/15 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0 flex-1">
                  {item.credentialUrl ? (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-lg font-black uppercase leading-tight underline underline-offset-4 transition-colors hover:text-[#11140F]/80 sm:text-xl"
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
      ) : null}

      <Link
        to="/certifications"
        className={`${buttonVariants({ variant: 'accent' })} mt-8`}
      >
        View all certifications
      </Link>
    </div>
  )
}
