import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Mail, Send } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import { GithubIcon, LinkedinIcon, UpworkIcon } from '../components/Icons'
import { gsap, useGSAP, reducedMotion, finePointer } from '../lib/motion'
import { profile } from '../data/content'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>

const socials = [
  { label: 'GitHub', href: profile.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: profile.linkedin, Icon: LinkedinIcon },
  { label: 'Upwork', href: profile.upwork, Icon: UpworkIcon },
]

function Magnetic({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const el = useRef<HTMLDivElement>(null)
  const move = (e: React.PointerEvent) => {
    if (!finePointer() || reducedMotion()) return
    const r = el.current!.getBoundingClientRect()
    gsap.to(el.current, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3.out' })
  }
  const leave = () => gsap.to(el.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' })
  return <div ref={el} onPointerMove={move} onPointerLeave={leave} className={`inline-block ${className}`}>{children}</div>
}

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  useGSAP(() => {
    if (reducedMotion()) return
    gsap.from('.ct-title .line-mask > span', { yPercent: 110, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.ct-title', start: 'top 80%' } })
    gsap.fromTo('.ct-orb', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 1 } })
    gsap.from('.ct-social', { y: 40, opacity: 0, rotate: -20, stagger: 0.1, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: '.ct-socials', start: 'top 90%' } })
    gsap.from('.ct-field', { y: 30, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.ct-form', start: 'top 80%' } })
  }, { scope: root })

  const validate = (v = values): Errors => {
    const e: Errors = {}
    if (v.name.trim().length < 2) e.name = 'Please tell me your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That email doesn’t look right.'
    if (v.message.trim().length < 10) e.message = 'A few more words, please (10+ characters).'
    return e
  }

  const onChange = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [k]: e.target.value }
    setValues(next)
    if (errors[k]) setErrors({ ...errors, [k]: validate(next)[k] })
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`ct-${first}`)?.focus()
      return
    }
    // No backend: hand the message to the visitor's mail app, ready to send.
    const subject = encodeURIComponent(`Hello from ${values.name.trim()}`)
    const body = encodeURIComponent(`${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* clipboard blocked: the mailto link still works */ }
  }

  const field = 'w-full rounded-2xl border bg-white/[0.03] px-5 py-4 text-snow placeholder:text-fog/60 outline-none transition-colors focus:border-volt focus:bg-white/[0.05]'

  return (
    <section id="contact" ref={root} className="relative overflow-hidden px-5 pb-16 pt-32 md:px-10 md:pt-44" aria-labelledby="contact-title">
      <div className="ct-orb pointer-events-none absolute left-1/2 top-1/3 h-[70vw] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,106,43,0.25),rgba(61,139,255,0.12)_45%,transparent_70%)] blur-2xl" />
      <div className="relative mx-auto max-w-[1600px]">
        <SectionLabel index="07" label="Contact — say hello" />
        <h2 id="contact-title" className="ct-title display mt-8 text-[17vw] md:text-[11vw]">
          <span className="line-mask"><span className="block">Let’s build</span></span>
          <span className="line-mask"><span className="block"><span className="outline-text">something</span> <span className="serif normal-case text-ember">real.</span></span></span>
        </h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xl leading-relaxed text-snow/80">
              Freelance build, a full-time role, a side project — or just a chat about last night’s match. My inbox is open.
            </p>
            <div className="mt-10 space-y-4">
              <a href={`mailto:${profile.email}`} className="group flex items-center gap-4 text-2xl md:text-3xl" data-cursor="MAIL">
                <span className="glass grid h-14 w-14 shrink-0 place-items-center rounded-full transition-colors group-hover:bg-ember group-hover:text-ink"><Mail size={22} /></span>
                <span className="break-all border-b border-transparent transition-colors group-hover:border-snow">{profile.email}</span>
              </a>
              <button type="button" onClick={copy} className="mono ml-[4.5rem] inline-flex items-center gap-2 text-fog transition-colors hover:text-snow">
                {copied ? <><Check size={14} className="text-turf" /> Copied</> : <><Copy size={14} /> Copy address</>}
              </button>
            </div>
            <div className="ct-socials mt-12 flex flex-wrap gap-3">
              {socials.map(({ label, href, Icon }) => (
                <Magnetic key={label} className="ct-social">
                  <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="group glass flex items-center gap-3 rounded-full py-3 pl-3 pr-5 transition-colors hover:bg-snow hover:text-ink">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:bg-ink group-hover:text-snow"><Icon className="h-4 w-4" /></span>
                    <span className="text-sm font-medium">{label}</span>
                    <ArrowUpRight size={14} />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          <form onSubmit={submit} noValidate className="ct-form glass space-y-5 rounded-3xl p-6 md:p-10 lg:col-span-7" aria-describedby="ct-note">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="ct-field">
                <label htmlFor="ct-name" className="mono mb-2 block text-fog">Your name</label>
                <input id="ct-name" name="name" autoComplete="name" value={values.name} onChange={onChange('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'ct-name-err' : undefined} className={`${field} ${errors.name ? 'border-red-400' : 'border-white/10'}`} placeholder="Jane Doe" />
                {errors.name && <p id="ct-name-err" className="mt-2 text-sm text-red-400">{errors.name}</p>}
              </div>
              <div className="ct-field">
                <label htmlFor="ct-email" className="mono mb-2 block text-fog">Your email</label>
                <input id="ct-email" name="email" type="email" autoComplete="email" value={values.email} onChange={onChange('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'ct-email-err' : undefined} className={`${field} ${errors.email ? 'border-red-400' : 'border-white/10'}`} placeholder="you@example.com" />
                {errors.email && <p id="ct-email-err" className="mt-2 text-sm text-red-400">{errors.email}</p>}
              </div>
            </div>
            <div className="ct-field">
              <label htmlFor="ct-message" className="mono mb-2 block text-fog">Message</label>
              <textarea id="ct-message" name="message" rows={6} value={values.message} onChange={onChange('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'ct-message-err' : undefined} className={`${field} resize-none ${errors.message ? 'border-red-400' : 'border-white/10'}`} placeholder="Tell me about the project, the role, or the match…" />
              {errors.message && <p id="ct-message-err" className="mt-2 text-sm text-red-400">{errors.message}</p>}
            </div>
            <div className="ct-field flex flex-wrap items-center justify-between gap-4">
              <p id="ct-note" className="text-sm text-fog">Opens your email app with the message ready to send.</p>
              <button type="submit" className="group inline-flex items-center gap-3 rounded-full bg-snow px-7 py-4 font-semibold text-ink transition-colors hover:bg-ember" data-cursor="SEND">
                Send message <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
            <p role="status" aria-live="polite" className="text-sm text-turf">{sent ? 'Your mail app should be open with the message filled in. Thanks for reaching out!' : ''}</p>
          </form>
        </div>
      </div>
    </section>
  )
}
