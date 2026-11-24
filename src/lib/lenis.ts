import Lenis from 'lenis'
import { gsap, ScrollTrigger, reducedMotion } from './motion'

let lenis: Lenis | null = null

export function startLenis() {
  if (reducedMotion() || lenis) return lenis
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollToTarget(target: string | number, opts: { offset?: number; immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(target as string, { offset: opts.offset ?? 0, duration: 1.4, immediate: opts.immediate })
    return
  }
  if (typeof target === 'number') window.scrollTo({ top: target })
  else document.querySelector(target)?.scrollIntoView()
}

export const getLenis = () => lenis
