import { useCallback, useState } from "react"

// Tracks whether an <img> has finished loading, so a skeleton can show until it
// does. Spread `imgProps` onto the image. The ref catches images that were
// already cached before React attached onLoad; a failed image also counts as
// done so the shimmer never runs forever.
export function useImageLoaded() {
  const [loaded, setLoaded] = useState(false)
  const done = useCallback(() => setLoaded(true), [])
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  return { loaded, imgProps: { ref, onLoad: done, onError: done } }
}
