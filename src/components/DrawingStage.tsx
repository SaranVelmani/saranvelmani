import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/motion'
import { getLenis } from '../lib/lenis'
import sketch from '../assets/saran-sketch.webp'

/* ─────────────────────────────────────────────────────────────────────────────
   Drawing — a spiral sketchpad on a lamp-lit desk, pinned while you scroll.
   The cover flips up, then each page draws itself and flips away:
   01 cover · 02 still life · 03 portrait study · 04 perspective study.
   Scroll scrubs it; snapping always settles on a finished page, so a fast
   flick can never leave a half-drawn sheet behind.
   ──────────────────────────────────────────────────────────────────────────── */

const arc = (cx: number, cy: number, rx: number, ry = rx) => `M${cx},${cy - ry} A${rx},${ry} 0 1 1 ${cx - 0.01},${cy - ry}`

// Page 1 — still life (football, cricket ball, bat). viewBox 520×420
const still = {
  construct: ['M20,340 L500,340', arc(190, 230, 100), 'M190,118 L190,346 M78,230 L302,230', arc(360, 295, 42), 'M425,52 L470,52 L470,342 L425,342 Z'],
  contour: [
    'M190,130 C250,130 290,175 290,230 C290,290 245,330 190,330 C130,330 90,288 90,230 C90,172 132,130 190,130',
    'M190,190 L222,213 L210,250 L170,250 L158,213 Z',
    'M190,190 L190,132 M222,213 L276,196 M210,250 L240,312 M170,250 L140,312 M158,213 L104,196',
    'M360,253 C383,253 402,272 402,295 C402,318 383,337 360,337 C337,337 318,318 318,295 C318,272 337,253 360,253',
    'M339,259 C356,278 356,312 339,331 M347,255 C365,276 365,314 347,335',
    'M445,58 L453,58 L455,140 L443,140 Z',
    'M432,140 L466,140 C469,220 467,290 462,330 C456,338 436,338 430,330 C425,290 428,220 432,140 Z',
    'M100,342 C150,354 240,354 285,342 M322,340 C345,346 380,346 402,340',
  ],
  hatch: [
    ...Array.from({ length: 12 }, (_, i) => `M${210 + i * 7},${300 - i * 2} L${190 + i * 7},${328 - i}`),
    ...Array.from({ length: 6 }, (_, i) => `M${368 + i * 6},305 L${362 + i * 6},330`),
    ...Array.from({ length: 7 }, (_, i) => `M452,${165 + i * 22} L463,${153 + i * 22}`),
    ...Array.from({ length: 4 }, (_, i) => `M444,${72 + i * 14} L454,${74 + i * 14}`),
  ],
}

// Page 2 — portrait study. viewBox 400×500. Guides, then tone is "shaded in" band by band.
const portraitGuides = [arc(196, 185, 72, 100), 'M196,70 L196,300', 'M118,176 L274,176', 'M150,238 L242,238', 'M20,372 C120,338 272,338 380,372']
const toneBands = Array.from({ length: 12 }, (_, i) => {
  const y = 18 + i * 42
  return i % 2 ? `M430,${y + 22} C300,${y + 4} 120,${y + 26} -30,${y}` : `M-30,${y} C120,${y + 22} 290,${y - 2} 430,${y + 22}`
})

