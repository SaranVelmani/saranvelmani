import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, reducedMotion, finePointer } from '../lib/motion'

// A camera you can actually "use": scrolling pulls focus and the AF box hunts for the
// subject, then the aperture fires. Click / tap anywhere to take another frame — each
// shot develops into a print, cropped around where you focused.

const W = 600
const H = 480
const SUN = { x: 380, y: 300 }

function Scene({ vb = `0 0 ${W} ${H}`, live = false }: { vb?: string; live?: boolean }) {
  return (
    <svg viewBox={vb} preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="cam-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1238" /><stop offset="0.45" stopColor="#6b2d66" />
          <stop offset="0.72" stopColor="#ee8a3d" /><stop offset="0.75" stopColor="#f6c25a" />
        </linearGradient>
        <radialGradient id="cam-glow"><stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" /><stop offset="1" stopColor="#ffb04a" stopOpacity="0" /></radialGradient>
        <linearGradient id="cam-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a2448" /><stop offset="1" stopColor="#120a1c" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#cam-sky)" />
      <circle cx={SUN.x} cy={SUN.y} r="170" fill="url(#cam-glow)" className={live ? 'cam-pulse' : ''} />
      <circle cx={SUN.x} cy={SUN.y} r="46" fill="#ffd27a" />
      <path d="M0,322 C80,282 140,302 210,287 C290,270 340,302 420,292 C500,282 560,297 600,287 L600,480 L0,480 Z" fill="#3b1f4d" />
      <path d="M0,346 C90,330 170,342 250,334 C330,326 420,348 600,330 L600,480 L0,480 Z" fill="#241232" />
      <rect y="350" width={W} height="130" fill="url(#cam-water)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} className={live ? 'cam-shim' : ''} style={{ animationDelay: `${i * 0.27}s` }}
          x={SUN.x - (70 - i * 6)} y={358 + i * 13} width={(70 - i * 6) * 2} height="2.5" rx="1.2" fill="#ffd27a" opacity="0.45" />
      ))}
      <path d="M0,402 C60,386 120,392 175,408 C200,416 210,430 205,480 L0,480 Z" fill="#0a0612" />
      <path d="M96,404 C98,360 92,320 104,262 L112,262 C104,320 110,360 108,404 Z" fill="#0a0612" />
      <g fill="#0a0612">
        <circle cx="108" cy="242" r="40" /><circle cx="76" cy="262" r="28" /><circle cx="142" cy="262" r="28" /><circle cx="118" cy="214" r="26" />
      </g>
      <g className={live ? 'cam-birds' : ''} fill="none" stroke="#1a0f2a" strokeWidth="2" strokeLinecap="round">
        {[[250, 168], [276, 156], [300, 176], [232, 186], [322, 160]].map(([x, y], i) => (
          <path key={i} className={live ? 'cam-bird' : ''} style={{ animationDelay: `${i * 0.13}s` }} d={`M${x},${y} q6,-6 12,0 q6,-6 12,0`} />
        ))}
      </g>
    </svg>
  )
}

type Print = { id: number; vb: string; rot: number }

