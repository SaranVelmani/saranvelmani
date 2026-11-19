import { useRef } from 'react'
import SectionLabel from '../components/SectionLabel'
import FlipCard from '../components/FlipCard'
import { BatBall, Football } from '../components/Glyphs'
import { gsap, useGSAP, reducedMotion } from '../lib/motion'

const cricketCards = [
  { title: 'Batting', kicker: 'Watch it late', body: 'See the ball early, commit late. Reading line and length feels a lot like reading a stack trace — notice the detail first, then play the shot.' },
  { title: 'Bowling', kicker: 'Every over is an experiment', body: 'Set a plan, change one variable, watch what the batter does. Then adjust. It’s the same loop I use to tune a model.' },
  { title: 'Fielding', kicker: 'The underrated craft', body: 'Anticipation, a clean pick-up and a flat throw into the keeper’s gloves. Nobody claps for it, and it wins games.' },
]

const footballCards = [
  { title: 'Movement', kicker: 'Off the ball', body: 'The best runs happen when you don’t have the ball. Find the space before the pass arrives.' },
  { title: 'Vision', kicker: 'Look up first', body: 'Scan before you receive. Knowing your next move before the ball reaches you is half the game.' },
  { title: 'Team play', kicker: 'Nobody scores alone', body: 'One pass, one run, one finish — eleven people moving as one system. Same as a good codebase.' },
]

// Pitch geometry (viewBox 1000 x 640): bowler's end at the bottom, stumps at the top.
const ballPath = 'M500,610 C505,520 515,430 522,360 C518,290 508,220 500,168'
const passPath = 'M180,470 C260,420 300,300 380,260 C460,220 520,380 600,360 C680,340 700,220 780,250 C840,270 880,300 948,310'