// Page 3 — one-point perspective of a cricket ground. viewBox 400×500, vanishing point (200,190)
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${400 - +x},${y}`)
const tower = 'M52,300 L64,70 M76,300 L66,70 M40,52 L92,52 L92,76 L40,76 Z M53,52 L53,76 M66,52 L66,76 M79,52 L79,76 M40,64 L92,64'
const stand = 'M10,190 L10,168 L70,158 L132,172 L132,190'
const persp = {
  construct: ['M8,190 L392,190', 'M193,183 L207,197 M207,183 L193,197', ...[-160, -60, 40, 120, 280, 360, 460, 560].map((x) => `M${x},500 L200,190`)],
  contour: [
    stand, mirror(stand),
    'M0,300 C90,240 310,240 400,300',
    'M168,480 L193,214 L207,214 L232,480 Z',
    'M156,452 L244,452 M189,232 L211,232',
    'M190,452 L190,410 M200,452 L200,410 M210,452 L210,410 M188,409 L212,409',
    'M197,214 L197,205 M200,214 L200,205 M203,214 L203,205',
    tower, mirror(tower),
    'M140,112 q6,-6 12,0 q6,-6 12,0 M176,98 q5,-5 10,0 q5,-5 10,0 M226,118 q5,-5 10,0 q5,-5 10,0',
  ],
  hatch: [
    // mowing stripes: spacing grows toward the viewer, which is what sells the depth
    ...[198, 206, 218, 236, 262, 298, 346, 410].map((y) => `M${y < 300 ? 2 + (y - 190) * 0.4 : 0},${y} L${y < 300 ? 398 - (y - 190) * 0.4 : 400},${y}`),
    ...Array.from({ length: 9 }, (_, i) => `M${10 + i * 12},420 L${30 + i * 12},372`),
    ...Array.from({ length: 9 }, (_, i) => `M${390 - i * 12},420 L${370 - i * 12},372`),
    ...Array.from({ length: 6 }, (_, i) => `M${14 + i * 18},188 L${24 + i * 18},172`),
    ...Array.from({ length: 6 }, (_, i) => `M${386 - i * 18},188 L${376 - i * 18},172`),
  ],
}

// "S.V." in a quick hand
const sign = (x: number, y: number) =>
  `M${x + 14},${y - 9} C${x + 6},${y - 15} ${x - 3},${y - 6} ${x + 5},${y - 1} C${x + 14},${y + 4} ${x + 13},${y + 14} ${x},${y + 11}` +
  ` M${x + 19},${y + 11} l0.5,0.5 M${x + 26},${y - 10} L${x + 34},${y + 11} L${x + 42},${y - 10} M${x + 47},${y + 11} l0.5,0.5`

const chapters = [
  { t: 'Open the sketchbook', s: 'Pencil, paper, a lamp.' },
  { t: 'Still life', s: 'Construct · contour · shade · wash' },
  { t: 'Portrait study', s: 'Guides first, then tone.' },
  { t: 'Perspective', s: 'One point. A cricket ground.' },
]

function Pencil() {
  return (
    <g className="ds-pencil" opacity="0">
      <g transform="rotate(-38) scale(1.25)">
        <rect x="18" y="1" width="110" height="10" rx="2" fill="#000" opacity="0.15" />
        <path d="M0,0 L14,-5 L14,5 Z" fill="#e8c9a0" />
        <path d="M0,0 L5,-1.8 L5,1.8 Z" fill="#2a2a2e" />
        <rect x="14" y="-5" width="96" height="10" fill="#f5c451" />
        <rect x="14" y="-1" width="96" height="2" fill="#e0a92e" />
        <rect x="110" y="-5.5" width="10" height="11" fill="#b8b8bd" />
        <rect x="120" y="-5" width="12" height="10" rx="2.5" fill="#e98a8a" />
      </g>
    </g>
  )
}

const G = '#1d1d22' // graphite
const B = '#6b8fc7' // blue construction pencil

function Sheet({ cls, caption, children }: { cls: string; caption?: string; children?: React.ReactNode }) {
  return (
    <div className={`ds-sheet ${cls} sd-paper absolute inset-0 overflow-hidden rounded-b-md rounded-t-sm bg-[#efe9dd]`}>
      {/* punched holes for the spiral */}
      <div className="absolute inset-x-[6%] top-[2.2%] flex justify-between">
        {Array.from({ length: 11 }).map((_, i) => <span key={i} className="h-2 w-2 rounded-full bg-[#1a1714] sm:h-2.5 sm:w-2.5" />)}
      </div>
      {children}
      {caption && <p className="mono absolute bottom-[3.5%] left-[7%] text-[8px] text-[#1d1d22]/55 sm:text-[10px]">{caption}</p>}
      <div className="ds-shade pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-transparent" />
    </div>
  )
}

