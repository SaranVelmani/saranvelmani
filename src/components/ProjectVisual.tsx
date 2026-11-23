// Animated illustrations for projects that have no public screenshot.
// They depict what each project does (tool names, config shape) — not fake results.
import type { Project } from '../data/content'

const candles = [
  [40, 70, 30, 85], [70, 60, 50, 80], [60, 75, 55, 82], [75, 65, 58, 90], [65, 82, 60, 88],
  [82, 78, 70, 92], [78, 95, 74, 100], [95, 88, 84, 104], [88, 102, 85, 110], [102, 96, 90, 112],
  [96, 110, 92, 118], [110, 120, 104, 126],
]

function Candles({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" aria-hidden="true">
      {[60, 110, 160, 210].map((y) => <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />)}
      {candles.map(([o, c, l, h], i) => {
        const up = c >= o
        const x = 24 + i * 31
        const y = (v: number) => 240 - v * 1.7
        return (
          <g key={i} className="pv-candle" style={{ animationDelay: `${i * 0.08}s` }}>
            <line x1={x} x2={x} y1={y(h)} y2={y(l)} stroke={up ? accent : '#ef4444'} strokeWidth="1.5" />
            <rect x={x - 7} width="14" y={y(Math.max(o, c))} height={Math.max(3, Math.abs(c - o) * 1.7)} rx="2" fill={up ? accent : '#ef4444'} />
          </g>
        )
      })}
      <path d="M10 200 C 90 180, 140 170, 200 130 S 330 70, 395 50" fill="none" stroke="rgba(255,255,255,0.5)" strokeDasharray="4 6" className="pv-dash" />
    </svg>
  )
}

function Terminal({ accent }: { accent: string }) {
  const lines = [
    ['$', 'claude mcp add mt5 -- python -m mt5_mcp.server'],
    ['→', 'account_info()'],
    ['→', 'get_candles("XAUUSD", "M15", 200)'],
    ['→', 'place_order(..., dry_run=true)'],
    ['✓', 'order_check only — nothing sent to market'],
    ['⏻', 'close_all_positions()  // kill switch, always allowed'],
  ]
  return (
    <div className="flex max-h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/60 font-mono text-[10px] leading-snug sm:text-[11px] md:text-sm">
      <div className="flex gap-1.5 border-b border-white/10 px-3 py-2 sm:px-4 sm:py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" />
      </div>
      <div className="space-y-1.5 p-3 sm:space-y-2.5 sm:p-5">
        {lines.map(([p, t], i) => (
          <p key={i} className="pv-line flex gap-2 sm:gap-3" style={{ animationDelay: `${i * 0.35}s` }}>
            <span className="shrink-0" style={{ color: accent }}>{p}</span><span className="min-w-0 break-words text-snow/80">{t}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

function Shield({ accent }: { accent: string }) {
  return (
    <div className="grid h-full w-full grid-cols-5 items-center gap-4 sm:gap-6">
      <svg viewBox="0 0 120 140" className="col-span-2 max-h-full w-full" aria-hidden="true">
        <path d="M60 6 L110 26 V66 C110 100 88 122 60 134 C32 122 10 100 10 66 V26 Z" fill="none" stroke={accent} strokeWidth="2" className="pv-draw" />
        <path d="M40 70 L55 85 L82 55" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" className="pv-draw" style={{ animationDelay: '0.6s' }} />
      </svg>
      <pre className="col-span-3 overflow-hidden rounded-xl border border-white/10 bg-black/60 p-2.5 font-mono text-[8.5px] leading-relaxed text-snow/75 sm:p-4 sm:text-[10px] md:text-xs">
{`[Interface]
PrivateKey = <curve25519>
Address    = 10.8.0.x/32

[Peer]
PublicKey  = <server key>
Endpoint   = vpn:51820
AllowedIPs = 0.0.0.0/0`}
      </pre>
    </div>
  )
}

function Bars({ accent }: { accent: string }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 sm:gap-8">
      <div className="flex h-24 w-full items-end justify-center gap-1 sm:h-32 sm:gap-1.5">
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} className="pv-eq max-w-2 flex-1 rounded-full" style={{ background: accent, animationDelay: `${(i % 7) * 0.12}s`, height: `${30 + ((i * 37) % 70)}%` }} />
        ))}
      </div>
      <div className="mx-auto flex w-3/4 items-center gap-4">
        <span className="h-10 w-10 shrink-0 rounded-full" style={{ background: accent }} />
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"><div className="pv-progress h-full rounded-full" style={{ background: accent }} /></div>
      </div>
    </div>
  )
}

function Download({ accent }: { accent: string }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 sm:gap-4">
      {['GET /api/info', 'validate (zod)', 'rate-limit · helmet', 'stream → client'].map((t, i) => (
        <div key={t} className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 sm:p-4">
          <div className="mb-1.5 flex justify-between gap-2 font-mono text-[10px] text-snow/70 sm:mb-2 sm:text-xs"><span>{t}</span><span style={{ color: accent }}>✓</span></div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div className="pv-progress h-full rounded-full" style={{ background: accent, animationDelay: `${i * 0.3}s` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProjectVisual({ p }: { p: Project }) {
  const V = { candles: Candles, terminal: Terminal, shield: Shield, bars: Bars, download: Download, book: Bars }[p.visual ?? 'bars']
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-4 pb-4 pt-8 sm:p-8 md:p-12" style={{ background: `radial-gradient(circle at 30% 20%, ${p.accent}22, transparent 60%), #0b0d10` }}>
      <V accent={p.accent} />
      <span className="mono absolute right-4 top-3 text-[9px] text-fog/60">Illustration</span>
    </div>
  )
}
