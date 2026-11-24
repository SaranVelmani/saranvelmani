// Light / dark theme. The initial value is applied by an inline script in index.html
// (saved choice, else the system setting) so the first paint is already correct.
import { reducedMotion } from './motion'

export type Theme = 'light' | 'dark'

const BG: Record<Theme, string> = { light: '#f3efe7', dark: '#07080a' }

export const getTheme = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'

const apply = (t: Theme) => {
  document.documentElement.dataset.theme = t
  try { localStorage.setItem('theme', t) } catch { /* storage blocked — still switches */ }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BG[t])
  window.dispatchEvent(new CustomEvent<Theme>('themechange', { detail: t }))
}

let busy = false

// A solid disc of the new background grows from (x, y) and covers the screen; the theme is
// swapped underneath it (so the restyle cost is hidden), then the disc fades away.
// Only one cheap element animates — no full-page snapshots.
export function setTheme(t: Theme, x = innerWidth / 2, y = 0) {
  if (busy) return
  if (reducedMotion() || !('animate' in Element.prototype)) { apply(t); return }
  busy = true
  const r = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)))
  const disc = document.createElement('div')
  disc.setAttribute('aria-hidden', 'true')
  disc.style.cssText = `position:fixed;inset:0;z-index:95;pointer-events:none;background:${BG[t]};will-change:clip-path,opacity`
  document.body.appendChild(disc)
  const grow = disc.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 520, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' },
  )
  grow.finished.then(() => {
    apply(t)
    // wait two frames so the new theme has painted before revealing it
    requestAnimationFrame(() => requestAnimationFrame(() => {
      disc.animate({ opacity: [1, 0] }, { duration: 380, easing: 'ease-out', fill: 'forwards' })
        .finished.finally(() => { disc.remove(); busy = false })
    }))
  }).catch(() => { apply(t); disc.remove(); busy = false })
}
