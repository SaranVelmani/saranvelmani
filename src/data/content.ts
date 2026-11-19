// Every fact on this site comes from Saran's own project folders (D:\projects\saran),
// their READMEs, his earlier portfolio and his GitHub account. Nothing here is invented:
// no fake stats, no made-up clients, no proficiency percentages.

import mero from '../assets/projects/mero.png'
import clipdub from '../assets/projects/clipdub.png'
import restaurant from '../assets/projects/restaurant-menu.png'
import supermarket from '../assets/projects/supermarket-catalog.png'
import garage from '../assets/projects/garage-tracker.png'
import saas from '../assets/projects/saas-landing.webp'
import dental from '../assets/projects/dental-clinic.webp'
import coach from '../assets/projects/coach-site.webp'

export const profile = {
  name: 'Saran V',
  first: 'SARAN',
  last: 'VELMANI',
  role: 'Full-Stack Engineer',
  focus: 'AI systems, apps & tools',
  location: 'Trichy, Tamil Nadu, India',
  email: 'saranvelmanik@gmail.com',
  github: 'https://github.com/SaranVelmani',
  linkedin: 'https://linkedin.com/in/saranvelmani',
  upwork: 'https://www.upwork.com/freelancers/~01ca94dec595af3172',
}

export const heroLines = ['CREATIVE MIND.', 'DIGITAL BUILDER.', 'PASSIONATE PLAYER.']

export const manifesto =
  'I build software the way I play — read the field, pick the gap, commit to the shot. By day I ship AI pipelines and full-stack products. The rest of the time I am at the crease, on the pitch, behind a pencil, a lens or an editing timeline.'

export const interests = [
  { key: 'code', label: 'Technology', line: 'AI pipelines, APIs, apps — built end to end.', color: '#3d8bff' },
  { key: 'cricket', label: 'Cricket', line: 'Bat, ball, and the patience between deliveries.', color: '#ff6a2b' },
  { key: 'football', label: 'Football', line: 'Space, movement, and the pass nobody saw.', color: '#22c55e' },
  { key: 'draw', label: 'Drawing', line: 'Pencil first. Shapes before details.', color: '#e5e7eb' },
  { key: 'photo', label: 'Photography', line: 'Light, framing, and waiting for the moment.', color: '#f5c451' },
  { key: 'video', label: 'Video Editing', line: 'Cuts, rhythm, and story in the timeline.', color: '#a78bfa' },
] as const

export type SkillGroup = { id: string; title: string; blurb: string; items: string[]; evidence: string }

