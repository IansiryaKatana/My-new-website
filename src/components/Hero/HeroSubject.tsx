type HeroSubjectProps = {
  src: string
  alt: string
}

export function HeroSubject({ src, alt }: HeroSubjectProps) {
  return (
    <div className="hero-subject-wrap pointer-events-none absolute bottom-16 left-1/2 z-[5] h-[min(75svh,700px)] w-full max-w-[100vw] overflow-hidden sm:bottom-16 sm:h-[72vh] sm:w-[min(68vw,620px)] sm:max-w-none sm:overflow-visible lg:bottom-0 lg:h-[100svh] lg:w-[min(68vw,760px)] xl:w-[min(60vw,1080px)]">
      <img
        src={src}
        alt={alt}
        className="h-full w-full origin-bottom object-contain object-bottom"
        draggable={false}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-1/2 h-8 w-[45%] -translate-x-1/2 rounded-full bg-[#20120F]/25 blur-xl"
      />
    </div>
  )
}

