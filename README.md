# Saran V — Portfolio

Cinematic personal portfolio: projects, skills, cricket, football, drawing, photography and video editing.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · GSAP (ScrollTrigger, SplitText, MotionPath) · Lenis · lucide-react

## Run

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # production build into dist/
```

## Edit content

- **Projects, skills, bio, timeline:** `src/data/content.ts` — every entry comes from a real project.
- **Artwork / photos / videos:** drop files into `src/media/art`, `src/media/photo` or `src/media/video`.
  They appear automatically as masonry galleries with a full-screen viewer. File names become captions
  (`sunset-at-cauvery.jpg` → "Sunset at cauvery"). A video can have a poster image with the same base name.

## Deploy

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
Vercel: `vercel deploy --prod` (config in `vercel.json`). The Pages workflow builds with `BASE=/portfolio/`.

## Accessibility

Respects `prefers-reduced-motion` (no smooth scroll, pins or animations; all content visible),
skip link, keyboard-operable menu (Escape closes), flip cards and lightbox (arrows / Escape),
labelled form with inline validation.
