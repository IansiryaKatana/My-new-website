export type ServiceCard = {
  title: string
  description: string
  image: string
  metrics: Array<{ label: string; value: string }>
}

export type WellnessPackageItem = {
  number: string
  title: string
  description: string
  image: string
  stats: Array<{ label: string; value: string }>
}

export type Testimonial = {
  name: string
  role: string
  quote: string
  image: string
}

export type FAQ = {
  question: string
  answer: string
}

const image = (id: string, params = 'auto=format&fit=crop&w=1200&q=80') =>
  `https://images.unsplash.com/${id}?${params}`

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About Staybil', href: '#about' },
  { label: 'Treatments', href: '#treatments' },
  { label: 'App', href: '#app' },
]

export const imagery = {
  hero: image('photo-1544161515-4ab6ce6db874', 'auto=format&fit=crop&w=2200&q=82'),
  floating: image('photo-1512290923902-8a9f81dc236c', 'auto=format&fit=crop&w=700&q=80'),
  intro: image('photo-1515377905703-c4788e51af15', 'auto=format&fit=crop&w=500&q=80'),
  proof: image('photo-1500530855697-b586d89ba3ee', 'auto=format&fit=crop&w=1800&q=82'),
  faq: image('photo-1600334129128-685c5582fd35', 'auto=format&fit=crop&w=700&q=80'),
  cta: image('photo-1500534314209-a25ddb2bd429', 'auto=format&fit=crop&w=1800&q=82'),
}

export const avatars = [
  image('photo-1494790108377-be9c29b29330', 'auto=format&fit=crop&w=160&q=80'),
  image('photo-1500648767791-00dcc994a43e', 'auto=format&fit=crop&w=160&q=80'),
  image('photo-1531123897727-8f129e1688ce', 'auto=format&fit=crop&w=160&q=80'),
]

export const introStats = [
  { value: '6', label: 'guided session plan' },
  { value: '24/7', label: 'body check-ins' },
  { value: '91%', label: 'felt clearer after week one' },
]

export const services: ServiceCard[] = [
  {
    title: 'Discover what your body needs',
    description:
      'Begin with a calm body scan that turns tension, sleep, movement, and recovery signals into clear next steps.',
    image: image('photo-1519823551278-64ac92734fb1', 'auto=format&fit=crop&w=900&q=80'),
    metrics: [
      { label: 'mobility', value: '82%' },
      { label: 'sleep', value: '7.4h' },
    ],
  },
  {
    title: 'Your personal wellness roadmap',
    description:
      'Staybil sequences nourishment, movement, touch, and rest into an approachable weekly care rhythm.',
    image: image('photo-1591343395082-e120087004b4', 'auto=format&fit=crop&w=900&q=80'),
    metrics: [
      { label: 'plan', value: '06' },
      { label: 'pace', value: 'soft' },
    ],
  },
  {
    title: 'Progress that evolves with you',
    description:
      'Track pain relief, posture, hydration, and body confidence as your recommendations adjust over time.',
    image: image('photo-1518611012118-696072aa579a', 'auto=format&fit=crop&w=900&q=80'),
    metrics: [
      { label: 'relief', value: '+34%' },
      { label: 'streak', value: '12d' },
    ],
  },
]

export const packages: WellnessPackageItem[] = [
  {
    number: '001',
    title: 'Conscious Nourishment',
    description:
      'Gentle meal timing, hydration cues, and mineral support designed to reduce inflammation without rigid rules.',
    image: image('photo-1498837167922-ddd27525d352', 'auto=format&fit=crop&w=900&q=80'),
    stats: [
      { label: 'hydration', value: '88%' },
      { label: 'balance', value: '+18' },
    ],
  },
  {
    number: '002',
    title: 'Mindful Movement',
    description:
      'Low-impact movement plans pair mobility, breath, and tension release so your body can build confidence again.',
    image: image('photo-1506126613408-eca07ce68773', 'auto=format&fit=crop&w=900&q=80'),
    stats: [
      { label: 'mobility', value: '74%' },
      { label: 'sessions', value: '06' },
    ],
  },
  {
    number: '003',
    title: 'Self-Love Embodiment',
    description:
      'Guided check-ins help you notice stress patterns, body cues, and emotional recovery before discomfort escalates.',
    image: image('photo-1540555700478-4be289fbecef', 'auto=format&fit=crop&w=900&q=80'),
    stats: [
      { label: 'clarity', value: '92%' },
      { label: 'mood', value: '+21' },
    ],
  },
  {
    number: '004',
    title: 'Restorative Alignment',
    description:
      'A recovery-first rhythm of sleep, posture support, and restorative care for longer-lasting body relief.',
    image: image('photo-1600334129128-685c5582fd35', 'auto=format&fit=crop&w=900&q=80'),
    stats: [
      { label: 'sleep', value: '7.8h' },
      { label: 'tension', value: '-31%' },
    ],
  },
]

export const testimonial: Testimonial = {
  name: 'Tiana Rowan',
  role: 'Staybil member, 8 weeks',
  quote:
    'Staybil made care feel human. I stopped guessing what my body needed and started following a rhythm I could actually keep.',
  image: image('photo-1544005313-94ddf0286df2', 'auto=format&fit=crop&w=600&q=80'),
}

export const faqs: FAQ[] = [
  {
    question: 'Who can benefit from Staybil?',
    answer:
      'Staybil is designed for people managing everyday body tension, recovery routines, stress-related discomfort, and wellness goals that need structure.',
  },
  {
    question: 'Is Staybil meant to replace therapy or medical care?',
    answer:
      'No. Staybil supports wellness education, tracking, and guided routines. It should complement, not replace, care from qualified health professionals.',
  },
  {
    question: 'How does Staybil keep my information private?',
    answer:
      'The product concept is designed around consent-first data capture, minimal required inputs, and clear controls for health and wearable information.',
  },
  {
    question: 'Do I need to integrate my calendar or wearable?',
    answer:
      'Integrations can make recommendations smarter, but Staybil should remain useful with simple manual check-ins and guided session notes.',
  },
  {
    question: 'Who developed Staybil?',
    answer:
      'Staybil is presented as a human-first wellness platform shaped by recovery practitioners, movement educators, and product designers.',
  },
]

export const footerLinks = {
  services: ['Body scan', 'Treatment plans', 'Recovery tracking', 'Wellness coaching'],
  company: ['About', 'Membership', 'Privacy', 'Contact'],
  social: ['Instagram', 'LinkedIn', 'TikTok'],
}
