import { useCertifications, useEducation } from '../../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../../lib/cms/useMarketingPage'
import { SectionHeading } from '../layout/SectionHeading'

type CredentialsSection = {
  eyebrow: string
  title: string
  description?: string
}

const defaultEducationSection: CredentialsSection = {
  eyebrow: 'Education',
  title: 'Academic background',
}

const defaultCertificationsSection: CredentialsSection = {
  eyebrow: 'Certifications',
  title: 'Licenses & credentials',
  description:
    'Professional credentials across project management, technical SEO, and WordPress development.',
}

export function AboutCredentials() {
  const education = useEducation()
  const certifications = useCertifications()
  const page = useMarketingPage('about')
  const educationSection = getMarketingSection(
    page,
    'education',
    defaultEducationSection,
  )
  const certificationsSection = getMarketingSection(
    page,
    'certifications',
    defaultCertificationsSection,
  )

  if (education.length === 0 && certifications.length === 0) {
    return null
  }

  return (
    <>
      {education.length > 0 ? (
        <section
          className="mx-auto mt-16 max-w-6xl border-t border-[#D8D7C3]/15 pt-16"
          aria-labelledby="about-education-heading"
        >
          <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/60">
            {educationSection.eyebrow}
          </p>
          <h2
            id="about-education-heading"
            className="mt-3 font-display text-3xl font-black uppercase leading-[0.95] sm:text-4xl"
          >
            {educationSection.title}
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {education.map((item) => (
              <article
                key={`${item.degree}-${item.institution}`}
                className="border border-[#D8D7C3]/15 p-5 sm:p-6"
              >
                <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/60">
                  {item.issuedLabel}
                </p>
                <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight sm:text-2xl">
                  {item.degree}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#D8D7C3]/75 sm:text-base">
                  {item.institution}
                </p>
                {item.summary ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#D8D7C3]/70">
                    {item.summary}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {certifications.length > 0 ? (
        <section
          id="certifications"
          className="-mx-6 mt-16 bg-[#D8D7C3] px-6 py-20 text-[#11140F] sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16"
          aria-labelledby="about-certifications-heading"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow={certificationsSection.eyebrow}
              title={certificationsSection.title}
              description={certificationsSection.description}
              invert
            />

            <ul className="mt-12 grid gap-4 sm:grid-cols-2">
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
                      <p className="mt-2 text-sm leading-relaxed text-[#11140F]/75 sm:text-base">
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
          </div>
        </section>
      ) : null}
    </>
  )
}
