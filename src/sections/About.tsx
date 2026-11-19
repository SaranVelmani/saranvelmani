import { useRef } from 'react'
import { Code2, PenTool, Camera, Clapperboard } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import Tilt from '../components/Tilt'
import { BatBall, Football } from '../components/Glyphs'
import { gsap, ScrollTrigger, SplitText, useGSAP, reducedMotion } from '../lib/motion'
import { interests, manifesto, profile, work } from '../data/content'
import portrait from '../assets/saran.jpg'

const icons = {
  code: Code2, cricket: BatBall, football: Football, draw: PenTool, photo: Camera, video: Clapperboard,
} as const

export default function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (reducedMotion()) return

    // Manifesto: words light up as you scroll through a pinned stage.
    ScrollTrigger.create({ trigger: '.ab-pin', start: 'top top', end: '+=140%', pin: true })
    SplitText.create('.ab-manifesto', {
      type: 'words',
      autoSplit: true, // re-splits once webfonts load or the width changes
      onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.12 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '.ab-pin', start: 'top top', end: '+=140%', scrub: true },
      }),
    })

    // Portrait: mask opens from the centre, image counter-scales.
    gsap.timeline({ scrollTrigger: { trigger: '.ab-portrait', start: 'top 85%', end: 'top 25%', scrub: 1 } })
      .fromTo('.ab-portrait', { clipPath: 'inset(30% 30% 30% 30% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none' })
      .fromTo('.ab-portrait img', { scale: 1.4 }, { scale: 1, ease: 'none' }, 0)
    gsap.to('.ab-portrait img', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.ab-portrait', start: 'top bottom', end: 'bottom top', scrub: true } })

    // Big background word drifts sideways.
    gsap.fromTo('.ab-ghost', { xPercent: 10 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.ab-story', start: 'top bottom', end: 'bottom top', scrub: true } })

    // Interest cards flip up in a fanned stagger.
    gsap.from('.ab-card', {
      y: 120, rotateX: -50, opacity: 0, transformOrigin: '50% 100%', duration: 1.1, ease: 'expo.out',
      stagger: { each: 0.08, from: 'start' },
      scrollTrigger: { trigger: '.ab-cards', start: 'top 80%' },
    })

    gsap.from('.ab-fact', { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.ab-facts', start: 'top 85%' } })
  }, { scope: root })

  return (
    <section id="about" ref={root} className="relative" aria-labelledby="about-title">
      <div className="ab-pin flex min-h-svh flex-col justify-center px-5 py-24 md:px-10">
        <div className="mx-auto w-full max-w-[1600px]">
          <SectionLabel index="01" label="About — the story so far" />
          <h2 id="about-title" className="sr-only">About Saran</h2>
          <p className="ab-manifesto mt-10 max-w-[22ch] text-[8.5vw] font-medium leading-[1.02] tracking-tight md:max-w-[26ch] md:text-[4.4vw]">
            {manifesto}
          </p>
        </div>
      </div>

      <div className="ab-story relative overflow-hidden px-5 pb-28 md:px-10">
        <div className="ab-ghost display pointer-events-none absolute left-0 top-10 whitespace-nowrap text-[28vw] text-white/[0.03]" aria-hidden="true">
          BUILDER · PLAYER · ARTIST ·
        </div>
        <div className="relative mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="ab-portrait relative aspect-[4/5] overflow-hidden rounded-3xl bg-steel">
              <img src={portrait} alt="Portrait of Saran V" loading="lazy" width={1195} height={1600} className="h-full w-full object-cover object-[50%_35%] grayscale-[0.35] contrast-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div>
                  <p className="display text-4xl">{profile.name}</p>
                  <p className="mono mt-2 text-fog">{profile.location}</p>
                </div>
                <span className="serif text-2xl text-ember">builder &amp; player</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-12 md:col-span-7 md:pl-10">
            <div className="ab-facts space-y-6">
              <p className="ab-fact text-2xl leading-snug text-snow/80 md:text-3xl">
                I studied Computer Science in Kovilpatti and Trichy, and now work as a
                <span className="text-snow"> {work.title}</span> at <span className="text-snow">{work.company}</span>.
              </p>
              <p className="ab-fact max-w-2xl text-lg leading-relaxed text-fog">
                At work it’s multi-agent LLM pipelines, RAG, Spring Boot services and Angular/React frontends. After hours I
                build my own tools — an AI expense tracker, a video-dubbing pipeline, a gold-price research engine — and I
                still believe the best ideas come while waiting for the next ball.
              </p>
              <div className="ab-fact grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-white/5 sm:grid-cols-3">
                {[
                  ['Role', work.title],
                  ['Since', work.period.split('–')[0].trim()],
                  ['Base', 'Trichy, India'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-ink p-5">
                    <p className="mono text-fog">{k}</p>
                    <p className="mt-2 text-lg">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mono mb-5 text-fog">Six things that make me</p>
              <div className="ab-cards grid grid-cols-2 gap-3 [perspective:1200px] lg:grid-cols-3">
                {interests.map((it) => {
                  const Icon = icons[it.key]
                  return (
                    <Tilt key={it.key} className="ab-card rounded-2xl" max={14}>
                      <div className="glass flex h-full min-h-44 flex-col justify-between rounded-2xl p-5">
                        <Icon className="h-8 w-8" style={{ color: it.color }} />
                        <div>
                          <p className="display text-2xl md:text-3xl">{it.label}</p>
                          <p className="mt-2 text-sm leading-snug text-fog">{it.line}</p>
                        </div>
                      </div>
                    </Tilt>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
