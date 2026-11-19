import { useCallback, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import Lightbox from '../components/Lightbox'
import { gsap, useGSAP, reducedMotion, finePointer } from '../lib/motion'
import { artworks, photos, videos, type MediaItem } from '../data/media'

/* ── Drawing: a still life that sketches itself — construction first, contour, then hatching. */
function SketchStillLife() {
  return (
    <svg viewBox="0 0 520 420" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 6">
        <line className="sk-draw" x1="20" y1="330" x2="500" y2="330" />
        <circle className="sk-draw" cx="190" cy="230" r="100" />
        <circle className="sk-draw" cx="385" cy="285" r="45" />
        <line className="sk-draw" x1="190" y1="110" x2="190" y2="350" />
        <line className="sk-draw" x1="70" y1="230" x2="310" y2="230" />
      </g>
      <g fill="none" stroke="#f3f4f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* football */}
        <path className="sk-draw" d="M190,130 C250,130 290,175 290,230 C290,290 245,330 190,330 C130,330 90,288 90,230 C90,172 132,130 190,130" />
        <path className="sk-draw" d="M190,190 L222,213 L210,250 L170,250 L158,213 Z" />
        <path className="sk-draw" d="M190,190 L190,132 M222,213 L276,196 M210,250 L240,312 M170,250 L140,312 M158,213 L104,196" />
        {/* cricket ball */}
        <path className="sk-draw" d="M385,240 C410,240 430,260 430,285 C430,310 410,330 385,330 C360,330 340,310 340,285 C340,260 360,240 385,240" />
        <path className="sk-draw" d="M362,248 C380,268 380,302 362,322 M370,244 C390,266 390,304 370,326" />
        {/* shadow line + pencil signature */}
        <path className="sk-draw" d="M110,340 C160,352 240,352 280,340 M350,334 C375,340 400,340 425,334" />
        <path className="sk-draw" d="M420,390 C430,380 440,396 450,386 C458,378 466,392 476,384" stroke="#ff6a2b" />
      </g>
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} className="sk-hatch" x1={210 + i * 7} y1={300 - i * 2} x2={190 + i * 7} y2={328 - i * 1} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`b${i}`} className="sk-hatch" x1={395 + i * 6} y1={300} x2={388 + i * 6} y2={326} />
        ))}
      </g>
    </svg>
  )
}

/* ── Photography: a viewfinder with focus brackets that track the pointer. */
function Viewfinder() {
  const frame = useRef<HTMLDivElement>(null)
  const move = (e: React.PointerEvent) => {
    if (!finePointer()) return
    const r = frame.current!.getBoundingClientRect()
    gsap.to('.vf-focus', { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2, duration: 0.5, ease: 'power3.out' })
    gsap.fromTo('.vf-focus', { scale: 1.25 }, { scale: 1, duration: 0.35, overwrite: 'auto' })
  }
  return (
    <div ref={frame} onPointerMove={move} className="vf relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(245,196,81,0.18),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(61,139,255,0.15),transparent_50%),#0a0b0d]" data-cursor="FOCUS">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {Array.from({ length: 9 }).map((_, i) => <div key={i} className="border border-white/[0.07]" />)}
      </div>
      {['left-4 top-4 border-l-2 border-t-2', 'right-4 top-4 border-r-2 border-t-2', 'left-4 bottom-4 border-l-2 border-b-2', 'right-4 bottom-4 border-r-2 border-b-2'].map((c) => (
        <span key={c} className={`absolute h-8 w-8 border-white/70 ${c}`} />
      ))}
      <svg viewBox="0 0 200 200" className="vf-iris absolute left-1/2 top-1/2 h-[46%] -translate-x-1/2 -translate-y-1/2 opacity-60" aria-hidden="true">
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={i} className="vf-blade" d="M100,100 L100,10 A90,90 0 0 1 170,44 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" transform={`rotate(${i * (360 / 7)} 100 100)`} />
        ))}
      </svg>
      <div className="vf-focus pointer-events-none absolute left-1/2 top-1/2 -ml-10 -mt-8 h-16 w-20 border-2 border-[#f5c451]">
        <span className="mono absolute -top-6 left-0 text-[9px] text-[#f5c451]">AF · locked</span>
      </div>
      <div className="mono absolute inset-x-0 bottom-0 flex justify-between px-6 py-4 text-[10px] text-snow/70">
        <span className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />REC</span>
        <span>Light · Frame · Moment</span>
      </div>
    </div>
  )
}

