// Small line-art glyphs for the interests (lucide has no cricket or football marks).
type P = React.SVGProps<SVGSVGElement>

export const BatBall = (props: P) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M30 6l6 6-17 23-6-6z" />
    <path d="M13 29l-6 6 2 2 4 4 6-6" />
    <path d="M7 35l-3 3 6 6 3-3" />
    <circle cx="36" cy="36" r="5" />
    <path d="M32.5 32.5c2 1 4 3 5 7" />
  </svg>
)

export const Football = (props: P) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="24" cy="24" r="19" />
    <path d="M24 15l7 5-3 8h-8l-3-8z" />
    <path d="M24 15V6M31 20l8-3M28 28l5 8M20 28l-5 8M17 20l-8-3" />
  </svg>
)
