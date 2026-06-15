export type PageTheme = {
  pageBg: string
  pageText: string
  navBg: string
  navText: string
  navDecoration: string
  navOutline: string
  navHover: string
  eyebrow: string
  description: string
  borderSubtle: string
}

export const pageThemes = {
  dark: {
    pageBg: 'bg-[#10140D]',
    pageText: 'text-[#D8D7C3]',
    navBg: 'bg-[#10140D]',
    navText: 'text-[#D8D7C3]',
    navDecoration: 'decoration-[#D8D7C3]/80',
    navOutline: 'focus-visible:outline-[#D8D7C3]',
    navHover: 'hover:text-white',
    eyebrow: 'text-[#D8D7C3]/70',
    description: 'text-[#D8D7C3]/80',
    borderSubtle: 'border-[#D8D7C3]/15',
  },
  light: {
    pageBg: 'bg-[#D8D7C3]',
    pageText: 'text-[#11140F]',
    navBg: 'bg-[#D8D7C3]',
    navText: 'text-[#11140F]',
    navDecoration: 'decoration-[#11140F]/80',
    navOutline: 'focus-visible:outline-[#11140F]',
    navHover: 'hover:text-[#10140D]',
    eyebrow: 'text-[#11140F]/70',
    description: 'text-[#11140F]/80',
    borderSubtle: 'border-[#11140F]/15',
  },
  olive: {
    pageBg: 'bg-[#34392E]',
    pageText: 'text-[#D8D7C3]',
    navBg: 'bg-[#34392E]',
    navText: 'text-[#D8D7C3]',
    navDecoration: 'decoration-[#D8D7C3]/80',
    navOutline: 'focus-visible:outline-[#D8D7C3]',
    navHover: 'hover:text-white',
    eyebrow: 'text-[#D8D7C3]/70',
    description: 'text-[#D8D7C3]/80',
    borderSubtle: 'border-[#D8D7C3]/15',
  },
} satisfies Record<string, PageTheme>

export type PageThemeName = keyof typeof pageThemes
