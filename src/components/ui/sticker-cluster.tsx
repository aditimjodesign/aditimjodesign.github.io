import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

export type Sticker = {
  label: string
  /** sticker fill */
  color: string
  /** label colour, a dark shade of the fill */
  ink: string
  /** tilt in degrees */
  rotate: number
}

type StickerClusterProps = {
  stickers: Sticker[]
  className?: string
  "aria-label"?: string
}

// A loose pile of rounded label stickers that overlap slightly, like a
// laptop lid. Each one straightens and lifts on hover.
export default function StickerCluster({
  stickers,
  className,
  "aria-label": ariaLabel,
}: StickerClusterProps) {
  return (
    <ul className={cn("sticker-cluster", className)} aria-label={ariaLabel}>
      {stickers.map((sticker, index) => (
        <li
          key={sticker.label}
          className="sticker"
          style={
            {
              "--sticker-color": sticker.color,
              "--sticker-ink": sticker.ink,
              "--sticker-rotate": `${sticker.rotate}deg`,
              zIndex: index + 1,
            } as CSSProperties
          }
        >
          {sticker.label}
        </li>
      ))}
    </ul>
  )
}
