import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type SkillCardTone = "orange" | "blue" | "purple"

type SkillCardProps = {
  /** heading above the visual; leave out for a card that shows only its visual */
  title?: string
  tone?: SkillCardTone
  /** the stickers or cards shown under the heading */
  children: ReactNode
  className?: string
}

// A tinted heading over a visual, sitting straight on the page.
export default function SkillCard({ title, tone = "orange", children, className }: SkillCardProps) {
  return (
    <article className={cn("skill-card", title ? `skill-card--${tone}` : "skill-card--plain", className)}>
      {title && <h3 className="skill-card-title">{title}</h3>}
      <div className="skill-card-visual">{children}</div>
    </article>
  )
}
