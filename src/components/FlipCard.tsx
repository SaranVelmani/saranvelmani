import { useState, type ReactNode } from 'react'

// Card that flips on hover (desktop) or tap/Enter (touch + keyboard).
export default function FlipCard({
  front, back, accent, className = '',
}: { front: ReactNode; back: ReactNode; accent: string; className?: string }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className={`group block h-72 w-full text-left [perspective:1200px] md:h-80 ${className}`}
      data-cursor="FLIP"
    >
      <span
        className={`relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        <span className="glass absolute inset-0 flex flex-col justify-between rounded-3xl p-7 [backface-visibility:hidden]">
          {front}
        </span>
        <span
          className="absolute inset-0 flex flex-col justify-between rounded-3xl p-7 text-ink [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ background: accent }}
        >
          {back}
        </span>
      </span>
    </button>
  )
}
