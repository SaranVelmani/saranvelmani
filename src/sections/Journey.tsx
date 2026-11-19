import { useRef } from 'react'
import SectionLabel from '../components/SectionLabel'
import { gsap, useGSAP, reducedMotion } from '../lib/motion'
import { timeline, work } from '../data/content'

export default function Journey() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (reducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const track = root.current!.querySelector<HTMLElement>('.jr-track')!
      const dist = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.jr-pin', start: 'top top', end: () => `+=${dist()}`, scrub: 1, pin: true, invalidateOnRefresh: true },
      })
      gsap.to('.jr-line-fill', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.jr-pin', start: 'top top', end: () => `+=${dist()}`, scrub: true } })
      gsap.utils.toArray<HTMLElement>('.jr-panel').forEach((panel) => {
        gsap.from(panel.querySelectorAll('.jr-in'), {
          y: 60, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 80%' },
        })
      })
    })
    mm.add('(max-width: 767px)', () => {
      gsap.utils.toArray<HTMLElement>('.jr-panel').forEach((panel) => {
        gsap.from(panel, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: panel, start: 'top 85%' } })
      })
    })
  }, { scope: root })

  return (
    <section ref={root} className="relative bg-coal" aria-labelledby="journey-title">
      <div className="jr-pin relative overflow-hidden md:h-svh">
        <div className="jr-track flex flex-col gap-6 px-5 py-24 md:h-full md:w-max md:flex-row md:items-center md:gap-0 md:px-0 md:py-0">
          <div className="jr-panel flex shrink-0 flex-col justify-center md:h-full md:w-[60vw] md:px-16">
            <SectionLabel index="04" label="Journey" className="jr-in" />
            <h2 id="journey-title" className="jr-in display mt-8 text-[16vw] md:text-[9vw]">
              From <span className="serif normal-case text-ember">classroom</span><br />to production.
            </h2>
            <p className="jr-in mt-6 max-w-md text-fog md:text-lg">Scroll sideways through the road so far →</p>
          </div>

          {timeline.map((t, i) => (
            <div key={t.when} className="jr-panel relative flex shrink-0 flex-col justify-center border-t border-white/10 pt-8 md:h-full md:w-[34vw] md:border-l md:border-t-0 md:px-12 md:pt-0">
              <span className="jr-in display text-[18vw] leading-none text-white/[0.06] md:absolute md:right-8 md:top-16 md:text-[12vw]" aria-hidden="true">0{i + 1}</span>
              <p className="jr-in mono text-ember">{t.when}</p>
              <h3 className="jr-in display mt-4 text-4xl md:text-5xl">{t.what}</h3>
              <p className="jr-in mt-3 text-lg text-fog">{t.where}</p>
            </div>
          ))}

          <div className="jr-panel flex shrink-0 flex-col justify-center border-t border-white/10 pt-8 md:h-full md:w-[52vw] md:border-l md:border-t-0 md:px-16 md:pt-0">
            <p className="jr-in mono text-volt">Now · {work.period}</p>
            <h3 className="jr-in display mt-4 text-5xl md:text-6xl">{work.title}<br /><span className="text-fog">@ {work.company}</span></h3>
            <ul className="jr-in mt-8 grid gap-3 text-snow/80 md:grid-cols-2">
              {work.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-[15px] leading-snug"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />{pt}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="absolute inset-x-16 bottom-12 hidden h-px bg-white/10 md:block">
          <div className="jr-line-fill h-px origin-left scale-x-0 bg-ember" />
        </div>
      </div>
    </section>
  )
}
