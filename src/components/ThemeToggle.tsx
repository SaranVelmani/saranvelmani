import { useEffect, useRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { gsap } from '../lib/motion'
import { getTheme, setTheme, type Theme } from '../lib/theme'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, set] = useState<Theme>(getTheme)
  const icon = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const on = (e: Event) => set((e as CustomEvent<Theme>).detail)
    window.addEventListener('themechange', on)
    return () => window.removeEventListener('themechange', on)
  }, [])

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    gsap.fromTo(icon.current, { rotate: -90, scale: 0.4 }, { rotate: 0, scale: 1, duration: 0.7, ease: 'back.out(2)' })
    setTheme(theme === 'light' ? 'dark' : 'light', r.left + r.width / 2, r.top + r.height / 2)
  }

  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`glass grid h-12 w-12 place-items-center rounded-full transition-colors hover:text-ember ${className}`}
      data-cursor={next.toUpperCase()}
    >
      <span ref={icon} className="grid place-items-center">{theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}</span>
    </button>
  )
}