/* ── Video editing: an edit timeline whose playhead is scrubbed by scroll. */
function EditTimeline() {
  const tracks: { name: string; clips: [number, number, string][] }[] = [
    { name: 'V2', clips: [[8, 18, '#a78bfa'], [44, 14, '#a78bfa'], [70, 20, '#a78bfa']] },
    { name: 'V1', clips: [[0, 26, '#3d8bff'], [27, 22, '#3d8bff'], [50, 30, '#3d8bff'], [81, 19, '#3d8bff']] },
    { name: 'A1', clips: [[0, 100, '#22c55e']] },
    { name: 'A2', clips: [[12, 40, '#f5c451'], [60, 32, '#f5c451']] },
  ]
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0b0c0f] p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between">
        <span className="mono text-fog">Timeline · Sequence 01</span>
        <span className="mono tl-code text-[#a78bfa]">00:00:00:00</span>
      </div>
      <div className="relative space-y-2.5">
        <div className="mono mb-1 flex justify-between pl-10 text-[9px] text-fog/50">
          {['00:00', '00:15', '00:30', '00:45', '01:00'].map((t) => <span key={t}>{t}</span>)}
        </div>
        {tracks.map((t) => (
          <div key={t.name} className="flex items-center gap-3">
            <span className="mono w-7 text-[10px] text-fog">{t.name}</span>
            <div className="relative h-9 flex-1 rounded-md bg-white/[0.03]">
              {t.clips.map(([x, w, c], i) => (
                <span key={i} className="tl-clip absolute inset-y-1 rounded" style={{ left: `${x}%`, width: `${w}%`, background: `${c}33`, border: `1px solid ${c}88` }}>
                  {t.name.startsWith('A') && (
                    <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
                      <path d={`M0 10 ${Array.from({ length: 50 }, (_, k) => `L${k * 2} ${10 + Math.sin(k * 1.7 + i) * (3 + (k % 5))}`).join(' ')}`} stroke={c} strokeWidth="0.8" fill="none" />
                    </svg>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="tl-head pointer-events-none absolute bottom-0 top-4 left-10 w-px bg-ember">
          <span className="absolute -left-1.5 -top-1 h-3 w-3 rotate-45 bg-ember" />
        </div>
      </div>
      <p className="mono mt-6 text-[10px] text-fog/70">Cut · Rhythm · Colour · Sound</p>
    </div>
  )
}

function Masonry({ items, onOpen, label }: { items: MediaItem[]; onOpen: (i: number) => void; label: string }) {
  if (items.length === 0) return null
  return (
    <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3" aria-label={label}>
      {items.map((it, i) => (
        <button key={it.src} type="button" onClick={() => onOpen(i)} className="cr-tile group relative mb-4 block w-full overflow-hidden rounded-2xl" data-cursor="OPEN">
          <img src={it.src} alt={it.title} loading="lazy" className="cr-par w-full scale-110 transition-transform duration-700 group-hover:scale-[1.15]" />
          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 text-left text-sm transition-transform duration-500 group-hover:translate-y-0">{it.title}</span>
        </button>
      ))}
    </div>
  )
}

function VideoGrid({ items, onOpen }: { items: MediaItem[]; onOpen: (i: number) => void }) {
  if (items.length === 0) return null
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {items.map((v, i) => (
        <button
          key={v.src}
          type="button"
          onClick={() => onOpen(i)}
          onPointerEnter={(e) => { const el = e.currentTarget.querySelector('video'); el?.play().catch(() => {}) }}
          onPointerLeave={(e) => { const el = e.currentTarget.querySelector('video'); if (el) { el.pause(); el.currentTime = 0 } }}
          className="cr-tile group relative aspect-video overflow-hidden rounded-2xl bg-steel"
          data-cursor="PLAY"
        >
          <video src={v.src} poster={v.poster} muted loop playsInline preload="metadata" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 grid place-items-center bg-black/30 transition-opacity group-hover:opacity-0"><span className="glass grid h-16 w-16 place-items-center rounded-full"><Play /></span></span>
          <span className="absolute bottom-4 left-4 text-sm">{v.title}</span>
        </button>
      ))}
    </div>
  )
}

const crafts = [
  {
    key: 'draw', index: 'A', title: 'Drawing', accent: '#f3f4f6',
    line: 'Pencil first. Shapes before details.',
    body: 'Drawing is where I slow down. Block in the big shapes, check the proportions, then commit to the line. It’s the same habit I bring to UI work: structure first, polish last.',
  },
  {
    key: 'photo', index: 'B', title: 'Photography', accent: '#f5c451',
    line: 'Light, framing and the right moment.',
    body: 'Photography taught me to look before I act — where the light falls, what to leave out of the frame, and how long to wait for the moment to arrive.',
  },
  {
    key: 'video', index: 'C', title: 'Video Editing', accent: '#a78bfa',
    line: 'Story lives in the cut.',
    body: 'Editing is rhythm: where to cut, what to hold, when the music should hit. It’s also why I built ClipDub — I wanted tools that do the boring parts of the edit for me.',
  },
] as const

export default function Creative() {
  const root = useRef<HTMLElement>(null)
  const [lb, setLb] = useState<{ items: MediaItem[]; i: number } | null>(null)
  const close = useCallback(() => setLb(null), [])
  const setIndex = useCallback((i: number) => setLb((s) => (s ? { ...s, i } : s)), [])

  useGSAP(() => {
    const rm = reducedMotion()

    // Self-drawing sketch.
    const strokes = gsap.utils.toArray<SVGGeometryElement>('.sk-draw')
    strokes.forEach((s) => { const l = s.getTotalLength(); gsap.set(s, { strokeDasharray: rm ? 'none' : `${l}`, strokeDashoffset: rm ? 0 : l }) })
    if (rm) return
    gsap.timeline({ scrollTrigger: { trigger: '.cr-draw', start: 'top 70%', end: 'bottom 60%', scrub: 1 } })
      .to(strokes, { strokeDashoffset: 0, stagger: 0.12, ease: 'none' })
      .from('.sk-hatch', { opacity: 0, scaleY: 0, transformOrigin: '50% 100%', stagger: 0.03 }, '-=0.4')

    // Intro: words pull in from both sides.
    gsap.timeline({ scrollTrigger: { trigger: '.cr-intro', start: 'top bottom', end: 'center center', scrub: 1 } })
      .from('.cr-w1', { xPercent: -40 }, 0).from('.cr-w2', { xPercent: 40 }, 0)

    // Viewfinder: iris closes and opens with scroll.
    gsap.timeline({ scrollTrigger: { trigger: '.cr-photo', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      .to('.vf-iris', { rotate: 120, ease: 'none' })
      .to('.vf-blade', { scale: 0.7, transformOrigin: '100px 100px', ease: 'none' }, 0)

    // Timeline: playhead runs across as you scroll, timecode follows.
    const code = root.current!.querySelector('.tl-code')!
    const fmt = (s: number) => { const f = Math.floor((s % 1) * 25); const sec = Math.floor(s) % 60; const m = Math.floor(s / 60); return `00:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(f).padStart(2, '0')}` }
    gsap.to('.tl-head', {
      left: 'calc(100% - 1px)', ease: 'none',
      scrollTrigger: { trigger: '.cr-video', start: 'top 80%', end: 'bottom 30%', scrub: true, onUpdate: (st) => { code.textContent = fmt(st.progress * 60) } },
    })
    gsap.from('.tl-clip', { scaleX: 0, transformOrigin: '0 50%', stagger: 0.04, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.cr-video', start: 'top 75%' } })

    // Each craft block: big index letter + copy reveal; visual slides with a mask.
    gsap.utils.toArray<HTMLElement>('.cr-block').forEach((b, i) => {
      gsap.from(b.querySelectorAll('.cr-txt'), { y: 50, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 75%' } })
      gsap.fromTo(b.querySelector('.cr-vis'), { clipPath: i % 2 ? 'inset(0 0 100% 0 round 24px)' : 'inset(100% 0 0 0 round 24px)' }, { clipPath: 'inset(0 0 0% 0 round 24px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: b, start: 'top 75%' } })
      gsap.to(b.querySelector('.cr-letter'), { yPercent: -40, ease: 'none', scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true } })
    })

    // Gallery tiles (only present when real media exists).
    gsap.utils.toArray<HTMLElement>('.cr-tile').forEach((t) => {
      gsap.from(t, { clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 90%' } })
      const img = t.querySelector('.cr-par')
      if (img) gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
  }, { scope: root })

  const media = { draw: artworks, photo: photos, video: videos }
  const visuals = { draw: <SketchStillLife />, photo: <Viewfinder />, video: <EditTimeline /> }
  const cls = { draw: 'cr-draw', photo: 'cr-photo', video: 'cr-video' }

  return (
    <section id="creative" ref={root} className="relative overflow-hidden" aria-labelledby="creative-title">
      <div className="cr-intro mx-auto max-w-[1600px] px-5 pb-10 pt-32 md:px-10 md:pt-44">
        <SectionLabel index="06" label="Creative — drawing, photography, video" />
        <h2 id="creative-title" className="display mt-8 text-[17vw] md:text-[12vw]">
          <span className="cr-w1 block">Made by</span>
          <span className="cr-w2 block text-right"><span className="serif normal-case text-[#f5c451]">hand</span> &amp; eye.</span>
        </h2>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {crafts.map((c, i) => (
          <div key={c.key} className={`cr-block ${cls[c.key]} border-t border-white/10 py-20 md:py-28`}>
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <div className={`relative lg:col-span-5 ${i % 2 ? 'lg:order-2' : ''}`}>
                <span className="cr-letter display pointer-events-none absolute -top-16 right-0 text-[40vw] leading-none text-white/[0.04] lg:text-[16vw]" aria-hidden="true">{c.index}</span>
                <p className="cr-txt mono" style={{ color: c.accent }}>{c.index} · Craft</p>
                <h3 className="cr-txt display mt-4 text-6xl md:text-8xl">{c.title}</h3>
                <p className="cr-txt serif mt-3 text-3xl" style={{ color: c.accent }}>{c.line}</p>
                <p className="cr-txt mt-6 max-w-lg text-lg leading-relaxed text-fog">{c.body}</p>
              </div>
              <div className={`cr-vis aspect-[5/4] lg:col-span-7 ${i % 2 ? 'lg:order-1' : ''} ${c.key === 'draw' ? 'rounded-3xl border border-white/10 bg-[#0c0d10] p-6' : ''}`}>
                {visuals[c.key]}
              </div>
            </div>
            {c.key === 'video'
              ? <VideoGrid items={videos} onOpen={(k) => setLb({ items: videos, i: k })} />
              : <Masonry items={media[c.key]} label={`${c.title} gallery`} onOpen={(k) => setLb({ items: media[c.key], i: k })} />}
          </div>
        ))}
      </div>

      {lb && <Lightbox items={lb.items} index={lb.i} onClose={close} onIndex={setIndex} />}
    </section>
  )
}
