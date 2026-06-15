import { cn } from '../../lib/utils'

type HeroCopyBlockProps = {
  lines: readonly string[]
  secondary?: readonly string[]
  className?: string
}

export function HeroCopyBlock({
  lines,
  secondary,
  className,
}: HeroCopyBlockProps) {
  return (
    <div
      className={cn(
        'hero-copy max-w-[18rem] font-display text-[0.9rem] font-bold uppercase leading-[1.22] tracking-[0.01em] text-[#D8D7C3]',
        className,
      )}
    >
      <p>
        {lines.map((line) => (
          <span className="block" key={line}>
            {line}
          </span>
        ))}
      </p>
      {secondary ? (
        <p className="mt-5">
          {secondary.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  )
}

