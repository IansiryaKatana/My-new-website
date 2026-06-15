export type Service = {
  id: string
  number: string
  title: string
  description: string
  icon: string
}

export type Project = {
  id: string
  title: string
  location: string
  priceLabel: string
  description: string
  mainImage: string
  secondaryImage: string
  ctaLabel: string
}

export type Testimonial = {
  id: string
  clientName: string
  clientRole: string
  quote: string
  rating: number
  image: string
}

export type Metric = {
  value: string
  label: string
  description: string
}

export const contactHref =
  'mailto:hello@schwartz.com?subject=Book%20a%20Schwartz%20Estates%20call'

export const navItems = ['Residences', 'Architecture', 'Investments', 'Contact']

export const heroChips = ['London', 'Lake house', 'Private villas', 'Advisory']

export const images = {
  hero:
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=85',
  project:
    'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1200&q=85',
  projectDetail:
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85',
  fragmentLeft:
    'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=500&q=80',
  fragmentRight:
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=500&q=80',
  cta:
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
}

export const services: Service[] = [
  {
    id: 'functional-design',
    number: '01',
    title: 'Functional design',
    description: 'Architecture shaped around daily rituals, light, and movement.',
    icon: 'grid',
  },
  {
    id: 'renovation-spaces',
    number: '02',
    title: 'Renovation of spaces',
    description: 'Measured interventions that turn existing homes into lasting assets.',
    icon: 'spark',
  },
  {
    id: 'interior-design',
    number: '03',
    title: 'Interior design',
    description: 'Quiet material palettes with considered furniture and custom detail.',
    icon: 'circle',
  },
  {
    id: 'consultation',
    number: '04',
    title: 'Free consultation',
    description: 'Early advice on property selection, scope, budget, and timelines.',
    icon: 'arrow',
  },
]

export const featuredProject: Project = {
  id: 'riverside',
  title: 'Riverside',
  location: 'Barcelona',
  priceLabel: '001.25',
  description:
    'A private waterfront residence pairing polished concrete, warm oak, and disciplined glass lines for a calm end-to-end ownership experience.',
  mainImage: images.project,
  secondaryImage: images.projectDetail,
  ctaLabel: 'Book call',
}

export const testimonials: Testimonial[] = [
  {
    id: 'jane-cooper',
    clientName: 'Jane Cooper',
    clientRole: 'Private client',
    quote:
      'Their team went above and beyond to ensure that I found a property that met all of my needs, and they made the entire process stress-free.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85',
  },
  {
    id: 'miles-carter',
    clientName: 'Miles Carter',
    clientRole: 'Development partner',
    quote:
      'Schwartz translated an ambitious brief into a property strategy that felt precise, calm, and commercially grounded from day one.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85',
  },
]

export const metrics: Metric[] = [
  {
    value: '200K+',
    label: 'Active buyers',
    description: 'Registered and qualified clients across prime urban markets.',
  },
  {
    value: '5.0%',
    label: 'Transaction lift',
    description: 'Average premium achieved through guided presentation strategy.',
  },
  {
    value: '132+',
    label: 'Projects',
    description: 'Homes and advisory briefs completed across Europe and abroad.',
  },
]
