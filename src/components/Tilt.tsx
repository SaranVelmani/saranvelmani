import { useRef, type ReactNode, type CSSProperties } from 'react'
import { gsap, finePointer, reducedMotion } from '../lib/motion'

// 3D tilt on pointer move, with a glare that follows the pointer.
export default function Tilt({
  children, className = '', max = 10, style, cursor,
}: { children: ReactNode; className?: string; max?: number; style?: CSSProperties; cursor?: string }) {
  const el = useRef<HTMLDivElement>(null)
  const enabled = () => finePointer() && !reducedMotion()

  const move = (e: React.PointerEvent) => {
    if (!enabled()) return
    const r = el.current!.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el.current, { rotateY: px * max, rotateX: -py * max, transformPerspective: 900, duration: 0.5, ease: 'power3.out' })
    el.current!.style.setProperty('--gx', `${(px + 0.5) * 100}%`)
    el.current!.style.setProperty('--gy', `${(py + 0.5) * 100}%`)
  }
  const leave = () => {
    if (!enabled()) return
    gsap.to(el.current, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'elastic.out(1,0.5)' })
  }

  return (
    <div ref={el} onPointerMove={move} onPointerLeave={leave} className={`tilt group relative ${className}`} style={style} data-cursor={cursor}>
      {children}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(400px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.10), transparent 50%)' }}
      />
    </div>
  )
}
