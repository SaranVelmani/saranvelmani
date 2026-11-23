import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/motion'
import { scrollToTarget, getLenis } from '../lib/lenis'
import ThemeToggle from './ThemeToggle'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'sports', label: 'Sports' },
  { id: 'creative', label: 'Creative' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav({ ready }: { ready: boolean }) {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const menu = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLElement>(null)

  // Active-section tracking + hide on scroll down / show on scroll up.
  useEffect(() => {
    if (!ready) return
    const triggers = sections.map((s) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => self.isActive && setActive(s.id),
      }),
    )
    const dir = ScrollTrigger.create({
      start: 120,
      end: 'max',
      onUpdate: (self) => setHidden(self.direction === 1),
      onLeaveBack: () => setHidden(false),
    })
    return () => { triggers.forEach((t) => t.kill()); dir.kill() }
  }, [ready])

  useGSAP(() => {
    if (!ready || reducedMotion()) return
    gsap.from(bar.current!.firstElementChild, { yPercent: -120, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.3 })
  }, [ready])

  // Mobile menu open/close animation.
  useGSAP(() => {
    const m = menu.current
    if (!m) return
    const lenis = getLenis()
    if (open) {
      lenis?.stop()
      gsap.set(m, { display: 'flex' })
      gsap.fromTo(m, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.8, ease: 'expo.inOut' })
      gsap.fromTo('.mm-link', { yPercent: 110 }, { yPercent: 0, stagger: 0.05, duration: 0.7, ease: 'expo.out', delay: 0.3 })
    } else {
      lenis?.start()
      gsap.to(m, { clipPath: 'circle(0% at 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: () => { gsap.set(m, { display: 'none' }) } })
    }
  }, { dependencies: [open], scope: menu })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(`#${id}`)
  }

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${hidden && !open ? '-translate-y-full' : ''}`}
      >
        <nav aria-label="Primary" className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
          <a href="#home" onClick={go('home')} className="display text-2xl tracking-wide" data-cursor="TOP">
            SARAN<span className="text-ember">.</span>
          </a>
          <ul className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 lg:flex">
            {sections.map((s) => (
              <li key={s.id} className="relative">
                <a
                  href={`#${s.id}`}
                  onClick={go(s.id)}
                  aria-current={active === s.id ? 'true' : undefined}
                  className={`relative z-10 block rounded-full px-4 py-2 text-sm transition-colors ${active === s.id ? 'text-ink' : 'text-snow/70 hover:text-snow'}`}
                >
                  {s.label}
                </a>
                {active === s.id && <span className="absolute inset-0 rounded-full bg-snow" aria-hidden="true" />}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="#contact" onClick={go('contact')} className="mono hidden rounded-full border border-white/20 px-5 py-3 transition-colors hover:border-ember hover:bg-ember hover:text-onaccent lg:block">
            Let’s talk
          </a>
          <button
            type="button"
            className="glass grid h-12 w-12 place-items-center rounded-full lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          </div>
        </nav>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="fixed inset-0 z-40 hidden flex-col justify-end bg-coal px-6 pb-12 pt-28 lg:hidden"
        style={{ clipPath: 'circle(0% at 100% 0%)' }}
      >
        <ul className="space-y-1">
          {sections.map((s, i) => (
            <li key={s.id} className="line-mask">
              <a href={`#${s.id}`} onClick={go(s.id)} className="mm-link display flex items-baseline gap-4 text-[13vw] leading-none sm:text-7xl">
                <span className="mono text-fog">0{i + 1}</span>
                <span className={active === s.id ? 'text-ember' : ''}>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
