import heroImageSrc from '../../hero.png'

import { siteConfig } from './site'

export const heroRoleTitle = 'Lead Full-Stack Developer'

export const heroContent = {

  name: siteConfig.name,

  role: siteConfig.role,

  leftIntro: [

    'As a full stack developer, I focus on',

    'building fast, scalable and impactful',

    'digital products.',

  ],

  expertise: `${siteConfig.name.split(' ')[0]}'s development expertise delivered.`,

  cta: {

    label: "Let's talk",

    href: '/contact',

  },

  startProject: {

    label: 'Start a project',

    href: '/contact',

  },

  rightIntro: [

    'A full stack digital platform',

    'developer building reliable, fast and',

    'user-focused web experiences.',

  ],

  rightSecondary: ['Exceptional frontend, backend', 'and product engineering.'],

  tags: ['Full Stack', '2026'],

  badge: '',

  subject: {

    src: heroImageSrc,

    alt: `Portrait of ${siteConfig.name} wearing round sunglasses`,

  },

  ticker: [

    'Frontend Development',

    'Backend Development',

    'UI Engineering',

    'API Systems',

    'Web Applications',

    'Full Stack Development',

  ],

  navigation: [
    { label: 'Work', href: '/portfolio' },
    { label: 'About', href: '/about' },
    { label: 'Certifications', href: '/certifications' },
    { label: 'Experience', href: '/experience' },
    { label: 'Contact', href: '/contact' },
  ],

}
