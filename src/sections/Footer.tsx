import { ArrowUp } from 'lucide-react'
import { GithubIcon, LinkedinIcon, UpworkIcon } from '../components/Icons'
import { profile } from '../data/content'
import { scrollToTarget } from '../lib/lenis'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-white/10 px-5 pb-8 pt-16 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <p className="serif max-w-xl text-3xl leading-tight text-snow/80 md:text-4xl">
            Built with code, timed like a cover drive, finished like a through ball.
          </p>
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group flex items-center gap-4 self-start md:self-auto"
            data-cursor="TOP"
          >
            <span className="mono text-fog transition-colors group-hover:text-snow">Back to top</span>
            <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-white/20 transition-colors group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
              <ArrowUp size={20} className="transition-transform duration-500 group-hover:-translate-y-12" />
              <ArrowUp size={20} className="absolute translate-y-12 transition-transform duration-500 group-hover:translate-y-0" />
            </span>
          </button>
        </div>

        <p className="display mt-16 select-none text-center text-[24vw] leading-[0.8] text-white/[0.06]" aria-hidden="true">SARAN V</p>

        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="mono text-fog">© {year} {profile.name} · {profile.location}</p>
          <ul className="flex items-center gap-2">
            {[
              { label: 'GitHub', href: profile.github, Icon: GithubIcon },
              { label: 'LinkedIn', href: profile.linkedin, Icon: LinkedinIcon },
              { label: 'Upwork', href: profile.upwork, Icon: UpworkIcon },
            ].map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 transition-all hover:-translate-y-1 hover:border-snow hover:bg-snow hover:text-ink">
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
