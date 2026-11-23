import { useEffect, useState } from 'react'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Journey from './sections/Journey'
import Sports from './sections/Sports'
import Creative from './sections/Creative'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from './lib/motion'
import { startLenis } from './lib/lenis'
import { orbitTech } from './data/content'
import { getTheme } from './lib/theme'

// Background tint per section — the page "changes light" as you move through it.
// [section, dark tint, light tint]
const tints: [string, string, string][] = [
  ['#about', '#07080a', '#f3efe7'],
  ['#skills', '#080a10', '#eceef3'],
  ['#projects', '#07080a', '#f3efe7'],
  ['#sports', '#060806', '#ecf1ea'],
  ['#creative', '#0b0a0d', '#f2ecf0'],
  ['#contact', '#07080a', '#f3efe7'],
]
let activeTint = -1
const tintColor = () => (activeTint < 0 ? null : tints[activeTint][getTheme() === 'light' ? 2 : 1])

function Marquee() {
  const items = [...orbitTech, ...orbitTech]
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-5" aria-hidden="true">
      <div className="marquee-track flex w-max gap-10">
        {items.map((t, i) => (
          <span key={i} className="display flex items-center gap-10 text-3xl text-snow/30 md:text-5xl">
            {t}<span className="text-ember">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)

  // Lock scrolling behind the loader and always start at the top.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    document.documentElement.style.overflow = ready ? '' : 'hidden'
    if (!ready) window.scrollTo(0, 0)
  }, [ready])

  useEffect(() => {
    if (!ready) return
    startLenis()
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [ready])

  useGSAP(() => {
    gsap.to('.progress-bar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })
    if (reducedMotion()) return
    tints.forEach(([sel], i) => {
      ScrollTrigger.create({
        trigger: sel, start: 'top 50%', end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) activeTint = i
          else if (activeTint === i) activeTint = -1
          gsap.to('.bg-tint', { backgroundColor: tintColor() ?? (getTheme() === 'light' ? '#f3efe7' : '#07080a'), duration: 1.2, ease: 'power2.out' })
        },
      })
    })
    // Theme switch: jump the tint straight to the new palette (the wipe hides the change).
    const onTheme = () => gsap.set('.bg-tint', { backgroundColor: tintColor() ?? (getTheme() === 'light' ? '#f3efe7' : '#07080a') })
    window.addEventListener('themechange', onTheme)
    return () => window.removeEventListener('themechange', onTheme)
  })

  return (
    <>
      <a href="#about" className="skip-link rounded-full bg-snow px-4 py-2 text-ink">Skip to content</a>
      <div className="bg-tint fixed inset-0 -z-10 bg-ink" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="fixed inset-x-0 top-0 z-[55] h-[2px]" aria-hidden="true">
        <div className="progress-bar h-full origin-left scale-x-0 bg-gradient-to-r from-volt to-ember" />
      </div>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Sports />
        <Creative />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
