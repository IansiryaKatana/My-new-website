export type NutritionCategory = {
  id: string
  label: string
  headline: string
  description: string
  expert: string
  role: string
  metric: string
}

export type Treatment = {
  id: string
  title: string
  description: string
  price: number
  duration: string
  image: string
  rating: number
  reviewCount: number
  benefits: string[]
}

export type Product = {
  id: string
  name: string
  category: string
  description: string
  rating: number
  price: number
  image: string
  shade: string
  benefits: string[]
}

export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  image: string
}

export type FAQ = {
  question: string
  answer: string
}

export const images = {
  hero:
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=2200&q=82',
  portrait:
    'https://images.unsplash.com/photo-1491349174775-aaafddd81942?auto=format&fit=crop&w=900&q=82',
  ritual:
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=82',
  nutrition:
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=82',
  doctor:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=82',
  treatment:
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=82',
  testimonial:
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=82',
}

export const nutritionCategories: NutritionCategory[] = [
  {
    id: 'clinical',
    label: 'Clinical support',
    headline: 'Personal nutrition guided by real clinical rhythm.',
    description: 'A gentle plan built around labs, daily energy, digestion, and sustainable meals.',
    expert: 'Dr. Imani Cole',
    role: 'Clinical nutrition lead',
    metric: '92% plan adherence after 30 days',
  },
  {
    id: 'professional',
    label: 'Professional care',
    headline: 'Meet with an expert before changing your routine.',
    description: 'Every recommendation is reviewed by a wellness clinician for fit and safety.',
    expert: 'Mara Ellison, RD',
    role: 'Registered dietitian',
    metric: '1:1 consults available weekly',
  },
  {
    id: 'mindful',
    label: 'Mindful wellness',
    headline: 'A practice that makes health feel less clinical.',
    description: 'Mindful check-ins connect food, rest, mood, and movement in one care plan.',
    expert: 'Noah Vale',
    role: 'Mindfulness coach',
    metric: '8 minute daily check-in',
  },
  {
    id: 'weight',
    label: 'Weight loss',
    headline: 'Weight care without aggressive restriction.',
    description: 'Nutrition, satiety, and metabolic support are balanced through small weekly actions.',
    expert: 'Dr. Sena Park',
    role: 'Metabolic health physician',
    metric: '12 week care pathway',
  },
  {
    id: 'gut',
    label: 'Gut health',
    headline: 'Support digestion with a calmer daily baseline.',
    description: 'Food tolerance tracking and formula support help identify what your body prefers.',
    expert: 'Avery Lin',
    role: 'Gut health specialist',
    metric: '6 signals tracked',
  },
  {
    id: 'sleep',
    label: 'Sleep',
    headline: 'Build an evening ritual that helps recovery.',
    description: 'Wind-down plans pair meal timing, stress support, and light habit coaching.',
    expert: 'Dr. Ellis Rane',
    role: 'Sleep wellness advisor',
    metric: '74% report deeper sleep',
  },
]

export const treatments: Treatment[] = [
  {
    id: 'weight-loss',
    title: 'Weight loss treatment',
    description: 'Expert nutritional and balanced weight care through personalized plans.',
    price: 400,
    duration: '12 weeks',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=82',
    rating: 5,
    reviewCount: 74,
    benefits: ['Metabolic assessment', 'Dietitian support', 'Weekly progress review'],
  },
  {
    id: 'hormone',
    title: 'Hormone balance',
    description: 'Support energy, mood, cycle rhythm, and hormonal recovery with guided care.',
    price: 320,
    duration: '8 weeks',
    image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=1200&q=82',
    rating: 4.9,
    reviewCount: 58,
    benefits: ['Symptom mapping', 'Care plan review', 'Lifestyle guidance'],
  },
  {
    id: 'gut-reset',
    title: 'Gut reset',
    description: 'A calmer protocol for digestion, bloating, and daily nourishment.',
    price: 260,
    duration: '6 weeks',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=82',
    rating: 4.8,
    reviewCount: 43,
    benefits: ['Food pattern review', 'Formula pairing', 'Digestive habit coaching'],
  },
  {
    id: 'longevity',
    title: 'Anti-aging treatment',
    description: 'Support longevity, skin vitality, and natural energy through a care routine.',
    price: 380,
    duration: '10 weeks',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=82',
    rating: 4.9,
    reviewCount: 61,
    benefits: ['Cellular health review', 'Recovery support', 'Formula routine'],
  },
]

