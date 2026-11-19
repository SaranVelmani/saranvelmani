import { useRef } from 'react'
import { ArrowDownRight } from 'lucide-react'
import ParticleField from '../components/ParticleField'
import { gsap, useGSAP, reducedMotion } from '../lib/motion'
import { heroLines, profile } from '../data/content'
import { scrollToTarget } from '../lib/lenis'

const cycleWords = ['cricket pitch', 'football ground', 'sketchbook', 'camera', 'edit timeline']

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!ready || reducedMotion()) return
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from('.h-char', { yPercent: 120, rotate: 8, duration: 1.4, stagger: 0.035 })
      .from('.h-line', { yPercent: 110, duration: 1.1, stagger: 0.1 }, '-=1.1')
      .from('.h-fade', { opacity: 0, y: 20, duration: 1, stagger: 0.08 }, '-=0.8')
      .from('.h-rule', { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, 0.2)

    // Scroll: the name pulls apart, the stage recedes, particles drift.
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      .to('.h-first', { xPercent: -18 }, 0)
      .to('.h-last', { xPercent: 14 }, 0)
      .to('.h-stage', { scale: 0.9, opacity: 0.15 }, 0)
      .to('.h-canvas', { yPercent: 30 }, 0)

    // Cycling accent word.
    const words = gsap.utils.toArray<HTMLElement>('.h-cycle span')
    gsap.set(words.slice(1), { yPercent: 110 })
    const cycle = gsap.timeline({ repeat: -1, delay: 2.2 })
    words.forEach((wd, i) => {
      const next = words[(i + 1) % words.length]
      cycle.to(wd, { yPercent: -110, duration: 0.6, ease: 'expo.inOut' }, '+=1.6')
        .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' }, '<')
    })
  }, { scope: root, dependencies: [ready] })

  const chars = (s: string, cls: string) =>
    s.split('').map((c, i) => <span key={i} aria-hidden="true" className={`h-char inline-block ${cls}`}>{c}</span>)

  return (
    <section id="home" ref={root} className="relative flex min-h-svh flex-col overflow-hidden" aria-label="Introduction">
      <div className="spotlight pointer-events-none absolute inset-0 z-0" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[50vw] w-[50vw] rounded-full bg-volt/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[40vw] w-[40vw] rounded-full bg-ember/10 blur-[120px]" />
      <ParticleField className="h-canvas absolute inset-0 z-0 h-full w-full" />

      <div className="h-stage relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-10 pt-32 md:px-10 md:pb-14">
        <div className="h-fade mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="mono flex items-center gap-2 text-fog">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-turf opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-turf" />
            </span>
            {profile.location}
          </span>
          <span className="mono text-fog">{profile.role} · {profile.focus}</span>
        </div>

        <h1 className="display select-none">
          <span className="sr-only">{profile.name} — Creative mind, digital builder, passionate player</span>
          <span className="line-mask"><span className="h-first block text-[min(19vw,30vh)] leading-[0.82] md:text-[min(15.5vw,28vh)]">{chars(profile.first, '')}</span></span>
          <span className="line-mask"><span className="h-last block text-right text-[min(19vw,30vh)] leading-[0.82] md:text-[min(15.5vw,28vh)]">{chars(profile.last, 'outline-text')}</span></span>
        </h1>

        <div className="h-rule mt-6 h-px origin-left bg-white/15" />

        <div className="mt-6 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7" aria-hidden="true">
            {heroLines.map((l, i) => (
              <span key={l} className="line-mask">
                <span className={`h-line display block text-[8.5vw] leading-[0.95] md:text-[3.6vw] ${i === 1 ? 'text-ember' : ''}`}>{l}</span>
              </span>
            ))}
          </div>
          <div className="h-fade md:col-span-5 md:pb-2">
            <p className="max-w-md text-lg leading-relaxed text-snow/70">
              I build AI pipelines and full-stack products, then switch the screen off for the{' '}
              <span className="h-cycle relative inline-grid h-[1.35em] overflow-hidden align-bottom text-snow" aria-hidden="true">
                {cycleWords.map((w) => (
                  <span key={w} className="serif col-start-1 row-start-1 whitespace-nowrap text-[1.3em] leading-[1.05]">{w}</span>
                ))}
              </span>
              <span className="sr-only">cricket pitch, football ground, sketchbook, camera and edit timeline</span>.
            </p>
          </div>
        </div>

        <div className="h-fade mt-10 flex items-center justify-between">
          <button type="button" onClick={() => scrollToTarget('#about')} className="group flex items-center gap-4" data-cursor="SCROLL">
            <span className="relative h-14 w-px overflow-hidden bg-white/15"><span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-ember" /></span>
            <span className="mono text-fog transition-colors group-hover:text-snow">Scroll to explore</span>
          </button>
          <a
            href="#projects"
            onClick={(e) => { e.preventDefault(); scrollToTarget('#projects') }}
            className="mono hidden items-center gap-2 text-fog transition-colors hover:text-snow md:flex"
          >
            Selected work <ArrowDownRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
