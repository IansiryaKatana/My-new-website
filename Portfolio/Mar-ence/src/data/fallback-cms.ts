import type { CmsSnapshot } from '#/lib/cms/types'

const IMG = {
  hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
  perspective:
    'https://images.unsplash.com/photo-1487958449943-242f94e3a918?w=1600&q=80',
  portfolioMain:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
  portfolioSide:
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80',
  imageBreak:
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
  finalCta:
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80',
}

export const fallbackCms: CmsSnapshot = {
  siteSettings: {
    siteName: 'Valence Capital',
    adminPrimary: '#061426',
  },
  hero: {
    logoText: 'Valence Capital',
    navItems: [
      { id: '1', label: 'Home', href: '#', sortOrder: 0 },
      { id: '2', label: 'About Us', href: '#about', sortOrder: 1 },
      { id: '3', label: 'Works', href: '#works', sortOrder: 2 },
      { id: '4', label: 'Process', href: '#process', sortOrder: 3 },
      { id: '5', label: 'FAQ', href: '#faq', sortOrder: 4 },
    ],
    titleLineOne: 'Valence',
    titleLineTwo: 'Capital',
    introText:
      'Valence Capital is a private investment firm focused on building long-term conviction across capital markets.',
    statement: 'Long-Term Capital.\nClear Conviction.',
    backgroundImage: IMG.hero,
    primaryCTA: { label: 'Submit Opportunity', href: '#submit' },
    secondaryCTA: { label: "Let's Talk", href: '#contact' },
  },
  logoStrip: {
    label: 'Trusted by Industry Leaders',
    logos: [
      { id: '1', name: 'Morgan Stanley', image: '', alt: 'Morgan Stanley' },
      { id: '2', name: 'KPMG', image: '', alt: 'KPMG' },
      { id: '3', name: 'Bloomberg', image: '', alt: 'Bloomberg' },
      { id: '4', name: 'Deloitte', image: '', alt: 'Deloitte' },
      { id: '5', name: 'Prudential', image: '', alt: 'Prudential' },
      { id: '6', name: 'Forbes', image: '', alt: 'Forbes' },
    ],
  },
  perspective: {
    eyebrow: 'Perspective',
    title: 'The Valence Perspective',
    description:
      'We invest with patience and discipline, seeking alignment with partners who share our commitment to long-term value creation. Our approach combines rigorous analysis with conviction built over time.',
    image: IMG.perspective,
  },
  principles: [
    {
      id: '1',
      number: '01',
      title: 'Patience',
      description:
        'We measure success in years, not quarters. Our holding periods reflect conviction in underlying fundamentals.',
    },
    {
      id: '2',
      number: '02',
      title: 'Risk',
      description:
        'Risk management is embedded in every decision. We prioritize capital preservation alongside thoughtful growth.',
    },
    {
      id: '3',
      number: '03',
      title: 'Alignment',
      description:
        'We partner with management teams and investors who share our long-term orientation and governance standards.',
    },
  ],
  portfolio: {
    eyebrow: 'Selected Work',
    title: 'Built on Principle',
    introText:
      'Our portfolio reflects companies and assets where structural advantages, disciplined management, and long-term vision converge.',
    selectedItems: [
      { id: '1', name: 'Mayweather Holdings', url: '#', active: false },
      { id: '2', name: 'Berto Investments Group', url: '#', active: false },
      {
        id: '3',
        name: 'Atlas Industrial Holdings',
        url: '#',
        active: true,
      },
      { id: '4', name: 'Intersummit Systems', url: '#', active: false },
      { id: '5', name: 'Cascade Timber Reserve', url: '#', active: false },
      {
        id: '6',
        name: 'Harbour Logistics Capital',
        url: '#',
        active: false,
      },
    ],
    featuredProject: {
      title: 'Atlas Industrial Holdings',
      description:
        'A diversified industrial platform spanning manufacturing and infrastructure services, built through disciplined capital allocation and operational excellence.',
      imageLarge: IMG.portfolioMain,
      imageSide: IMG.portfolioSide,
      cta: { label: 'See Project', href: '#works' },
    },
  },
  imageBreak: {
    image: IMG.imageBreak,
    alt: 'Glass skyscrapers rising into a blue sky',
  },
  investmentApproach: {
    eyebrow: 'Process',
    title: 'Investment Approach',
    description:
      'Our investment framework spans public and private markets, with a focus on assets that offer durable cash flows and structural advantages.',
    items: [
      {
        id: '1',
        number: '01',
        title: 'Public Markets',
        description:
          'Selective exposure to listed equities and credit, emphasizing quality businesses with sustainable competitive positions.',
      },
      {
        id: '2',
        number: '02',
        title: 'Private Equity',
        description:
          'Control and growth investments in companies where we can add operational and strategic value over multi-year horizons.',
      },
      {
        id: '3',
        number: '03',
        title: 'Real Assets',
        description:
          'Infrastructure, real estate, and natural resources that provide inflation protection and predictable income streams.',
      },
    ],
  },
  finalCTA: {
    heading:
      'Our Commitment to Create Long-Term Value Through Strategic Partnerships and Focused Investments',
    button: { label: 'Submit Opportunity', href: '#submit' },
    backgroundImage: IMG.finalCta,
  },
  footer: {
    statement:
      'Building long-term conviction through disciplined capital allocation and strategic partnerships.',
    socialLinks: [
      { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com' },
      { id: '2', platform: 'Twitter', url: 'https://twitter.com' },
    ],
    linkGroups: [
      {
        id: '1',
        title: 'Navigation',
        links: [
          { id: 'n1', label: 'Home', href: '#', sortOrder: 0 },
          { id: 'n2', label: 'About', href: '#about', sortOrder: 1 },
          { id: 'n3', label: 'Works', href: '#works', sortOrder: 2 },
        ],
      },
      {
        id: '2',
        title: 'Legal',
        links: [
          { id: 'l1', label: 'Privacy Policy', href: '/privacy', sortOrder: 0 },
          { id: 'l2', label: 'Terms', href: '/terms', sortOrder: 1 },
        ],
      },
      {
        id: '3',
        title: 'Portfolio',
        links: [
          { id: 'p1', label: 'Selected Work', href: '#works', sortOrder: 0 },
        ],
      },
    ],
    wordmark: 'VALENCE',
    legalLinks: [
      { id: 'lg1', label: 'Privacy', href: '/privacy', sortOrder: 0 },
      { id: 'lg2', label: 'Cookies', href: '/cookies', sortOrder: 1 },
      { id: 'lg3', label: 'Terms', href: '/terms', sortOrder: 2 },
    ],
  },
}
