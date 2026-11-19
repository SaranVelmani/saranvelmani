import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { gsap } from '../lib/motion'
import { getLenis } from '../lib/lenis'
import type { MediaItem } from '../data/media'

export default function Lightbox({
  items, index, onClose, onIndex,
}: { items: MediaItem[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const root = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const item = items[index]

  useEffect(() => {
    getLenis()?.stop()
    const prev = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); getLenis()?.start(); prev?.focus() }
  }, [index, items.length, onClose, onIndex])

  useEffect(() => {
    gsap.fromTo('.lb-media', { scale: 0.94, opacity: 0, clipPath: 'inset(8% 8% 8% 8%)' }, { scale: 1, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.out' })
  }, [index])

  return (
    <div ref={root} role="dialog" aria-modal="true" aria-label={item.title} className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <p className="mono text-fog">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} — {item.title}</p>
        <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close viewer" className="glass grid h-12 w-12 place-items-center rounded-full"><X size={20} /></button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-5 pb-10 md:px-24">
        {item.src.match(/\.(mp4|webm)(\?|$)/i)
          ? <video key={item.src} className="lb-media max-h-full max-w-full rounded-xl" src={item.src} poster={item.poster} controls autoPlay playsInline />
          : <img key={item.src} className="lb-media max-h-full max-w-full rounded-xl object-contain" src={item.src} alt={item.title} />}
        {items.length > 1 && (
          <>
            <button type="button" onClick={() => onIndex((index - 1 + items.length) % items.length)} aria-label="Previous" className="glass absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full md:left-8"><ChevronLeft /></button>
            <button type="button" onClick={() => onIndex((index + 1) % items.length)} aria-label="Next" className="glass absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full md:right-8"><ChevronRight /></button>
          </>
        )}
      </div>
    </div>
  )
}
