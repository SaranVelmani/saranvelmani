import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/motion'

// A still life (football, cricket ball, bat) drawn on paper as you scroll, the way a real
// sketch is built: construction lines → contour → shading → colour wash → signature.
// A pencil rides along every stroke while it's being drawn.

const arc = (cx: number, cy: number, r: number) => `M${cx},${cy - r} A${r},${r} 0 1 1 ${cx - 0.01},${cy - r}`

const construct = [
  'M20,340 L500,340',
  arc(190, 230, 100),
  'M190,118 L190,346 M78,230 L302,230',
  arc(360, 295, 42),
  'M425,52 L470,52 L470,342 L425,342 Z',
  'M448,46 L446,348',
]

const contour = [
  'M190,130 C250,130 290,175 290,230 C290,290 245,330 190,330 C130,330 90,288 90,230 C90,172 132,130 190,130',
  'M190,190 L222,213 L210,250 L170,250 L158,213 Z',
  'M190,190 L190,132 M222,213 L276,196 M210,250 L240,312 M170,250 L140,312 M158,213 L104,196',
  'M360,253 C383,253 402,272 402,295 C402,318 383,337 360,337 C337,337 318,318 318,295 C318,272 337,253 360,253',
  'M339,259 C356,278 356,312 339,331 M347,255 C365,276 365,314 347,335',
  'M445,58 L453,58 L455,140 L443,140 Z',
  'M432,140 L466,140 C469,220 467,290 462,330 C456,338 436,338 430,330 C425,290 428,220 432,140 Z',
  'M100,342 C150,354 240,354 285,342 M322,340 C345,346 380,346 402,340',
]

const hatch = [
  ...Array.from({ length: 12 }, (_, i) => `M${210 + i * 7},${300 - i * 2} L${190 + i * 7},${328 - i}`),
  ...Array.from({ length: 6 }, (_, i) => `M${368 + i * 6},305 L${362 + i * 6},330`),
  ...Array.from({ length: 7 }, (_, i) => `M452,${165 + i * 22} L463,${153 + i * 22}`),
  ...Array.from({ length: 4 }, (_, i) => `M444,${72 + i * 14} L454,${74 + i * 14}`),
]

const sign = 'M412,392 C422,380 432,400 442,388 C450,378 458,396 468,386 C474,380 480,388 486,384'

const steps = ['Construct', 'Contour', 'Shade', 'Colour', 'Sign']

