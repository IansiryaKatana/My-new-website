import type { SupabaseClient } from '@supabase/supabase-js'
import { fallbackCms } from '#/data/fallback-cms'
import type { Database } from '#/integrations/supabase/database.types'
import type { CmsSnapshot } from './types'

type SB = SupabaseClient<Database>

export async function loadCmsSnapshot(
  supabase: SB | null,
): Promise<{ snapshot: CmsSnapshot; mode: 'static' | 'live'; cmsEmpty: boolean }> {
  if (!supabase) {
    return { snapshot: fallbackCms, mode: 'static', cmsEmpty: false }
  }

  try {
    const [
      settingsRes,
      heroRes,
      navRes,
      logoStripRes,
      logosRes,
      perspectiveRes,
      principlesRes,
      portfolioSecRes,
      projectsRes,
      imageBreakRes,
      approachRes,
      approachItemsRes,
      finalCtaRes,
      footerRes,
      footerGroupsRes,
      footerLinksRes,
      socialRes,
      legalRes,
    ] = await Promise.all([
      supabase.from('site_settings').select('key, value'),
      supabase.from('hero_content').select('*').eq('published', true).limit(1).maybeSingle(),
      supabase.from('navigation_items').select('*').eq('published', true).order('sort_order'),
      supabase.from('logo_strip').select('*').eq('published', true).limit(1).maybeSingle(),
      supabase.from('trusted_logos').select('*').eq('published', true).order('sort_order'),
      supabase.from('perspective_section').select('*').eq('published', true).limit(1).maybeSingle(),
      supabase.from('principles').select('*').eq('published', true).order('sort_order'),
      supabase.from('portfolio_section').select('*').eq('published', true).limit(1).maybeSingle(),
      supabase.from('portfolio_projects').select('*').eq('published', true).order('sort_order'),
      supabase.from('image_break').select('*').eq('published', true).limit(1).maybeSingle(),
      supabase.from('investment_approach').select('*').eq('published', true).limit(1).maybeSingle(),
      supabase.from('investment_approach_items').select('*').eq('published', true).order('sort_order'),
      supabase.from('final_cta').select('*').eq('published', true).limit(1).maybeSingle(),
      supabase.from('footer_content').select('*').eq('published', true).limit(1).maybeSingle(),
      supabase.from('footer_link_groups').select('*').eq('published', true).order('sort_order'),
      supabase.from('footer_links').select('*').eq('published', true).order('sort_order'),
      supabase.from('social_links').select('*').eq('published', true).order('sort_order'),
      supabase.from('legal_links').select('*').eq('published', true).order('sort_order'),
    ])

    const hasHero = Boolean(heroRes.data)
    if (!hasHero) {
      return { snapshot: fallbackCms, mode: 'static', cmsEmpty: true }
    }

    const hero = heroRes.data!
    const nav = navRes.data ?? []
    const logos = logosRes.data ?? []
    const logoStrip = logoStripRes.data
    const perspective = perspectiveRes.data
    const principles = principlesRes.data ?? []
    const portfolioSec = portfolioSecRes.data
    const projects = projectsRes.data ?? []
    const imageBreak = imageBreakRes.data
    const approach = approachRes.data
    const approachItems = approachItemsRes.data ?? []
    const finalCta = finalCtaRes.data
    const footer = footerRes.data
    const footerGroups = footerGroupsRes.data ?? []
    const footerLinks = footerLinksRes.data ?? []
    const social = socialRes.data ?? []
    const legal = legalRes.data ?? []

    const siteSettings: Record<string, unknown> = {}
    for (const row of settingsRes.data ?? []) {
      siteSettings[row.key] = row.value
    }

    const featured =
      projects.find((p) => p.is_featured) ?? projects[0] ?? null

    const snapshot: CmsSnapshot = {
      siteSettings,
      hero: {
        logoText: hero.logo_text,
        navItems: nav.map((n) => ({
          id: n.id,
          label: n.label,
          href: n.href,
          sortOrder: n.sort_order,
        })),
        titleLineOne: hero.title_line_one,
        titleLineTwo: hero.title_line_two,
        introText: hero.intro_text,
        statement: hero.statement,
        backgroundImage: hero.background_image_url || fallbackCms.hero.backgroundImage,
        primaryCTA: {
          label: hero.primary_cta_label,
          href: hero.primary_cta_href,
        },
        secondaryCTA: {
          label: hero.secondary_cta_label,
          href: hero.secondary_cta_href,
        },
      },
      logoStrip: {
        label: logoStrip?.label ?? fallbackCms.logoStrip.label,
        logos: logos.map((l) => ({
          id: l.id,
          name: l.name,
          image: l.image_url,
          alt: l.alt_text || l.name,
        })),
      },
      perspective: perspective
        ? {
            eyebrow: perspective.eyebrow,
            title: perspective.title,
            description: perspective.description,
            image: perspective.image_url || fallbackCms.perspective.image,
          }
        : fallbackCms.perspective,
      principles:
        principles.length > 0
          ? principles.map((p) => ({
              id: p.id,
              number: p.number,
              title: p.title,
              description: p.description,
            }))
          : fallbackCms.principles,
      portfolio: {
        eyebrow: portfolioSec?.eyebrow ?? fallbackCms.portfolio.eyebrow,
        title: portfolioSec?.title ?? fallbackCms.portfolio.title,
        introText: portfolioSec?.intro_text ?? fallbackCms.portfolio.introText,
        selectedItems: projects.map((p) => ({
          id: p.id,
          name: p.name,
          url: p.project_url,
          active: featured?.id === p.id,
        })),
        featuredProject: featured
          ? {
              title: featured.name,
              description: featured.description,
              imageLarge:
                featured.image_large_url ||
                fallbackCms.portfolio.featuredProject.imageLarge,
              imageSide:
                featured.image_side_url ||
                fallbackCms.portfolio.featuredProject.imageSide,
              cta: {
                label: 'See Project',
                href: featured.project_url,
              },
            }
          : fallbackCms.portfolio.featuredProject,
      },
      imageBreak: imageBreak
        ? {
            image: imageBreak.image_url || fallbackCms.imageBreak.image,
            alt: imageBreak.alt_text,
          }
        : fallbackCms.imageBreak,
      investmentApproach: {
        eyebrow: approach?.eyebrow ?? fallbackCms.investmentApproach.eyebrow,
        title: approach?.title ?? fallbackCms.investmentApproach.title,
        description:
          approach?.description ?? fallbackCms.investmentApproach.description,
        items:
          approachItems.length > 0
            ? approachItems.map((i) => ({
                id: i.id,
                number: i.number,
                title: i.title,
                description: i.description,
              }))
            : fallbackCms.investmentApproach.items,
      },
      finalCTA: finalCta
        ? {
            heading: finalCta.heading,
            button: {
              label: finalCta.button_label,
              href: finalCta.button_href,
            },
            backgroundImage:
              finalCta.background_image_url || fallbackCms.finalCTA.backgroundImage,
          }
        : fallbackCms.finalCTA,
      footer: footer
        ? {
            statement: footer.statement,
            wordmark: footer.wordmark,
            socialLinks: social.map((s) => ({
              id: s.id,
              platform: s.platform,
              url: s.url,
            })),
            linkGroups: footerGroups.map((g) => ({
              id: g.id,
              title: g.title || undefined,
              links: footerLinks
                .filter((l) => l.group_id === g.id)
                .map((l) => ({
                  id: l.id,
                  label: l.label,
                  href: l.href,
                  sortOrder: l.sort_order,
                })),
            })),
            legalLinks: legal.map((l) => ({
              id: l.id,
              label: l.label,
              href: l.href,
              sortOrder: l.sort_order,
            })),
          }
        : fallbackCms.footer,
    }

    return { snapshot, mode: 'live', cmsEmpty: projects.length === 0 }
  } catch {
    return { snapshot: fallbackCms, mode: 'static', cmsEmpty: false }
  }
}
