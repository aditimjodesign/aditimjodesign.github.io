import type { ReactNode } from "react"
import { Check, ChevronLeft, CircleEllipsis } from "lucide-react"

import { cn } from "@/lib/utils"

export type ChecklistItem = {
  label: string
  /** unchecked items show an empty ring, like a task still in progress */
  done?: boolean
  /** small sticker placed after the label */
  sticker?: ReactNode
}

type ChecklistCardProps = {
  title: string
  items: ChecklistItem[]
  className?: string
}

// A notes-app style to-do card: title bar with back and more icons, then a
// list of round yellow checkmarks.
export default function ChecklistCard({ title, items, className }: ChecklistCardProps) {
  return (
    <div className={cn("checklist-card", className)}>
      <div className="checklist-card-header" aria-hidden="true">
        <ChevronLeft className="checklist-card-back" />
        <span className="checklist-card-title">{title}</span>
        <CircleEllipsis className="checklist-card-more" />
      </div>
      <ul className="checklist-card-items" aria-label={title}>
        {items.map((item) => (
          <li key={item.label} className="checklist-card-item">
            <span
              className={cn("checklist-card-check", !item.done && "checklist-card-check--open")}
              aria-hidden="true"
            >
              {item.done && <Check />}
            </span>
            <span className="checklist-card-label">{item.label}</span>
            {item.sticker}
          </li>
        ))}
      </ul>
    </div>
  )
}