export default function DrawingStage({ craft }: { craft: { index: string; title: string; line: string; body: string } }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const q = gsap.utils.selector(root)
    const strokes = q('.ds-stroke') as unknown as SVGPathElement[]
    const rm = reducedMotion()
    strokes.forEach((s) => { const l = s.getTotalLength() + 1; gsap.set(s, { strokeDasharray: l, strokeDashoffset: rm ? 0 : l }) })
    if (rm) {
      gsap.set(q('.ds-cover'), { autoAlpha: 0 })
      gsap.set(q('.ds-shade'), { opacity: 0 })
      gsap.set(q('.ds-bar'), { scaleX: 1 })
      gsap.set(q('.ds-ch'), { opacity: 1 })
      return
    }

    gsap.set(q('.ds-wash'), { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' })
    gsap.set(q('.ds-sheet'), { transformOrigin: '50% 0%', transformPerspective: 2200 })
    gsap.set(q('.ds-ch'), { opacity: 0.35 })

    const mobile = window.matchMedia('(max-width: 1023px)').matches
    let dir = 1
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current, start: 'top top', end: mobile ? '+=320%' : '+=380%',
        pin: true, scrub: 1, anticipatePin: 1,
        onUpdate: (self) => { if (self.direction) dir = self.direction },
      },
    })

    // Draw a set of paths over `total` timeline seconds, the page's pencil riding every stroke.
    const draw = (sel: string, pencilSel: string, total: number) => {
      const els = q(sel) as unknown as SVGPathElement[]
      const pencil = q(pencilSel)[0]
      const lens = els.map((e) => e.getTotalLength())
      const sum = lens.reduce((a, b) => a + b, 0) || 1
      const hop = Math.min(0.06, total * 0.15 / els.length)
      const drawTime = total - hop * els.length
      els.forEach((s, k) => {
        const p = s.getPointAtLength(0)
        const d = (lens[k] / sum) * drawTime
        tl.to(pencil, { x: p.x, y: p.y, duration: hop })
          .to(s, { strokeDashoffset: 0, duration: d })
          .to(pencil, { motionPath: { path: s }, duration: d }, '<')
      })
    }
    const pencilIn = (sel: string, x: number, y: number) => tl.set(q(sel), { x, y }).to(q(sel), { opacity: 1, duration: 0.15 })
    const pencilOut = (sel: string, x: number, y: number) => tl.to(q(sel), { x, y, opacity: 0, duration: 0.3, ease: 'power2.in' })
    // Chapter = highlight its label, build its content, then lay its progress bar over exactly that span.
    const chapter = (i: number, build: () => void) => {
      const start = tl.duration()
      tl.to(q(`.ds-ch-${i}`), { opacity: 1, duration: 0.1 })
      build()
      tl.fromTo(q(`.ds-bar-${i}`), { scaleX: 0 }, { scaleX: 1, duration: tl.duration() - start }, start)
    }
    const flip = (sheet: string, under: string) =>
      tl.to(q(sheet), { rotationX: 172, duration: 0.8, ease: 'power2.inOut' })
        .to(q(sheet), { autoAlpha: 0, duration: 0.15 }, '-=0.18')
        .to(q(`${under} .ds-shade`), { opacity: 0, duration: 0.7, ease: 'power1.out' }, '<-0.6')

    // 01 — the pad lifts off the desk, lamp warms up
    tl.addLabel('start')
    chapter(0, () => {
      tl.fromTo(q('.ds-pad'), { rotationX: 38, rotationZ: -7, yPercent: 14, scale: 0.86 }, { rotationX: 0, rotationZ: -1.5, yPercent: 0, scale: 1, duration: 0.8, ease: 'power2.out' }, 'start')
        .fromTo(q('.ds-lamp'), { opacity: 0.2 }, { opacity: 1, duration: 0.8 }, 'start')
        .addLabel('cover')
      flip('.ds-cover', '.ds-p1')
    })

    // 02 — still life
    chapter(1, () => {
      pencilIn('.ds-p1 .ds-pencil', 560, 470)
      draw('.ds-p1 .c', '.ds-p1 .ds-pencil', 0.6)
      draw('.ds-p1 .k', '.ds-p1 .ds-pencil', 1.1)
      tl.to(q('.ds-p1 .ds-cons'), { opacity: 0.3, duration: 0.3 })
      draw('.ds-p1 .h', '.ds-p1 .ds-pencil', 0.6)
      tl.to(q('.ds-p1 .ds-wash'), { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' })
      draw('.ds-p1 .s', '.ds-p1 .ds-pencil', 0.25)
      pencilOut('.ds-p1 .ds-pencil', 560, 480)
      tl.addLabel('still')
      flip('.ds-p1', '.ds-p2')
    })

    // 03 — portrait: construction guides, then tone shaded in, guides fade under it
    chapter(2, () => {
      pencilIn('.ds-p2 .ds-pencil', 420, 40)
      draw('.ds-p2 .g', '.ds-p2 .ds-pencil', 0.6)
      draw('.ds-p2 .t', '.ds-p2 .ds-pencil', 2)
      tl.to(q('.ds-p2 .ds-guides'), { opacity: 0, duration: 0.5 }, '-=1')
      draw('.ds-p2 .s', '.ds-p2 .ds-pencil', 0.2)
      pencilOut('.ds-p2 .ds-pencil', 430, 520)
      tl.addLabel('portrait')
      flip('.ds-p2', '.ds-p3')
    })

    // 04 — perspective study
    chapter(3, () => {
      pencilIn('.ds-p3 .ds-pencil', 420, 520)
      draw('.ds-p3 .c', '.ds-p3 .ds-pencil', 0.6)
      draw('.ds-p3 .k', '.ds-p3 .ds-pencil', 1.2)
      tl.to(q('.ds-p3 .ds-cons'), { opacity: 0.35, duration: 0.3 })
      draw('.ds-p3 .h', '.ds-p3 .ds-pencil', 0.5)
      draw('.ds-p3 .s', '.ds-p3 .ds-pencil', 0.2)
      pencilOut('.ds-p3 .ds-pencil', 430, 530)
    })
    tl.to({}, { duration: 0.4 }).addLabel('end')

    // Settle on a finished page. When scrolling stops mid-chapter, glide (through Lenis, so the two
    // never fight) to the next page boundary in the direction you were going — a nudge finishes the page.
    const st = tl.scrollTrigger!
    const marks = [...new Set(Object.values(tl.labels).map((t) => t / tl.duration()))].sort((a, b) => a - b)
    const settle = () => {
      if (!st.isActive) return
      const pr = st.progress
      if (marks.some((m) => Math.abs(m - pr) < 0.003)) return
      const target = dir > 0 ? marks.find((m) => m > pr) ?? 1 : [...marks].reverse().find((m) => m < pr) ?? 0
      const y = st.start + (st.end - st.start) * target
      const dist = Math.abs(y - window.scrollY)
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, { duration: gsap.utils.clamp(0.8, 2.6, dist / 450), easing: (x: number) => 1 - Math.pow(1 - x, 3) })
      else window.scrollTo({ top: y, behavior: 'smooth' })
    }
    ScrollTrigger.addEventListener('scrollEnd', settle)
    return () => ScrollTrigger.removeEventListener('scrollEnd', settle)
  }, { scope: root })

  return (
    <div ref={root} className="keep-dark relative h-svh overflow-hidden bg-[#13100e]" aria-labelledby="drawing-title">
      {/* desk + lamp */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(94deg,rgba(255,255,255,0.012)_0,rgba(255,255,255,0.012)_2px,transparent_2px,transparent_22px)]" />
      <div className="ds-lamp pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_68%_42%,rgba(255,196,120,0.22),transparent_70%)] max-lg:bg-[radial-gradient(ellipse_80%_45%_at_50%_62%,rgba(255,196,120,0.22),transparent_70%)]" />

      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-center gap-5 px-5 pt-16 md:px-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:pt-0">
        {/* copy + chapters */}
        <div className="lg:col-span-4">
          <p className="mono text-snow">{craft.index} · Craft</p>
          <h3 id="drawing-title" className="display mt-2 text-5xl md:text-7xl lg:mt-4 lg:text-8xl">{craft.title}</h3>
          <p className="serif mt-1 text-xl text-snow/90 md:text-3xl lg:mt-3">{craft.line}</p>
          <p className="mt-5 hidden max-w-md leading-relaxed text-fog lg:block">{craft.body}</p>
          <ol className="mt-4 grid grid-cols-4 gap-2 lg:mt-10 lg:grid-cols-1 lg:gap-5">
            {chapters.map((c, i) => (
              <li key={c.t} className={`ds-ch ds-ch-${i}`}>
                <div className="flex items-baseline gap-3">
                  <span className="mono text-[10px] text-ember">0{i + 1}</span>
                  <span className="hidden text-lg text-snow lg:inline">{c.t}</span>
                </div>
                <p className="mono mt-1 hidden text-[10px] text-fog lg:block">{c.s}</p>
                <div className="mt-2 h-px bg-white/15"><div className={`ds-bar ds-bar-${i} h-full origin-left scale-x-0 bg-ember`} /></div>
              </li>
            ))}
          </ol>
        </div>

        {/* the pad */}
        <div className="flex justify-center lg:col-span-8">
          <div className="relative w-[min(84vw,50svh)] lg:w-[min(40vw,62svh)]" style={{ perspective: '1800px' }}>
            {/* loose pencil + eraser on the desk */}
            <svg viewBox="0 0 200 20" className="pointer-events-none absolute -right-[18%] bottom-[6%] hidden w-[46%] rotate-[-62deg] lg:block" aria-hidden="true">
              <path d="M0,10 L16,4 L16,16 Z" fill="#e8c9a0" /><path d="M0,10 L6,8 L6,12 Z" fill="#2a2a2e" />
              <rect x="16" y="4" width="160" height="12" fill="#3d8bff" /><rect x="176" y="3.5" width="10" height="13" fill="#b8b8bd" /><rect x="186" y="4" width="12" height="12" rx="3" fill="#e98a8a" />
            </svg>
            <span className="pointer-events-none absolute -left-[12%] bottom-[10%] hidden h-[5%] w-[14%] rotate-[18deg] rounded-md bg-[#f1e9e4] shadow-lg lg:block" aria-hidden="true" />

            <div className="ds-pad relative aspect-[4/5] w-full [transform-style:preserve-3d]">
              <div className="absolute inset-0 translate-x-2 translate-y-3 rounded-md bg-[#2a2420] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)]" />

              <Sheet cls="ds-p3" caption="Perspective study · one-point">
                <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <g className="ds-cons" fill="none" stroke={B} strokeWidth="1" strokeLinecap="round">{persp.construct.map((d, i) => <path key={i} className="ds-stroke c" d={d} />)}</g>
                  <g fill="none" stroke={G} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{persp.contour.map((d, i) => <path key={i} className="ds-stroke k" d={d} />)}</g>
                  <g fill="none" stroke={G} strokeOpacity="0.5" strokeWidth="0.9" strokeLinecap="round">{persp.hatch.map((d, i) => <path key={i} className="ds-stroke h" d={d} />)}</g>
                  <path className="ds-stroke s" d={sign(318, 470)} fill="none" stroke="#ff6a2b" strokeWidth="2" strokeLinecap="round" />
                  <Pencil />
                </svg>
              </Sheet>

              <Sheet cls="ds-p2" caption="Portrait study · from a photo">
                <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <defs>
                    <mask id="ds-tone" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="500">
                      <rect width="400" height="500" fill="#000" />
                      <g fill="none" stroke="#fff" strokeWidth="56" strokeLinecap="round">{toneBands.map((d, i) => <path key={i} className="ds-stroke t" d={d} />)}</g>
                    </mask>
                  </defs>
                  <g className="ds-guides" fill="none" stroke={B} strokeWidth="1.1" strokeLinecap="round">{portraitGuides.map((d, i) => <path key={i} className="ds-stroke g" d={d} />)}</g>
                  <image href={sketch} x="20" y="22" width="360" height="450" preserveAspectRatio="xMidYMid slice" mask="url(#ds-tone)" />
                  <path className="ds-stroke s" d={sign(318, 474)} fill="none" stroke="#ff6a2b" strokeWidth="2" strokeLinecap="round" />
                  <Pencil />
                </svg>
              </Sheet>

              <Sheet cls="ds-p1" caption="Still life · graphite + wash">
                <svg viewBox="0 0 520 420" className="absolute inset-x-0 top-[12%] h-[76%] w-full" aria-hidden="true">
                  <g>
                    <ellipse className="ds-wash" cx="190" cy="346" rx="108" ry="9" fill="#000" fillOpacity="0.12" />
                    <ellipse className="ds-wash" cx="362" cy="341" rx="46" ry="5" fill="#000" fillOpacity="0.12" />
                    <path className="ds-wash" d={still.contour[6]} fill="#d9a55b" fillOpacity="0.6" />
                    <circle className="ds-wash" cx="360" cy="295" r="41" fill="#c2410c" fillOpacity="0.7" />
                    <path className="ds-wash" d={still.contour[1]} fill="#26262c" fillOpacity="0.85" />
                  </g>
                  <g className="ds-cons" fill="none" stroke={B} strokeWidth="1" strokeLinecap="round">{still.construct.map((d, i) => <path key={i} className="ds-stroke c" d={d} />)}</g>
                  <g fill="none" stroke={G} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">{still.contour.map((d, i) => <path key={i} className="ds-stroke k" d={d} />)}</g>
                  <g fill="none" stroke={G} strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round">{still.hatch.map((d, i) => <path key={i} className="ds-stroke h" d={d} />)}</g>
                  <path className="ds-stroke s" d={sign(430, 392)} fill="none" stroke="#ff6a2b" strokeWidth="2.2" strokeLinecap="round" />
                  <Pencil />
                </svg>
              </Sheet>

              {/* cover */}
              <div className="ds-sheet ds-cover absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-b-md rounded-t-sm bg-[#1d1a18] [backface-visibility:hidden]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.07),transparent_60%)]" />
                <div className="absolute inset-[7%] rounded-sm border border-white/10" />
                <p className="display text-[11vw] leading-none text-[#efe9dd]/85 lg:text-[min(5vw,7svh)]">Sketches</p>
                <p className="mono mt-3 text-[9px] text-[#efe9dd]/50 sm:text-[10px]">S.V. · graphite · A4</p>
                <span className="absolute inset-y-0 right-[12%] w-[3.5%] bg-ember/85 shadow-[0_0_0_1px_rgba(0,0,0,0.2)]" />
              </div>

              {/* spiral */}
              <div className="pointer-events-none absolute inset-x-[6%] -top-[2.4%] flex justify-between" style={{ transform: 'translateZ(2px)' }}>
                {Array.from({ length: 11 }).map((_, i) => (
                  <span key={i} className="h-5 w-2 rounded-full border-2 border-[#a9a9b0] bg-gradient-to-b from-white/30 to-transparent sm:h-7 sm:w-2.5" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
