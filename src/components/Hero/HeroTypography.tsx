type HeroTypographyProps = {
  name: string
  role: string
}

export function HeroTypography({ name, role }: HeroTypographyProps) {
  const nameWords = name.split(' ')

  return (
    <h1
      id="hero-title"
      aria-label={`${name} ${role}`}
      className="hero-title pointer-events-none absolute left-1/2 top-[10%] z-[3] w-screen -translate-x-1/2 overflow-hidden px-[2vw] text-center font-display font-black uppercase leading-[0.78] text-[#D8D7C3]"
    >
      <span
        className="hero-title-line hero-title-name flex justify-center whitespace-nowrap will-change-transform"
        style={{ animationDelay: '150ms' }}
        aria-hidden="true"
      >
        {nameWords.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </span>
      <span
        className="hero-title-line hero-title-role block whitespace-nowrap will-change-transform"
        style={{ animationDelay: '290ms' }}
      >
        {role}
      </span>
    </h1>
  )
}