// Each group lists where the skill is actually used, so nothing is claimed without a project behind it.
export const skillGroups: SkillGroup[] = [
  {
    id: 'ai', title: 'AI & Agents', blurb: 'Multi-agent pipelines, retrieval and LLM tooling.',
    items: ['LangGraph', 'LangChain', 'RAG', 'Groq', 'MCP servers', 'faster-whisper', 'edge-tts', 'ChromaDB'],
    evidence: 'ClipDub · mt5-mcp · Gold AI · Mero',
  },
  {
    id: 'frontend', title: 'Frontend', blurb: 'Product UIs from enterprise dashboards to landing pages.',
    items: ['React', 'Next.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'React Query', 'Recharts', 'GSAP'],
    evidence: 'Mero · ClipDub · Media Downloader · Web demos',
  },
  {
    id: 'backend', title: 'Backend & APIs', blurb: 'Typed, validated, secured services.',
    items: ['Java 21', 'Spring Boot', 'Spring Security', 'JWT', 'Python', 'FastAPI', 'Node.js', 'Express', 'zod'],
    evidence: 'm-vpn · Gold AI · ClipDub · Media Downloader',
  },
  {
    id: 'data', title: 'Data & ML', blurb: 'Schemas, security and models that are judged honestly.',
    items: ['PostgreSQL', 'Supabase', 'Row-Level Security', 'Flyway', 'pandas', 'XGBoost', 'LightGBM', 'Optuna'],
    evidence: 'Mero · Gold AI · m-vpn',
  },
  {
    id: 'cloud', title: 'Cloud & DevOps', blurb: 'Shipping it and keeping it running.',
    items: ['Docker', 'AWS Lambda', 'S3', 'Step Functions', 'Vercel', 'Render', 'GitHub Pages', 'CI/CD'],
    evidence: 'Media Downloader · ClipDub · Mero · professional work',
  },
  {
    id: 'mobile', title: 'Mobile & Quality', blurb: 'Cross-platform apps, tested properly.',
    items: ['Flutter', 'Dart', 'Riverpod', 'just_audio', 'Vitest', 'pytest', 'Playwright', 'Git'],
    evidence: 'Pulse · m-vpn · Mero · mt5-mcp',
  },
]

export const orbitTech = [
  'React', 'TypeScript', 'Next.js', 'Angular', 'Java', 'Spring Boot', 'Python', 'FastAPI',
  'LangGraph', 'PostgreSQL', 'Supabase', 'Docker', 'AWS', 'Flutter', 'Node.js', 'MCP',
]

export type Project = {
  name: string
  tag: string
  year: string
  accent: string
  purpose: string
  role: string
  features: string[]
  highlight: string
  stack: string[]
  images: string[]
  visual?: 'candles' | 'shield' | 'bars' | 'book' | 'download' | 'terminal'
  code?: string
  live?: string
  privateRepo?: boolean
}

export const projects: Project[] = [
  {
    name: 'Mero',
    tag: 'AI Expense Tracker',
    year: '2026',
    accent: '#3d8bff',
    purpose: 'Type “Petrol 250” and it becomes a ₹250 Transport expense, dated today, with the dashboard updating live. No forms.',
    role: 'Designed and built solo: data model, parser, UI, tests.',
    features: [
      'Chat-first entry: amounts, natural dates, categories, budgets, loans, recurring rules, bulk paste',
      'Deterministic parser by default; an LLM is consulted only on low-confidence phrasing',
      'Supabase Auth (email + Google OAuth) and Realtime → React Query invalidation',
      'Charts on a colour-vision-deficiency-validated palette',
    ],
    highlight: '144 Vitest tests, including row-level-security tests against a real Postgres.',
    stack: ['Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL', 'RLS', 'Tailwind', 'Recharts', 'Vitest'],
    images: [mero],
    live: 'https://expense-ai-ten-tau.vercel.app',
    privateRepo: true,
  },
  {
    name: 'ClipDub',
    tag: 'AI Video Repurposing',
    year: '2026',
    accent: '#8b5cf6',
    purpose: 'Turns a long video into captioned 9:16 short clips, a multi-language AI dub, or both in one pass.',
    role: 'Designed the pipeline and built backend + frontend.',
    features: [
      'Ingest from a YouTube/Instagram link or upload, extract audio with ffmpeg',
      'Local transcription with faster-whisper: no API cost',
      'LLM scores the transcript for viral segments → cut → reframe to 9:16 → burn captions',
      'Translate → per-segment TTS → time-align to the original → remux',
    ],
    highlight: 'In-memory job queue with a concurrency cap and a documented path to multi-worker scale.',
    stack: ['Node.js', 'Express', 'TypeScript', 'Next.js 15', 'React Query', 'Python', 'ffmpeg', 'Groq'],
    images: [clipdub],
    live: 'https://clipdub.vercel.app',
    privateRepo: true,
  },
  {
    name: 'Gold AI',
    tag: 'XAUUSD Research System',
    year: '2026',
    accent: '#f5c451',
    purpose: 'An intraday gold-price research system: walk-forward trained models, a live FastAPI engine and a dashboard — with strict rules on which numbers may influence a decision.',
    role: 'Built the data pipeline, training, validation gates and serving.',
    features: [
      'Deep 5-minute XAUUSD history plus macro, futures and news archives',
      'Walk-forward training with a meta-labeling model and a gated save',
      'Train/serve parity checks so live features match the training ones',
      'FastAPI + WebSocket backend feeding a React dashboard',
    ],
    highlight: 'Live-only signals (like today’s news sentiment) are kept out of training by design — no look-ahead leaks.',
    stack: ['Python', 'XGBoost', 'LightGBM', 'Optuna', 'pandas', 'FastAPI', 'WebSockets', 'React'],
    images: [],
    visual: 'candles',
    privateRepo: true,
  },
  {
    name: 'mt5-mcp',
    tag: 'MCP Server for Trading Terminals',
    year: '2026',
    accent: '#ff6a2b',
    purpose: 'Connects Claude, or any MCP client, to a MetaTrader 5 terminal: market data, positions, history and orders.',
    role: 'Designed the tool surface and the safety model.',
    features: [
      'Tools for account, symbols, ticks, candles (M1–W1), positions and deal history',
      'Orders are dry-run by default (broker order_check only)',
      'A live order needs several independent switches to all agree',
      'Close-all is always allowed, as a kill switch',
    ],
    highlight: 'Safety by construction: the risky path is the one that takes the most deliberate steps.',
    stack: ['Python', 'MCP', 'MetaTrader 5 API', 'pytest'],
    images: [],
    visual: 'terminal',
    privateRepo: true,
  },
  {
    name: 'm-vpn',
    tag: 'Self-hosted VPN Service',
    year: '2026',
    accent: '#22d3ee',
    purpose: 'A ₹0 VPN service: auth, WireGuard peer management and ready-to-import client configs.',
    role: 'Built the Spring Boot backend and the Flutter client.',
    features: [
      'Register → login → create peer → list → revoke, verified round-trip',
      'WireGuard Curve25519 keys generated in pure Java (BouncyCastle)',
      'Generates ready-to-import client .conf files',
      'Dev profile on H2, production on PostgreSQL',
    ],
    highlight: 'Key generation needs no native binary; only applying peers touches the live interface.',
    stack: ['Java 21', 'Spring Boot 3', 'Spring Security', 'JWT', 'PostgreSQL', 'WireGuard', 'Flutter'],
    images: [],
    visual: 'shield',
    privateRepo: true,
  },
  {
    name: 'Pulse',
    tag: 'Flutter Music Player',
    year: '2026',
    accent: '#22c55e',
    purpose: 'A cross-platform music app that streams, plays device files and keeps playing in the background.',
    role: 'Built the app: state, player and UI.',
    features: [
      'Background playback with just_audio and audio_session',
      'Streaming catalogue plus the local device library',
      'Riverpod state management across player and screens',
      'Android and web targets from one codebase',
    ],
    highlight: 'A single player controller drives every screen, so playback state never drifts.',
    stack: ['Flutter', 'Dart', 'Riverpod', 'just_audio', 'REST APIs'],
    images: [],
    visual: 'bars',
  },
  {
    name: 'Media Downloader',
    tag: 'Full-Stack Web App',
    year: '2026',
    accent: '#ec4899',
    purpose: 'Fetches and downloads media from public links, with a hardened API in front.',
    role: 'Built the Next.js frontend and the Express API.',
    features: [
      'Express 5 API with helmet, compression and rate limiting',
      'Request validation with zod and a shared error pattern',
      'Dockerised backend with a separate proxy service',
      'Deployed via a Render blueprint',
    ],
    highlight: 'Its error-handling conventions became the template for ClipDub’s backend.',
    stack: ['Next.js', 'TypeScript', 'Express 5', 'zod', 'helmet', 'Docker', 'Render'],
    images: [],
    visual: 'download',
    code: 'https://github.com/SaranVelmani/media-downloader',
  },
  {
    name: 'Local Business Web Apps',
    tag: 'Trichy Highway Demos',
    year: '2026',
    accent: '#ff6a2b',
    purpose: 'Working web apps pitched to real shops near No.1 Tollgate, Trichy — each leads with a feature the big delivery apps can’t offer.',
    role: 'Designed, built and tested on real phones.',
    features: [
      'Restaurant QR menu with WhatsApp ordering and a Highway Pickup mode',
      'Supermarket catalogue with a customer credit ledger (khata)',
      'Garage job tracker with one-tap Breakdown SOS sending live GPS',
      'No backend, no build step: opens instantly on any phone',
    ],
    highlight: 'The restaurant demo renders a real, scannable table QR that encodes its own URL.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Geolocation API', 'WhatsApp deep links', 'GitHub Pages'],
    images: [restaurant, supermarket, garage],
    code: 'https://github.com/SaranVelmani/trichy-biz-demos',
    live: 'https://saranvelmani.github.io/trichy-biz-demos/',
  },
  {
    name: 'Web Portfolio',
    tag: 'Business Websites',
    year: '2026',
    accent: '#6366f1',
    purpose: 'Hand-coded, responsive demo websites: a SaaS landing page, a dental clinic and a coaching brand.',
    role: 'Designed and built every page by hand.',
    features: [
      'SaaS landing page with a pricing toggle',
      'Clinic site with a validated booking form and LocalBusiness schema',
      'Personal-brand site with lead capture and call booking',
      'No frameworks, no build step, fully responsive',
    ],
    highlight: 'Every page checked at 390px and 1280px before shipping.',
    stack: ['HTML', 'CSS', 'JavaScript', 'SEO', 'GitHub Pages'],
    images: [saas, dental, coach],
    code: 'https://github.com/SaranVelmani/web-portfolio',
    live: 'https://saranvelmani.github.io/web-portfolio/',
  },
]

