import { useEffect, useRef } from 'react'
import { reducedMotion } from '../lib/motion'

// Lightweight 2D constellation: drifting points that link up near the pointer.
export default function ParticleField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, raf = 0, visible = true
    const mouse = { x: -9999, y: -9999 }
    type P = { x: number; y: number; vx: number; vy: number; r: number; hot: boolean }
    let pts: P[] = []

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(110, (w * h) / 14000))
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4, hot: Math.random() < 0.15,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const light = document.documentElement.dataset.theme === 'light'
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy)
        if (d < 140 && d > 0) { p.x += (dx / d) * 0.8; p.y += (dy / d) * 0.8 }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.hot ? 'rgba(255,106,43,0.9)' : (light ? 'rgba(18,20,24,0.45)' : 'rgba(255,255,255,0.55)')
        ctx.fill()
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 110) {
            const near = md < 220 ? 0.35 : 0.08
            ctx.strokeStyle = `rgba(61,139,255,${(1 - d / 110) * near * (light ? 1.6 : 1)})`
            ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
    }

    const loop = () => { if (visible) draw(); raf = requestAnimationFrame(loop) }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)

    resize()
    if (reducedMotion()) draw()
    else { loop(); window.addEventListener('pointermove', onMove) }
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf); io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