export default function CameraShot() {
  const root = useRef<HTMLDivElement>(null)
  const [prints, setPrints] = useState<Print[]>([])
  const count = useRef(0)
  const busy = useRef(false)
  const autoShot = useRef(false)

  const { contextSafe } = useGSAP(() => {
    const q = gsap.utils.selector(root)
    if (reducedMotion()) { q('.cam-af')[0]?.classList.add('locked'); return }
    const sx = (SUN.x / W) * 100
    const sy = (SUN.y / H) * 100
    // Time-based (not scroll-scrubbed): once the camera is on screen it pulls focus, hunts,
    // locks and fires on its own clock, so scrolling fast can't skip past it.
    const af = q('.cam-af')[0]
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => { af.classList.add('locked'); if (!autoShot.current) { autoShot.current = true; gsap.delayedCall(0.25, shoot) } },
    })
      .fromTo(q('.cam-lens'), { filter: 'blur(10px) brightness(0.6)', scale: 1.18 }, { filter: 'blur(0px) brightness(1)', scale: 1, duration: 1.8, ease: 'power2.inOut' })
      .fromTo(q('.cam-af-pos'),
        { left: '22%', top: '35%' },
        { keyframes: [{ left: '70%', top: '58%' }, { left: '44%', top: '70%' }, { left: `${sx + 6}%`, top: `${sy - 4}%` }, { left: `${sx}%`, top: `${sy}%` }], duration: 1.8, ease: 'power1.inOut' }, 0)
      .fromTo(q('.cam-needle'), { xPercent: -900 }, { keyframes: [{ xPercent: 700 }, { xPercent: -300 }, { xPercent: 0 }], duration: 1.8, ease: 'power1.inOut' }, 0)
    ScrollTrigger.create({
      trigger: root.current, start: 'top 80%',
      onEnter: () => tl.play(),
      onLeaveBack: () => { tl.pause(0); af.classList.remove('locked') },
    })
  }, { scope: root })

  // where the AF box currently sits, in % of the frame
  const afPoint = () => {
    const r = root.current!.getBoundingClientRect()
    const a = root.current!.querySelector('.cam-af')!.getBoundingClientRect()
    return { px: ((a.left + a.width / 2 - r.left) / r.width) * 100, py: ((a.top + a.height / 2 - r.top) / r.height) * 100 }
  }

  // move the AF box (via x/y offset on top of its scroll-driven base position)
  const aim = contextSafe((clientX: number, clientY: number, dur = 0.45) => {
    const af = root.current!.querySelector<HTMLElement>('.cam-af')!
    const a = af.getBoundingClientRect()
    const x = (gsap.getProperty(af, 'x') as number) + clientX - (a.left + a.width / 2)
    const y = (gsap.getProperty(af, 'y') as number) + clientY - (a.top + a.height / 2)
    return gsap.to(af, { x, y, duration: dur, ease: 'power3.out', overwrite: 'auto' })
  })

  const develop = (px: number, py: number) => {
    const cw = 300, ch = 240
    const x = gsap.utils.clamp(0, W - cw, (px / 100) * W - cw / 2)
    const y = gsap.utils.clamp(0, H - ch, (py / 100) * H - ch / 2)
    const id = ++count.current
    setPrints((p) => [...p.slice(-3), { id, vb: `${x.toFixed(0)} ${y.toFixed(0)} ${cw} ${ch}`, rot: gsap.utils.random(-9, 9) }])
    const c = root.current!.querySelector('.cam-count')
    if (c) c.textContent = String(id).padStart(3, '0')
  }

  const shoot = contextSafe(() => {
    if (busy.current) return
    const q = gsap.utils.selector(root)
    const { px, py } = afPoint()
    if (reducedMotion()) { develop(px, py); return }
    busy.current = true
    const af = q('.cam-af')[0]
    const ap = { r: 100, rot: 0 }
    const hex = () => {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + (ap.rot * Math.PI) / 180
        return `${50 + ap.r * Math.cos(a)}% ${50 + ap.r * Math.sin(a) * 1.25}%`
      })
      gsap.set(q('.cam-aperture'), { clipPath: `polygon(${pts.join(',')})` })
    }
    af.classList.remove('locked')
    gsap.timeline({ onComplete: () => { busy.current = false; gsap.set(q('.cam-aperture'), { clearProps: 'clipPath' }) } })
      .fromTo(q('.cam-scene'), { filter: 'blur(7px)' }, { filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' })
      .fromTo(af, { scale: 1.35 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, '<')
      .add(() => af.classList.add('locked'))
      .to(ap, { r: 0, rot: 50, duration: 0.13, ease: 'power2.in', onUpdate: hex }, '+=0.08')
      .add(() => develop(px, py))
      .to(q('.cam-flash'), { opacity: 0.85, duration: 0.04 }, '<')
      .to(ap, { r: 100, rot: 0, duration: 0.35, ease: 'power2.out', onUpdate: hex }, '+=0.05')
      .to(q('.cam-flash'), { opacity: 0, duration: 0.6 }, '<')
  })

  // newest print flies out of the frame centre, then develops
  useEffect(() => {
    const last = prints[prints.length - 1]
    if (!last || reducedMotion()) return
    const el = root.current!.querySelector<HTMLElement>(`[data-print="${last.id}"]`)
    if (!el) return
    const r = root.current!.getBoundingClientRect()
    const e = el.getBoundingClientRect()
    gsap.from(el, { x: r.left + r.width / 2 - (e.left + e.width / 2), y: r.top + r.height / 2 - (e.top + e.height / 2), scale: 2.6, rotation: 0, duration: 1, ease: 'expo.out' })
    gsap.fromTo(el.querySelector('.cam-film'), { filter: 'brightness(2.6) saturate(0) contrast(0.6)' }, { filter: 'brightness(1) saturate(1) contrast(1)', duration: 2.4, ease: 'power2.out', delay: 0.3 })
  }, [prints])

  const onMove = (e: React.PointerEvent) => {
    if (!finePointer() || busy.current) return
    aim(e.clientX, e.clientY)
    root.current!.querySelector('.cam-af')!.classList.remove('locked')
    const r = root.current!.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    gsap.to(root.current!.querySelector('.cam-scene'), { x: -nx * 18, y: -ny * 14, duration: 0.8, ease: 'power3.out' })
    const dist = Math.hypot((e.clientX - r.left) / r.width * W - SUN.x, (e.clientY - r.top) / r.height * H - SUN.y)
    gsap.to(root.current!.querySelector('.cam-needle'), { xPercent: gsap.utils.clamp(-900, 900, 900 - dist * 6), duration: 0.5 })
  }

  const onClick = (e: React.MouseEvent) => {
    if (busy.current) return
    if (e.detail === 0) { shoot(); return } // keyboard activation
    const t = aim(e.clientX, e.clientY, 0.3)
    t.then(() => shoot())
  }

  return (
    <div
      ref={root}
      role="button"
      tabIndex={0}
      aria-label="Take a photo"
      onPointerMove={onMove}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); shoot() } }}
      className="keep-dark relative h-full w-full select-none overflow-hidden rounded-3xl border border-white/10 bg-black"
      data-cursor="SHOOT"
    >
      <div className="cam-aperture absolute inset-0">
        <div className="cam-lens absolute inset-0">
          <div className="cam-scene absolute -inset-4"><Scene live /></div>
        </div>
      </div>
      <div className="cam-flash pointer-events-none absolute inset-0 bg-white opacity-0" />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
        {Array.from({ length: 9 }).map((_, i) => <div key={i} className="border border-white/[0.08]" />)}
      </div>
      {['left-3 top-3 border-l-2 border-t-2', 'right-3 top-3 border-r-2 border-t-2', 'left-3 bottom-3 border-l-2 border-b-2', 'right-3 bottom-3 border-r-2 border-b-2'].map((c) => (
        <span key={c} className={`pointer-events-none absolute h-6 w-6 border-white/70 sm:h-8 sm:w-8 ${c}`} />
      ))}
      <div className="mono pointer-events-none absolute inset-x-0 top-0 flex justify-between px-5 py-4 text-[9px] text-snow/80 sm:px-7 sm:text-[10px]">
        <span>M · f/2.8 · 1/250 · ISO 100</span>
        <span><span className="cam-count">000</span> frames</span>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 w-28 -translate-x-1/2 sm:bottom-5 sm:w-40">
        <div className="mono flex justify-between text-[8px] text-snow/60"><span>-2</span><span>0</span><span>+2</span></div>
        <div className="relative mt-1 flex h-2 justify-between">
          {Array.from({ length: 9 }).map((_, i) => <span key={i} className={`w-px ${i === 4 ? 'h-2 bg-snow' : 'h-1 bg-snow/50'}`} />)}
          <span className="cam-needle absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[4px] border-b-[5px] border-x-transparent border-b-[#f5c451]" />
        </div>
      </div>
      <span className="mono pointer-events-none absolute bottom-4 left-5 text-[9px] text-snow/60 sm:bottom-5 sm:left-7 sm:text-[10px]">
        <span className="hidden sm:inline">Click</span><span className="sm:hidden">Tap</span> to shoot
      </span>

      <div className="cam-af-pos pointer-events-none absolute left-[63%] top-[62%]">
        <div className="cam-af relative -ml-8 -mt-6 h-12 w-16 border-2 border-[#f5c451] transition-colors sm:-ml-10 sm:-mt-8 sm:h-16 sm:w-20">
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
          <span className="cam-af-txt mono absolute -top-5 left-0 whitespace-nowrap text-[9px]" />
        </div>
      </div>

      {/* developed prints */}
      <div className="pointer-events-none absolute bottom-11 right-4 h-20 w-16 sm:bottom-14 sm:right-6 sm:h-32 sm:w-28">
        {prints.map((p, i) => (
          <div key={p.id} className="absolute bottom-0 right-0 w-full" style={{ transform: `translateX(${-(prints.length - 1 - i) * 16}px) rotate(${p.rot}deg)` }}>
            <div data-print={p.id} className="w-full bg-[#f4f1ea] p-1 pb-4 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.8)] sm:p-1.5 sm:pb-5">
              <div className="cam-film aspect-[5/4] w-full overflow-hidden bg-black"><Scene vb={p.vb} /></div>
              <p className="mono mt-0.5 text-[7px] text-black/50 sm:text-[8px]">#{String(p.id).padStart(3, '0')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
