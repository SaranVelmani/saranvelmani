// Light / dark theme. The initial value is applied by an inline script in index.html
// (saved choice, else the system setting) so the first paint is already correct.
import { reducedMotion } from './motion'

export type Theme = 'light' | 'dark'

export const getTheme = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'

const apply = (t: Theme) => {
  document.documentElement.dataset.theme = t
  try { localStorage.setItem('theme', t) } catch { /* storage blocked — still switches */ }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'light' ? '#f3efe7' : '#07080a')
  window.dispatchEvent(new CustomEvent<Theme>('themechange', { detail: t }))
}

// Switch theme with a circular wipe growing from (x, y) where supported.
export function setTheme(t: Theme, x = innerWidth / 2, y = 0) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
  if (!doc.startViewTransition || reducedMotion()) { apply(t); return }
  const vt = doc.startViewTransition(() => apply(t))
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 750, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
    )
  }).catch(() => {})
}