export const products: Product[] = [
  {
    id: 'daily-greens',
    name: 'Daily Greens',
    category: 'Digestive',
    description: 'A morning blend of greens, enzymes, and trace minerals for steady nourishment.',
    rating: 4.9,
    price: 64,
    image: 'https://images.unsplash.com/photo-1622484211148-d657fd5eebdb?auto=format&fit=crop&w=900&q=82',
    shade: 'bg-forest',
    benefits: ['Gut support', 'Mineral blend', 'No added sugar'],
  },
  {
    id: 'calm-minerals',
    name: 'Calm Minerals',
    category: 'Sleep',
    description: 'Magnesium, glycine, and botanicals to help the body settle into evening rest.',
    rating: 4.8,
    price: 52,
    image: 'https://images.unsplash.com/photo-1602928298849-325cec8771c0?auto=format&fit=crop&w=900&q=82',
    shade: 'bg-[#315f8c]',
    benefits: ['Evening ritual', 'Stress support', 'Caffeine free'],
  },
  {
    id: 'skin-rhythm',
    name: 'Skin Rhythm',
    category: 'Longevity',
    description: 'A collagen-supporting formula designed for glow, hydration, and recovery.',
    rating: 4.7,
    price: 58,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=82',
    shade: 'bg-[#e56d3d]',
    benefits: ['Hydration', 'Vitamin C', 'Amino support'],
  },
  {
    id: 'hormone-flow',
    name: 'Hormone Flow',
    category: 'Balance',
    description: 'A botanical daily support for energy, mood, and cycle-centered balance.',
    rating: 4.9,
    price: 68,
    image: 'https://images.unsplash.com/photo-1598662957563-ee4965d4d72c?auto=format&fit=crop&w=900&q=82',
    shade: 'bg-[#d59657]',
    benefits: ['Adaptogens', 'Cycle care', 'Gentle routine'],
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 'amara',
    quote:
      'Aurora helped me stop guessing. My care plan felt calm, precise, and human, and my daily routine finally became something I could keep.',
    name: 'Amara N.',
    role: 'Member for 7 months',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'leon',
    quote:
      'The nutrition consult changed the way I approach energy and food. It never felt like a diet, just a more thoughtful way to care for myself.',
    name: 'Leon K.',
    role: 'Nutrition pathway member',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'sasha',
    quote:
      'I came for gut support and stayed for the rituals. The check-ins and formulas made wellness feel approachable again.',
    name: 'Sasha M.',
    role: 'Digestive care member',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=82',
  },
]

export const faqs: FAQ[] = [
  {
    question: 'Is Aurora private?',
    answer:
      'Yes. Member care notes, intake answers, and wellness plans are treated as private health-adjacent information and are only used to guide your program.',
  },
  {
    question: 'How much does a session cost?',
    answer:
      'Discovery calls are complimentary. Guided pathways begin at $260 and vary by treatment length, expert support, and selected formulas.',
  },
  {
    question: 'Can beginners use Aurora?',
    answer:
      'Absolutely. The experience is designed for people who want a gentle entry point into nutrition, habit coaching, and personalized self-care.',
  },
  {
    question: 'Do I need to visit a physical location?',
    answer:
      'No. Aurora is built as a digital-first wellness experience with virtual consults, check-ins, and home-delivered formula routines.',
  },
  {
    question: 'What if I need technical support?',
    answer:
      'Our care desk can help with onboarding, scheduling, account access, and plan updates before or after your sessions.',
  },
]
