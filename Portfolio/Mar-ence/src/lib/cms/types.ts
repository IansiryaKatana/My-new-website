export type NavItem = { id: string; label: string; href: string; sortOrder: number }

export type CTA = { label: string; href: string }

export type HeroContent = {
  logoText: string
  navItems: NavItem[]
  titleLineOne: string
  titleLineTwo: string
  introText: string
  statement: string
  backgroundImage: string
  primaryCTA: CTA
  secondaryCTA: CTA
}

export type TrustedLogo = {
  id: string
  name: string
  image: string
  alt: string
}

export type LogoStrip = {
  label: string
  logos: TrustedLogo[]
}

export type Perspective = {
  eyebrow: string
  title: string
  description: string
  image: string
}

export type Principle = {
  id: string
  number: string
  title: string
  description: string
}

export type PortfolioProject = {
  id: string
  name: string
  slug: string
  url: string
  description: string
  imageLarge: string
  imageSide: string
  active: boolean
}

export type PortfolioSection = {
  eyebrow: string
  title: string
  introText: string
  selectedItems: { id: string; name: string; url: string; active: boolean }[]
  featuredProject: {
    title: string
    description: string
    imageLarge: string
    imageSide: string
    cta: CTA
  }
}

export type ApproachItem = {
  id: string
  number: string
  title: string
  description: string
}

export type InvestmentApproach = {
  eyebrow: string
  title: string
  description: string
  items: ApproachItem[]
}

export type FinalCTA = {
  heading: string
  button: CTA
  backgroundImage: string
}

export type FooterLinkGroup = {
  id: string
  title?: string
  links: NavItem[]
}

export type SocialLink = { id: string; platform: string; url: string }

export type Footer = {
  statement: string
  socialLinks: SocialLink[]
  linkGroups: FooterLinkGroup[]
  wordmark: string
  legalLinks: NavItem[]
}

export type SiteSettings = Record<string, unknown>

export type CmsSnapshot = {
  siteSettings: SiteSettings
  hero: HeroContent
  logoStrip: LogoStrip
  perspective: Perspective
  principles: Principle[]
  portfolio: PortfolioSection
  imageBreak: { image: string; alt: string }
  investmentApproach: InvestmentApproach
  finalCTA: FinalCTA
  footer: Footer
}