export default function SketchStudio() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const q = gsap.utils.selector(root)
    const rm = reducedMotion()
    const all = q('.sd-stroke') as unknown as SVGPathElement[]
    all.forEach((s) => { const l = s.getTotalLength() + 1; gsap.set(s, { strokeDasharray: l, strokeDashoffset: rm ? 0 : l }) })
    if (rm) { gsap.set(q('.sd-pencil, .sd-bar'), { autoAlpha: 0 }); gsap.set(q('.sd-step'), { opacity: 1 }); return }

    const pencil = q('.sd-pencil')[0]
    const stepEls = q('.sd-step')
    gsap.set(pencil, { x: 560, y: 470 })
    gsap.set(q('.sd-ghost'), { opacity: 0 })
    gsap.set(q('.sd-wash'), { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' })

    // Time-based (not scroll-scrubbed): once the sheet is on screen the sketch draws itself at its
    // own pace, so a fast scroll can't skip it — it keeps drawing and is finished when you look back.
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })

    const draw = (els: SVGPathElement[], speed: number) => els.forEach((s) => {
      const l = s.getTotalLength()
      const p = s.getPointAtLength(0)
      const d = Math.max(0.12, l / speed)
      tl.to(pencil, { x: p.x, y: p.y, duration: 0.1 })
        .to(s, { strokeDashoffset: 0, duration: d })
        .to(pencil, { motionPath: { path: s }, duration: d }, '<')
    })
    const step = (i: number) => tl.to(stepEls[i], { opacity: 1, color: '#1d1d22', duration: 0.05 })

    step(0); draw(q('.sd-c') as unknown as SVGPathElement[], 900)
    step(1); draw(q('.sd-k') as unknown as SVGPathElement[], 520)
    tl.to(q('.sd-cons'), { opacity: 0.3, duration: 0.4 }).to(q('.sd-ghost'), { opacity: 1, duration: 0.4 }, '<')
    step(2); draw(q('.sd-h') as unknown as SVGPathElement[], 260)
    step(3)
    tl.to(pencil, { x: 500, y: 120, rotation: -12, duration: 0.3, ease: 'power2.inOut' })
      .to(q('.sd-wash'), { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2, ease: 'power2.out' }, '<')
    tl.to(pencil, { rotation: 0, duration: 0.1 })
    step(4); draw(q('.sd-s') as unknown as SVGPathElement[], 300)
    tl.to(pencil, { x: 540, y: 460, duration: 0.4, ease: 'power2.in' })
    tl.fromTo(q('.sd-bar'), { scaleX: 0 }, { scaleX: 1, duration: tl.duration(), ease: 'none' }, 0)
    tl.timeScale(tl.duration() / 5.5) // whole drawing ≈ 5.5s
    ScrollTrigger.create({
      trigger: root.current, start: 'top 80%',
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.pause(0), // scrolled back above it: redraw next time
    })
  }, { scope: root })

  return (
    <div ref={root} className="keep-dark relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,#2a2420,#121014_70%)]">
      {/* paper sheet */}
      <div className="absolute inset-[5%] rotate-[-1.5deg] sd-paper rounded-sm bg-[#efe9dd] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
        <svg viewBox="0 0 520 420" className="h-full w-full" aria-hidden="true">
          <defs>
          </defs>

          {/* colour wash (under the lines) */}
          <g>
            <ellipse className="sd-wash" cx="190" cy="346" rx="108" ry="9" fill="#000" fillOpacity="0.12" />
            <ellipse className="sd-wash" cx="362" cy="341" rx="46" ry="5" fill="#000" fillOpacity="0.12" />
            <path className="sd-wash" d="M432,140 L466,140 C469,220 467,290 462,330 C456,338 436,338 430,330 C425,290 428,220 432,140 Z" fill="#d9a55b" fillOpacity="0.6" />
            <circle className="sd-wash" cx="360" cy="295" r="41" fill="#c2410c" fillOpacity="0.7" />
            <path className="sd-wash" d="M190,190 L222,213 L210,250 L170,250 L158,213 Z" fill="#26262c" fillOpacity="0.85" />
          </g>

          <g className="sd-cons" fill="none" stroke="#6b8fc7" strokeWidth="1" strokeLinecap="round">
            {construct.map((d, i) => <path key={i} className="sd-stroke sd-c" d={d} />)}
          </g>
          <g className="sd-ghost" fill="none" stroke="#1d1d22" strokeOpacity="0.28" strokeWidth="1" strokeLinecap="round" transform="translate(1.6 -1.2) rotate(0.4 260 210)">
            {contour.map((d, i) => <path key={i} d={d} />)}
          </g>
          <g fill="none" stroke="#1d1d22" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            {contour.map((d, i) => <path key={i} className="sd-stroke sd-k" d={d} />)}
          </g>
          <g fill="none" stroke="#1d1d22" strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round">
            {hatch.map((d, i) => <path key={i} className="sd-stroke sd-h" d={d} />)}
          </g>
          <path className="sd-stroke sd-s" d={sign} fill="none" stroke="#ff6a2b" strokeWidth="2.2" strokeLinecap="round" />

          {/* pencil — graphite tip sits at the group origin */}
          <g className="sd-pencil">
            <g transform="rotate(-38) scale(1.25)">
              <g transform="translate(4,6)" opacity="0.18"><rect x="14" y="-5" width="110" height="10" rx="2" fill="#000" /></g>
              <path d="M0,0 L14,-5 L14,5 Z" fill="#e8c9a0" />
              <path d="M0,0 L5,-1.8 L5,1.8 Z" fill="#2a2a2e" />
              <rect x="14" y="-5" width="96" height="10" fill="#f5c451" />
              <rect x="14" y="-1" width="96" height="2" fill="#e0a92e" />
              <rect x="110" y="-5.5" width="10" height="11" fill="#b8b8bd" />
              <rect x="120" y="-5" width="12" height="10" rx="2.5" fill="#e98a8a" />
            </g>
          </g>
        </svg>
      </div>

      {/* process steps */}
      <div className="absolute inset-x-[7%] bottom-[7.5%] rotate-[-1.5deg]">
        <div className="mono flex flex-wrap gap-x-3 gap-y-1 text-[8px] sm:text-[10px]">
          {steps.map((s, i) => <span key={s} className="sd-step text-[#1d1d22] opacity-30">0{i + 1}<span className="hidden sm:inline"> {s}</span></span>)}
        </div>
        <div className="mt-1.5 h-px bg-black/10"><div className="sd-bar h-full origin-left bg-[#ff6a2b]" /></div>
      </div>
    </div>
  )
}
