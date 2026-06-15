type HeroTickerProps = {
  items: readonly string[]
}

export function HeroTicker({ items }: HeroTickerProps) {
  const tickerItems = [...items, ...items]

  return (
    <div className="hero-ticker absolute bottom-0 left-0 z-10 flex h-16 w-full items-center overflow-hidden bg-[#10140D] text-[#D8D7C3]">
      <div className="hero-marquee flex min-w-max items-center gap-6 whitespace-nowrap px-6 font-display text-2xl font-black capitalize leading-none sm:text-3xl">
        {tickerItems.map((item, index) => (
          <span className="inline-flex items-center gap-6" key={`${item}-${index}`}>
            {item}
            <span aria-hidden="true" className="text-[0.8em]">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

