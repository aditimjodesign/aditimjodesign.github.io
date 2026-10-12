import type { CSSProperties, ReactNode } from "react"

import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card"
import { cn } from "@/lib/utils"

export type Tool = {
  name: string
  /** logo mark, rendered inside a square box */
  logo: ReactNode
}

type ToolPileProps = {
  /** logo cards tossed into a pile, first one at the bottom; each can be dragged out */
  tools: Tool[]
  className?: string
}

// Hand-placed spots (centre x/y as % of the stage) and tilts cycled across the
// pile so the cards look dropped on a desk rather than laid out on a grid.
const SPOTS = [
  { x: 34, y: 38, rotate: -12 },
  { x: 64, y: 32, rotate: 9 },
  { x: 50, y: 56, rotate: -4 },
  { x: 28, y: 66, rotate: 14 },
  { x: 70, y: 62, rotate: -9 },
  { x: 46, y: 30, rotate: 6 },
  { x: 58, y: 76, rotate: -15 },
  { x: 40, y: 50, rotate: 11 },
]

function pilePosition(index: number) {
  const spot = SPOTS[index % SPOTS.length]

  return {
    left: `${spot.x}%`,
    top: `${spot.y}%`,
    rotate: `${spot.rotate}deg`,
    zIndex: index + 1,
  } satisfies CSSProperties
}

export default function ToolPile({ tools, className }: ToolPileProps) {
  return (
    <DraggableCardContainer className={cn("tool-stage", className)}>
      {tools.map((tool, index) => (
        <div key={tool.name} className="tool-card-anchor" style={pilePosition(index)}>
          <DraggableCardBody className="tool-card">
            <span className="tool-card-logo">{tool.logo}</span>
            <span className="sr-only">{tool.name}</span>
          </DraggableCardBody>
        </div>
      ))}
    </DraggableCardContainer>
  )
}
