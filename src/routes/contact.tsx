import { createFileRoute } from '@tanstack/react-router'

import { ContactForm } from '../components/contact/ContactForm'
import { PageShell } from '../components/layout/PageShell'
import { JsonLd } from '../components/seo/JsonLd'
import { useSiteConfig } from '../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../lib/cms/useMarketingPage'
import { fontCopy, textCopyBase } from '../lib/typography'
import { breadcrumbJsonLd, createPageMeta } from '../lib/seo'

export const Route = createFileRoute('/contact')({
  head: () =>
    createPageMeta({
      title: 'Contact | Start a project',
      description: 'Get in touch for full stack development and product engineering.',
      path: '/contact',
    }),
  component: ContactPage,
})

function ContactPage() {
  const siteConfig = useSiteConfig()
  const page = useMarketingPage('contact')
  const sidebarIntro = getMarketingSection(
    page,
    'sidebarIntro',
    'Whether you need a full product build, a performance-focused frontend pass, or API/platform work — send context up front so we can move quickly on scope and fit.',
  )
  const remoteNote = getMarketingSection(
    page,
    'remoteNote',
    'Available for remote collaboration.',
  )

  return (
    <PageShell
      eyebrow={page?.eyebrow ?? 'Contact'}
      title={page?.title ?? "Let's build something reliable and memorable"}
      description={
        page?.description ??
        'Share your timeline, goals, and constraints. I typically reply within one business day.'
      }
      backTo="/"
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-6 text-[#D8D7C3]/80">
          <p className={textCopyBase}>{sidebarIntro}</p>
          <div className="border border-[#D8D7C3]/15 p-6">
            <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/60">
              Email
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-3 inline-block font-display text-2xl font-black uppercase underline underline-offset-4 transition-colors hover:text-white"
            >
              {siteConfig.email}
            </a>
          </div>
          <div className="border border-[#D8D7C3]/15 p-6">
            <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/60">
              Based in
            </p>
            <p className="mt-3 font-display text-2xl font-black uppercase">
              {siteConfig.location}
            </p>
            <p className={`mt-2 text-sm ${fontCopy}`}>{remoteNote}</p>
          </div>
        </div>

        <div className="border border-[#D8D7C3]/15 bg-[#D8D7C3] p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </PageShell>
  )
}