export const work = {
  title: 'Full Stack Developer',
  company: 'Opalminds IT Solutions',
  place: 'Trichy',
  period: 'Oct 2024 – Present',
  points: [
    'Multi-agent LLM pipelines with LangGraph/LangChain for document intelligence and decisioning',
    'RAG retrieval for domain Q&A with streaming responses',
    'Java/Spring Boot services with Flyway-managed schemas',
    'Angular, React, Next.js and Astro frontends',
    'Python/FastAPI services and Supabase Edge Functions',
    'Docker, CI/CD and AWS (Lambda, S3, Step Functions)',
  ],
}

export const timeline = [
  { when: '2018 – 2020', what: 'Higher Secondary, Computer Science', where: 'Nadar Hr. Sec. School, Kovilpatti' },
  { when: '2020 – 2023', what: 'BSc Computer Science', where: 'Srimad Andavan Arts & Science College, Trichy' },
  { when: '2024', what: 'Frontend Developer Course', where: 'Besant Technologies, Chennai' },
  { when: 'Oct 2024 →', what: 'Full Stack Developer', where: 'Opalminds IT Solutions, Trichy' },
  { when: '2026', what: 'Independent builds', where: 'Mero, ClipDub, Gold AI, mt5-mcp, m-vpn, Pulse' },
]
