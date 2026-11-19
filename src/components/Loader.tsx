import { useRef, useState } from 'react'
import { gsap, useGSAP, reducedMotion } from '../lib/motion'

export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useGSAP(() => {
    if (reducedMotion()) { onDone(); gsap.set(root.current, { display: 'none' }); return }
    const n = { v: 0 }
    const tl = gsap.timeline({ onComplete: () => { gsap.set(root.current, { display: 'none' }) } })
    tl.from('.ld-word', { yPercent: 110, duration: 0.9, stagger: 0.08, ease: 'expo.out' })
      .to(n, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => setCount(Math.round(n.v)) }, 0)
      .to('.ld-bar', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
      .to('.ld-word', { yPercent: -110, duration: 0.6, stagger: 0.05, ease: 'expo.in' }, '+=0.15')
      .add(onDone, '-=0.1')
      .to('.ld-panel', { yPercent: -100, duration: 1, stagger: 0.07, ease: 'expo.inOut' }, '-=0.25')
  }, { scope: root })

  return (
    <div ref={root} className="fixed inset-0 z-[90]" aria-hidden="true">
      <div className="absolute inset-0 grid grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="ld-panel h-full bg-coal" />)}
      </div>
      <div className="ld-panel absolute inset-0 flex flex-col items-center justify-center bg-ink">
        <div className="display flex gap-3 text-[13vw] md:text-[8vw]">
          {['SARAN', 'V'].map((w) => (
            <span key={w} className="line-mask"><span className="ld-word inline-block">{w}</span></span>
          ))}
        </div>
        <div className="mt-8 flex w-56 items-center gap-4">
          <div className="h-px flex-1 bg-white/10"><div className="ld-bar h-px origin-left scale-x-0 bg-ember" /></div>
          <span className="mono w-10 text-right text-fog">{String(count).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  )
}
