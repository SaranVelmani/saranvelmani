// Drop your own files into src/media/art, src/media/photo or src/media/video and they
// appear on the site automatically — no code changes. File names become captions:
// "sunset-at-cauvery.jpg" → "Sunset at cauvery". Videos can have a poster image with the
// same base name (e.g. "match-edit.mp4" + "match-edit.jpg" in src/media/video).

type Item = { src: string; title: string; poster?: string }


const art = import.meta.glob('../media/art/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }) as Record<string, string>
const photo = import.meta.glob('../media/photo/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }) as Record<string, string>
const video = import.meta.glob('../media/video/*.{mp4,webm,MP4,WEBM}', { eager: true, import: 'default' }) as Record<string, string>
const posters = import.meta.glob('../media/video/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }) as Record<string, string>

const base = (p: string) => p.split('/').pop()!.replace(/\.[^.]+$/, '')
const caption = (p: string) => {
  const s = base(p).replace(/[-_]+/g, ' ').trim()
  return s.charAt(0).toUpperCase() + s.slice(1)
}
const toItems = (m: Record<string, string>): Item[] =>
  Object.keys(m).sort().map((k) => ({ src: m[k], title: caption(k) }))

export const artworks = toItems(art)
export const photos = toItems(photo)
export const videos: Item[] = Object.keys(video).sort().map((k) => {
  const poster = Object.keys(posters).find((p) => base(p) === base(k))
  return { src: video[k], title: caption(k), poster: poster ? posters[poster] : undefined }
})
export type MediaItem = Item
