import { useRef } from 'react'
import SectionLabel from '../components/SectionLabel'
import Tilt from '../components/Tilt'
import { gsap, useGSAP, reducedMotion } from '../lib/motion'
import { orbitTech, skillGroups } from '../data/content'

const inner = orbitTech.slice(0, 7)
const outer = orbitTech.slice(7)

function Ring({ items, radius, cls }: { items: string[]; radius: number; cls: string }) {
  return (
    <div className={`${cls} absolute inset-0`}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" style={{ width: `${radius * 2}%`, height: `${radius * 2}%` }} />
      {items.map((t, i) => {
        const a = (i / items.length) * Math.PI * 2 - Math.PI / 2
        return (
          <div
            key={t}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${50 + Math.cos(a) * radius}%`, top: `${50 + Math.sin(a) * radius}%` }}
          >
            <span className={`${cls}-label glass mono block whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] text-snow md:px-4 md:py-2 md:text-xs`}>{t}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function Skills() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (reducedMotion()) return
    const st = { trigger: '.sk-orbit-wrap', start: 'top bottom', end: 'bottom top', scrub: 1 }
    gsap.to('.ring-a', { rotate: 120, ease: 'none', scrollTrigger: st })
    gsap.to('.ring-a-label', { rotate: -120, ease: 'none', scrollTrigger: st })
    gsap.to('.ring-b', { rotate: -90, ease: 'none', scrollTrigger: st })
    gsap.to('.ring-b-label', { rotate: 90, ease: 'none', scrollTrigger: st })
    gsap.from('.sk-orbit', { scale: 0.6, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.sk-orbit-wrap', start: 'top 75%' } })

    gsap.from('.sk-title .line-mask > span', { yPercent: 110, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.sk-title', start: 'top 85%' } })

    gsap.utils.toArray<HTMLElement>('.sk-card').forEach((card) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%' } })
      tl.from(card, { y: 80, opacity: 0, rotateY: -25, transformPerspective: 1000, duration: 1, ease: 'expo.out' })
        .from(card.querySelector('.sk-progress'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' }, 0.1)
        .from(card.querySelectorAll('.sk-chip'), { y: 16, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out' }, 0.3)
    })
  }, { scope: root })

  return (
    <section id="skills" ref={root} className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40" aria-labelledby="skills-title">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel index="02" label="Skills — pulled from real projects" />
            <h2 id="skills-title" className="sk-title display mt-8 text-[15vw] leading-[0.95] lg:text-[8vw]">
              <span className="line-mask"><span className="block">The stack</span></span>
              <span className="line-mask"><span className="block outline-text">I actually</span></span>
              <span className="line-mask"><span className="block text-volt">ship with.</span></span>
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-fog">
              No bars, no percentages. Every tool here appears in code I wrote — each group lists the projects where you’ll find it.
            </p>
          </div>

          <div className="sk-orbit-wrap relative mx-auto aspect-square w-full max-w-[640px]">
            <div className="sk-orbit absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/20 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 grid h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink">
                <span className="display text-center text-lg leading-none md:text-2xl">FULL<br /><span className="text-ember">STACK</span></span>
              </div>
              <Ring items={inner} radius={26} cls="ring-a" />
              <Ring items={outer} radius={44} cls="ring-b" />
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-4 [perspective:1400px] md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Tilt key={g.id} className="sk-card rounded-3xl" max={6}>
              <article className="glass flex h-full flex-col rounded-3xl p-7">
                <div className="flex items-start justify-between">
                  <span className="mono text-fog">0{i + 1}</span>
                  <span className="mono text-fog/60">{g.items.length} tools</span>
                </div>
                <h3 className="display mt-6 text-4xl">{g.title}</h3>
                <p className="mt-2 text-fog">{g.blurb}</p>
                <div className="sk-progress my-6 h-px origin-left bg-gradient-to-r from-volt via-ember to-transparent" />
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <li key={s} className="sk-chip rounded-full border border-white/10 px-3 py-1.5 text-sm text-snow/85 transition-colors hover:border-volt hover:text-snow">{s}</li>
                  ))}
                </ul>
                <p className="mono mt-auto pt-6 text-[10px] text-fog/80">Used in: {g.evidence}</p>
              </article>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  )
}
