import { useEffect, useState } from 'react'

// Extracts a pastel tint from the dominant non-white color of a product
// image, so each card background matches its image. Falls back to a
// deterministic pastel palette when the image can't be sampled (CORS,
// load failure) or is effectively monochrome.
const FALLBACK_TINTS = [
  '#fdeee4',
  '#e8f0fe',
  '#e9f7ef',
  '#fdf6e3',
  '#f4ecf7',
  '#e8f6f7',
  '#fce8ec',
  '#eef3e6',
]

const cache = new Map()

function pastelize(r, g, b) {
  // Blend ~72% toward white so the tint stays soft/pastel.
  const mix = (channel) => Math.round(channel * 0.28 + 255 * 0.72)
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
}

function sampleImage(img) {
  const size = 12
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)

  let r = 0
  let g = 0
  let b = 0
  let count = 0
  for (let i = 0; i < data.length; i += 4) {
    const pr = data[i]
    const pg = data[i + 1]
    const pb = data[i + 2]
    // Skip near-white/near-transparent background pixels so the tint
    // comes from the product itself, not the photo backdrop.
    if (pr > 235 && pg > 235 && pb > 235) continue
    if (data[i + 3] < 200) continue
    r += pr
    g += pg
    b += pb
    count += 1
  }
  if (count === 0) return null
  return pastelize(r / count, g / count, b / count)
}

export function useImageTint(src, seed = 0) {
  const fallback = FALLBACK_TINTS[Math.abs(seed) % FALLBACK_TINTS.length]
  const [tint, setTint] = useState(cache.get(src) ?? fallback)

  useEffect(() => {
    if (!src) return undefined
    if (cache.has(src)) {
      setTint(cache.get(src))
      return undefined
    }
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const color = sampleImage(img)
        if (color) {
          cache.set(src, color)
          if (!cancelled) setTint(color)
        }
      } catch {
        // Tainted canvas (no CORS on the image) — keep the fallback tint.
      }
    }
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src])

  return tint
}
