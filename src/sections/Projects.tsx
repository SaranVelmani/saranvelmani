import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, Lock } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import ProjectVisual from '../components/ProjectVisual'
import { GithubIcon } from '../components/Icons'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/lenis'
import { projects, type Project } from '../data/content'

const featured = projects.filter((p) => p.featured)
const more = projects.filter((p) => !p.featured)

function Media({ p }: { p: Project }) {
  if (p.images.length === 0) return <ProjectVisual p={p} />
  if (p.images.length === 1) {
    return <img src={p.images[0]} alt={`${p.name} screenshot`} loading="lazy" className="pj-img h-full w-full object-cover object-top" />
  }
  // Several screenshots: one hero shot plus fanned cards.
  return (
    <div className="keep-dark relative h-full w-full bg-[#0b0d10]">
      <img src={p.images[0]} alt={`${p.name} screenshot 1`} loading="lazy" className="pj-img h-full w-full object-cover object-top opacity-90" />
      {/* Fanned cards only where there is room; phones get a thumbnail strip under the frame. */}
      <div className="absolute bottom-4 right-4 hidden gap-3 sm:flex md:bottom-8 md:right-8">
        {p.images.slice(1).map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${p.name} screenshot ${i + 2}`}
            loading="lazy"
            className="pj-fan aspect-[16/10] w-32 rounded-lg border border-white/20 object-cover object-top shadow-2xl md:w-48"
          />
        ))}
      </div>
    </div>
  )
}

function Row({ p, i }: { p: Project; i: number }) {
  const flip = i % 2 === 1
  return (
    <article className="pj-row grid items-center gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-16" style={{ ['--accent' as string]: p.accent }}>
      <div className={`min-w-0 lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
        <div className="pj-frame group relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-3xl border border-white/10 bg-steel" data-cursor={p.live ? 'VIEW' : undefined}>
          <div className="pj-inner h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.04]">
            <Media p={p} />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1" style={{ background: p.accent }} />
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="absolute inset-0" aria-label={`Open ${p.name} live`} data-cursor="VIEW" />
          )}
        </div>
        {p.images.length > 1 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:hidden">
            {p.images.slice(1).map((src, k) => (
              <img key={src} src={src} alt={`${p.name} screenshot ${k + 2}`} loading="lazy" className="pj-thumb aspect-[16/10] w-full rounded-xl border border-white/10 object-cover object-top" />
            ))}
          </div>
        )}
      </div>

      <div className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <div className="pj-meta flex items-center gap-4">
          <span className="display text-6xl md:text-7xl" style={{ color: p.accent }}>{String(i + 1).padStart(2, '0')}</span>
          <div>
            <p className="mono text-fog">{p.tag}</p>
            <p className="mono text-fog/60">{p.year}</p>
          </div>
        </div>
        <h3 className="pj-name display mt-6 text-[13vw] leading-[0.9] sm:text-7xl xl:text-8xl">
          <span className="line-mask"><span className="block">{p.name}</span></span>
        </h3>
        <p className="pj-text mt-6 text-xl leading-snug text-snow/85">{p.purpose}</p>
        <p className="pj-text mt-3 text-fog">{p.role}</p>
        <ul className="pj-text mt-6 space-y-2.5">
          {p.features.map((f) => (
            <li key={f} className="flex gap-3 text-[15px] leading-snug text-snow/75">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />{f}
            </li>
          ))}
        </ul>
        <p className="pj-text mt-6 border-l-2 pl-4 text-[15px] text-snow/90" style={{ borderColor: p.accent }}>{p.highlight}</p>
        <ul className="pj-text mt-6 flex flex-wrap gap-2">
          {p.stack.map((s) => <li key={s} className="mono rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-snow/70">{s}</li>)}
        </ul>
        <div className="pj-text mt-8 flex flex-wrap items-center gap-3">
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="group/btn inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-onaccent transition-transform hover:scale-105" style={{ background: p.accent }}>
              Live demo <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          )}
          {p.code && (
            <a href={p.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm transition-colors hover:border-white hover:bg-white hover:text-ink">
              <GithubIcon className="h-4 w-4" /> Source
            </a>
          )}
          {p.privateRepo && !p.code && (
            <span className="mono inline-flex items-center gap-2 text-fog"><Lock size={13} /> Private repository</span>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const root = useRef<HTMLElement>(null)
  const [showAll, setShowAll] = useState(false)
  const first = useRef(true)

  // Page height changed: re-measure every trigger on the page (sections below included).
  useEffect(() => {
    if (first.current) { first.current = false; return }
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [showAll])

  const collapse = () => {
    setShowAll(false)
    // rows above the button disappear — keep the button where the reader is
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToTarget('#projects-more', { offset: -window.innerHeight * 0.35, immediate: true })))
  }

  useGSAP(() => {
    if (reducedMotion()) return

    const mm = gsap.matchMedia()

    // Desktop: oversized title shrinks into place while pinned; screenshots unmask on scroll.
    mm.add('(min-width: 1024px)', () => {
      gsap.timeline({ scrollTrigger: { trigger: '.pj-intro', start: 'top top', end: '+=100%', scrub: 1, pin: true } })
        .fromTo('.pj-big', { scale: 2.6, opacity: 0.2 }, { scale: 1, opacity: 1, ease: 'none' })
        .fromTo('.pj-sub', { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none' }, 0.5)

      gsap.utils.toArray<HTMLElement>('.pj-row').forEach((row, i) => {
        const fromLeft = i % 2 === 0
        gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 80%', end: 'top 20%', scrub: 1 } })
          .fromTo(row.querySelector('.pj-frame'), { clipPath: fromLeft ? 'inset(0 100% 0 0 round 24px)' : 'inset(0 0 0 100% round 24px)' }, { clipPath: 'inset(0 0% 0 0% round 24px)', ease: 'none' })
          .fromTo(row.querySelector('.pj-inner'), { scale: 1.3 }, { scale: 1, ease: 'none' }, 0)
        const imgs = row.querySelectorAll('.pj-img')
        if (imgs.length) gsap.fromTo(imgs, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true } })
        const fans = row.querySelectorAll('.pj-fan')
        if (fans.length) gsap.from(fans, { y: 80, rotate: (k) => (k ? 8 : -8), opacity: 0, stagger: 0.12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 55%' } })
      })
    })

    // Phones + tablets (single column): no pin and no scroll-scrubbed masks — the frame plays a short reveal once,
    // so a screenshot is never half-hidden while you read beside it.
    mm.add('(max-width: 1023px)', () => {
      gsap.from('.pj-big', { yPercent: 30, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.pj-intro', start: 'top 75%' } })
      gsap.from('.pj-sub', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.pj-sub', start: 'top 90%' } })
      gsap.utils.toArray<HTMLElement>('.pj-row').forEach((row) => {
        gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%' } })
          .from(row.querySelector('.pj-frame'), { clipPath: 'inset(12% 6% 12% 6% round 24px)', opacity: 0, duration: 1, ease: 'expo.out' })
          .from(row.querySelector('.pj-inner'), { scale: 1.15, duration: 1.2, ease: 'expo.out' }, 0)
        const thumbs = row.querySelectorAll('.pj-thumb')
        if (thumbs.length) gsap.from(thumbs, { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: thumbs[0], start: 'top 95%' } })
      })
    })

    // Text reveal (all sizes).
    gsap.utils.toArray<HTMLElement>('.pj-row').forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row.querySelector('.pj-meta'), start: 'top 85%' } })
      tl.from(row.querySelector('.pj-meta'), { x: -40, opacity: 0, duration: 0.9, ease: 'expo.out' })
        .from(row.querySelector('.pj-name .line-mask > span'), { yPercent: 110, duration: 1.1, ease: 'expo.out' }, 0.1)
        .from(row.querySelectorAll('.pj-text'), { y: 30, opacity: 0, stagger: 0.07, duration: 0.9, ease: 'expo.out' }, 0.25)
    })

    gsap.from('.pj-more > *', { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.pj-more', start: 'top 85%' } })
  }, { scope: root, dependencies: [showAll], revertOnUpdate: true })

  return (
    <section id="projects" ref={root} className="relative" aria-labelledby="projects-title">
      <div className="pj-intro flex flex-col items-center justify-center overflow-hidden px-5 pb-4 pt-28 text-center lg:min-h-svh lg:py-0">
        <SectionLabel index="03" label="Projects — my best work" className="justify-center" />
        <h2 id="projects-title" className="pj-big display mt-8 text-[24vw] leading-[0.85] md:text-[16vw]">
          Selected<br /><span className="outline-text">Work</span>
        </h2>
        <p className="pj-sub mt-8 max-w-xl text-lg text-fog">
          {projects.length} things I designed and built — AI pipelines, apps, servers and sites. Screenshots are real; projects without a public build get an illustration of how they work.
        </p>
      </div>

      <div className="mx-auto max-w-[1600px] divide-y divide-white/10 px-5 md:px-10">
        {featured.map((p, i) => <Row key={p.name} p={p} i={i} />)}
        {showAll && more.map((p, i) => <Row key={p.name} p={p} i={featured.length + i} />)}
      </div>

      {/* The rest of the work: names up front, full rows on demand. */}
      <div id="projects-more" className="pj-more mx-auto max-w-[1600px] px-5 pb-24 pt-8 text-center md:px-10 md:pb-32">
        {!showAll && (
          <>
            <p className="mono text-fog">+{more.length} more projects</p>
            <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
              {more.map((p) => (
                <li key={p.name} className="rounded-full border border-white/10 px-4 py-2 text-sm text-snow/80">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: p.accent }} />{p.name}
                </li>
              ))}
            </ul>
          </>
        )}
        <button
          type="button"
          onClick={() => (showAll ? collapse() : setShowAll(true))}
          aria-expanded={showAll}
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-snow px-8 py-4 font-semibold text-ink transition-transform hover:scale-105"
          data-cursor={showAll ? 'LESS' : 'MORE'}
        >
          {showAll ? 'Show fewer projects' : `View all ${projects.length} projects`}
          <ChevronDown size={18} className={`transition-transform duration-500 ${showAll ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
        </button>
      </div>
    </section>
  )
}