export default function Sports() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (reducedMotion()) return

    // Intro words slam in.
    gsap.from('.sp-intro .line-mask > span', { yPercent: 110, skewY: 6, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.sp-intro', start: 'top 75%' } })

    // ── CRICKET: pinned delivery. Ball travels down the pitch, bails fly.
    const ck = gsap.timeline({ scrollTrigger: { trigger: '.ck-stage', start: 'top top', end: '+=160%', scrub: 1, pin: true } })
    ck.from('.ck-word', { yPercent: 40, opacity: 0, ease: 'none', duration: 0.6 }, 0)
      .from('.ck-pitch', { scaleY: 0.4, opacity: 0, transformOrigin: '50% 100%', ease: 'none', duration: 0.5 }, 0)
      .fromTo('.ck-ball', { scale: 1.8 }, { scale: 0.7, motionPath: { path: ballPath, align: '#ck-path', alignOrigin: [0.5, 0.5] }, ease: 'none', duration: 1 }, 0.4)
      .to('.ck-ball-spin', { rotate: 900, ease: 'none', duration: 1 }, 0.4)
      .fromTo('.ck-bounce', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.08 }, 0.82)
      .to('.ck-bounce', { scale: 2.4, opacity: 0, duration: 0.3 }, 0.9)
      .to('.ck-bail-l', { x: -60, y: -80, rotate: -200, ease: 'power2.out', duration: 0.4 }, 1.38)
      .to('.ck-bail-r', { x: 70, y: -70, rotate: 220, ease: 'power2.out', duration: 0.4 }, 1.38)
      .to('.ck-stump-m', { rotate: 10, transformOrigin: '50% 100%', duration: 0.3 }, 1.38)
      .fromTo('.ck-flash', { opacity: 0 }, { opacity: 0.9, duration: 0.05 }, 1.38)
      .to('.ck-flash', { opacity: 0, duration: 0.4 }, 1.43)
      .from('.ck-out', { scale: 3, opacity: 0, ease: 'expo.out', duration: 0.4 }, 1.42)

    gsap.from('.ck-card', { y: 100, opacity: 0, rotateX: -40, stagger: 0.12, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.ck-cards', start: 'top 80%' } })

    // ── FOOTBALL: field lines draw, ball strings passes, net ripples.
    const lines = gsap.utils.toArray<SVGGeometryElement>('.fb-line')
    lines.forEach((l) => { const len = l.getTotalLength(); gsap.set(l, { strokeDasharray: len, strokeDashoffset: len }) })
    const fb = gsap.timeline({ scrollTrigger: { trigger: '.fb-stage', start: 'top top', end: '+=170%', scrub: 1, pin: true } })
    fb.to(lines, { strokeDashoffset: 0, stagger: 0.03, ease: 'none', duration: 0.6 }, 0)
      .from('.fb-word', { xPercent: -30, opacity: 0, ease: 'none', duration: 0.5 }, 0)
      .from('.fb-player', { scale: 0, opacity: 0, transformOrigin: '50% 50%', stagger: 0.05, duration: 0.2 }, 0.4)
      .fromTo('.fb-trail', { strokeDashoffset: 1400 }, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0.7)
      .to('.fb-ball', { motionPath: { path: passPath, align: '#fb-path', alignOrigin: [0.5, 0.5] }, ease: 'none', duration: 1 }, 0.7)
      .to('.fb-ball-spin', { rotate: 1080, ease: 'none', duration: 1 }, 0.7)
      .to('.fb-net', { scaleX: 1.12, transformOrigin: '0% 50%', yoyo: true, repeat: 3, duration: 0.05 }, 1.7)
      .from('.fb-goal', { scale: 3, opacity: 0, ease: 'expo.out', duration: 0.4 }, 1.7)

    gsap.from('.fb-card', { y: 100, opacity: 0, rotateY: 30, stagger: 0.12, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.fb-cards', start: 'top 80%' } })
  }, { scope: root })

  return (
    <section id="sports" ref={root} className="relative" aria-labelledby="sports-title">
      {/* Intro */}
      <div className="sp-intro mx-auto max-w-[1600px] px-5 pb-16 pt-32 md:px-10 md:pt-44">
        <SectionLabel index="05" label="Sports — the other half of me" />
        <h2 id="sports-title" className="display mt-8 text-[17vw] md:text-[11vw]">
          <span className="line-mask"><span className="block">Off the</span></span>
          <span className="line-mask"><span className="block">screen, <span className="text-ember">on</span></span></span>
          <span className="line-mask"><span className="block outline-text">the field.</span></span>
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-fog">
          Cricket and football aren’t hobbies on a list — they’re how I learned patience, timing and playing for a team. No trophies to show here. Just the love of the game.
        </p>
      </div>

      {/* CRICKET */}
      <div className="ck-stage relative h-svh overflow-hidden bg-[#080a08]">
        <div className="floodlight pointer-events-none absolute -left-1/4 -top-1/3 h-[90vh] w-[70vw] rotate-12" />
        <div className="floodlight pointer-events-none absolute -right-1/4 -top-1/3 h-[90vh] w-[70vw] -rotate-12" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(34,120,60,0.35),transparent_70%)]" />
        <div className="ck-flash pointer-events-none absolute inset-0 z-20 bg-white opacity-0" />

        <p className="ck-word display pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 whitespace-nowrap text-[26vw] leading-none text-white/[0.07] md:text-[20vw]" aria-hidden="true">CRICKET</p>

        <svg viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="ck-turf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3b3324" />
              <stop offset="1" stopColor="#6b5a3b" />
            </linearGradient>
            <radialGradient id="ck-ballg" cx="35%" cy="35%">
              <stop offset="0" stopColor="#ff7a6a" />
              <stop offset="1" stopColor="#a8161b" />
            </radialGradient>
          </defs>
          <g className="ck-pitch">
            <path d="M455,150 L545,150 L640,640 L360,640 Z" fill="url(#ck-turf)" opacity="0.85" />
            <line x1="440" y1="180" x2="560" y2="180" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
            <line x1="380" y1="560" x2="620" y2="560" stroke="#fff" strokeOpacity=".7" strokeWidth="3" />
          </g>
          {/* stumps */}
          <g>
            <rect x="484" y="110" width="5" height="62" fill="#f1e6cf" />
            <rect className="ck-stump-m" x="497.5" y="110" width="5" height="62" fill="#f1e6cf" />
            <rect x="511" y="110" width="5" height="62" fill="#f1e6cf" />
            <rect className="ck-bail-l" x="484" y="106" width="16" height="4" rx="2" fill="#f5c451" />
            <rect className="ck-bail-r" x="500" y="106" width="16" height="4" rx="2" fill="#f5c451" />
          </g>
          <path id="ck-path" d={ballPath} fill="none" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 8" />
          <circle className="ck-bounce" cx="522" cy="360" r="18" fill="none" stroke="#fff" strokeOpacity=".7" />
          <g className="ck-ball">
            <g className="ck-ball-spin">
              <circle r="14" fill="url(#ck-ballg)" />
              <path d="M-10,-9 C-3,-3 -3,3 -10,9 M10,-9 C3,-3 3,3 10,9" stroke="#fff" strokeOpacity=".8" strokeWidth="1.3" fill="none" />
            </g>
          </g>
        </svg>

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-between px-5 pb-10 pt-28 md:px-10">
          <div className="flex items-start justify-between">
            <div>
              <BatBall className="h-10 w-10 text-ember" />
              <p className="display mt-4 text-5xl md:text-7xl">Cricket</p>
              <p className="serif mt-2 text-2xl text-snow/70 md:text-3xl">Line. Length. Patience.</p>
            </div>
            <p className="mono hidden max-w-[16ch] text-right text-fog md:block">Scroll to bowl the delivery</p>
          </div>
          <p className="ck-out display self-center text-[22vw] leading-none text-ember drop-shadow-[0_0_40px_rgba(255,106,43,0.6)] md:text-[12vw]" aria-hidden="true">Bowled.</p>
        </div>
      </div>

      <div className="ck-cards mx-auto grid max-w-[1600px] gap-4 px-5 py-20 [perspective:1400px] md:grid-cols-3 md:px-10">
        {cricketCards.map((c, i) => (
          <div key={c.title} className="ck-card">
            <FlipCard
              accent="#ff6a2b"
              front={<>
                <span className="mono text-fog">0{i + 1} / Cricket</span>
                <span>
                  <span className="display block text-6xl">{c.title}</span>
                  <span className="serif mt-2 block text-2xl text-ember">{c.kicker}</span>
                </span>
              </>}
              back={<>
                <span className="mono">{c.title}</span>
                <span className="text-xl font-medium leading-snug">{c.body}</span>
              </>}
            />
          </div>
        ))}
      </div>

      {/* FOOTBALL */}
      <div className="fb-stage relative h-svh overflow-hidden bg-[#06100a]">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.025)_0,rgba(255,255,255,0.025)_8vw,transparent_8vw,transparent_16vw)]" />
        <div className="floodlight pointer-events-none absolute -top-1/3 left-1/2 h-[80vh] w-[90vw] -translate-x-1/2" />
        <p className="fb-word display pointer-events-none absolute bottom-[4%] left-0 whitespace-nowrap text-[24vw] leading-none text-white/[0.06] md:text-[19vw]" aria-hidden="true">FOOTBALL</p>

        <svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 m-auto h-[78%] w-[94%]" aria-hidden="true">
          <g fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2">
            <rect className="fb-line" x="40" y="40" width="920" height="540" />
            <line className="fb-line" x1="500" y1="40" x2="500" y2="580" />
            <circle className="fb-line" cx="500" cy="310" r="80" />
            <rect className="fb-line" x="40" y="160" width="140" height="300" />
            <rect className="fb-line" x="820" y="160" width="140" height="300" />
            <rect className="fb-line" x="40" y="240" width="50" height="140" />
            <rect className="fb-line" x="910" y="240" width="50" height="140" />
            <path className="fb-line" d="M180,250 A70,70 0 0 1 180,370" />
            <path className="fb-line" d="M820,250 A70,70 0 0 0 820,370" />
          </g>
          <g className="fb-net">
            <rect x="960" y="270" width="26" height="80" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.6)" />
            {[285, 300, 315, 330].map((y) => <line key={y} x1="960" x2="986" y1={y} y2={y} stroke="rgba(255,255,255,0.25)" />)}
          </g>
          <path id="fb-path" d={passPath} fill="none" stroke="none" />
          <path className="fb-trail" d={passPath} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="1400" strokeLinecap="round" opacity=".8" />
          {[[180, 470], [380, 260], [600, 360], [780, 250], [300, 140], [660, 520]].map(([x, y], i) => (
            <g key={i} className="fb-player">
              <circle cx={x} cy={y} r="16" fill={i < 4 ? '#22c55e' : 'rgba(255,255,255,0.15)'} fillOpacity={i < 4 ? 0.25 : 1} stroke={i < 4 ? '#22c55e' : 'rgba(255,255,255,0.4)'} strokeWidth="2" />
              <circle cx={x} cy={y} r="5" fill={i < 4 ? '#22c55e' : 'rgba(255,255,255,0.6)'} />
            </g>
          ))}
          <g className="fb-ball" transform="translate(180,470)">
            <g className="fb-ball-spin">
              <circle r="10" fill="#fff" />
              <path d="M0,-4 L4,-1 L2.5,4 L-2.5,4 L-4,-1 Z" fill="#111" />
            </g>
          </g>
        </svg>

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-between px-5 pb-10 pt-28 md:px-10">
          <div className="flex items-start justify-between">
            <div>
              <Football className="h-10 w-10 text-turf" />
              <p className="display mt-4 text-5xl md:text-7xl">Football</p>
              <p className="serif mt-2 text-2xl text-snow/70 md:text-3xl">Space. Movement. The final pass.</p>
            </div>
            <p className="mono hidden max-w-[16ch] text-right text-fog md:block">Scroll to play it through</p>
          </div>
          <p className="fb-goal display self-end text-[22vw] leading-none text-turf drop-shadow-[0_0_40px_rgba(34,197,94,0.5)] md:text-[12vw]" aria-hidden="true">Goal.</p>
        </div>
      </div>

      <div className="fb-cards mx-auto grid max-w-[1600px] gap-4 px-5 py-20 [perspective:1400px] md:grid-cols-3 md:px-10">
        {footballCards.map((c, i) => (
          <div key={c.title} className="fb-card">
            <FlipCard
              accent="#22c55e"
              front={<>
                <span className="mono text-fog">0{i + 1} / Football</span>
                <span>
                  <span className="display block text-6xl">{c.title}</span>
                  <span className="serif mt-2 block text-2xl text-turf">{c.kicker}</span>
                </span>
              </>}
              back={<>
                <span className="mono">{c.title}</span>
                <span className="text-xl font-medium leading-snug">{c.body}</span>
              </>}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
